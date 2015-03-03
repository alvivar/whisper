// Whisper
// Anonymous temporal short-message board
// by Andrés Villalobos [andresalvivar@gmail.com twitter.com/matnesis]

//  Whisper
//    WhisperInput
//    WhisperList
//      WhisperPost


var Whisper = React.createClass({  
  getDefaultProps: function() {
    return {
      author: (new Date).getTime().toString(),
      data: [],
    };
  },
  handleWhisperPost: function(whisper) {
    // Append the new whisper
    var whispers = this.props.data;
    var newWhispers = [whisper].concat(whispers);    
    this.setProps({
      data: newWhispers
    });
  },
  handleTimeLeftSync: function() {
    // One second left
    var newData = this.props.data;
    for(i = 0; i < newData.length; i++) {
      if (newData[i].timeLeft > 0) {
        newData[i].timeLeft -= 1;
      }
    }
    // Clean up!
    // newData = newData.filter(function(whisper) {
    //   if (whisper.timeLeft > 0) {
    //     return true;
    //   }
    //   return false;
    // });
    this.setProps({
      data: newData
    });
  },
  handleWhisperTimeChange: function(whisperKey, plusTime) {
    var newData = this.props.data;
    var newWhisper = _.find(newData, {key: whisperKey})
    newWhisper.timeLeft += plusTime;

    this.setProps({
      data: newData
    });
  },
  render: function() {
    return (
      <div className="whisper">    
        <WhisperInput author={this.props.author} 
          onWhisperPost={this.handleWhisperPost} />
        <WhisperList data={this.props.data} 
          onTimeLeftSync={this.handleTimeLeftSync} 
          onWhisperTimeChange={this.handleWhisperTimeChange} />
      </div>
    );
  }
});


var WhisperInput = React.createClass({
  getInitialState: function() {
    return {
      currentPlaceholder: ''
    };
  },
  refreshCurrentPlaceholder: function() {
    var placeholders = [
      "",
      "Something good happened?",
      "Why are good things so hard?",
      "Time doesn't exists...",
      "Tame your sadness!",
      "I won't judge you...",
      "It's ok...",
      "Tell me whatever you want...",
      "Forgive yourself!",
      "Believe in yourself!",
      "Hate is useless...",
      "Lots of things aren't fair...",
      "Who am I?",
      "Who are you?",
      "I'm here with you..."
    ];
    this.state.currentPlaceholder = _.sample(placeholders);    
  },
  componentDidMount: function() {    
    this.refs.whisperBox.getDOMNode().focus();
    this.refreshCurrentPlaceholder();
  },  
  handleSubmit: function(e) {
    e.preventDefault();

    // Update whisper list
    this.props.onWhisperPost({
      key: Math.random(), 
      author: this.props.author,
      text: this.refs.whisperBox.getDOMNode().value,
      timeLeft: 90
    });

    // Reset
    this.refreshCurrentPlaceholder();
    this.refs.whisperBox.getDOMNode().value = '';
    this.refs.whisperBox.getDOMNode().focus();
  },
  render: function() {
    return (      
      <div className="row">
        <form className="whisperInput col-md-6 col-md-offset-3" onSubmit={this.handleSubmit}>
          <div className="input-group">
              <input className="form-control" ref="whisperBox" type="text" placeholder={this.state.currentPlaceholder} />
              <span className="input-group-btn">
                <button className="btn btn-default" type="submit" value="Post">whisper</button>
              </span>
          </div>
        </form>
      </div>
    );
  }
});


var WhisperList = React.createClass({
  componentDidMount: function() {
      this.interval = setInterval(this.props.onTimeLeftSync, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },  
  render: function() {
    var onWhisperTimeChange = this.props.onWhisperTimeChange;
    var listNodes = this.props.data.map(function(whisper, onWhisperTimeChange) {
      return (
        <WhisperPost 
          key={whisper.key}
          author={whisper.author} 
          text={whisper.text}
          timeLeft={whisper.timeLeft}
          onWhisperTimeChange={onWhisperTimeChange} />
      );
    });
    return (
      <div className="whisperList">
        {listNodes}
      </div>
    );
  }
});


var WhisperPost = React.createClass({
  componentDidMount: function() {
    var node = this.getDOMNode();
    var time = $(node).find('.time');

    // Fade in
    $(node).hide().fadeIn(500);
    var color = $(time).css('color');
    $(time).css({'color': '#000'}).animate({color: color}, 2000);
  },
  render: function() {

    // Autolinked text
    var linkedText = Autolinker.link(this.props.text.trim(), {truncate: 29});

    // Whisper end, fade out
    if (this.props.timeLeft < 1) {
      var node = this.getDOMNode();
      $(node).fadeOut(2000, function() {
        $(node).empty();
      });
    }

    return(
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="whisperPost" key={this.props.key}>
            <div className="author">
              <span>@{this.props.author.substr(this.props.author.length - 8)} </span>              
            </div>
            <div className="text">
              <span dangerouslySetInnerHTML={{__html: linkedText}} />
            </div>
            <div className="timePanel">
              <TimeButton prefix={'+'} minutes={3} key={this.props.key} onWhisperTimeChange={this.props.onWhisperTimeChange} />
              <TimeButton prefix={'-'} minutes={1} key={this.props.key} onWhisperTimeChange={this.props.onWhisperTimeChange} />
              <span className="time">
                { ('0' + Math.floor(this.props.timeLeft / 60)).slice(-29) + ":" + ('0' + this.props.timeLeft % 60).slice(-2) + ' left' }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


var TimeButton = React.createClass({
  handleClick: function(e) {
    this.props.onWhisperTimeChange(this.props.key, this.props.minutes * 60);
  },
  render: function() {
    return (
      <button onClick={this.handleClick} type="button" className="timeButton btn btn-default btn-xs">
        { this.props.prefix + this.props.minutes }
      </button>
    );
  }
});


var data = [
  
];


React.render(
	<Whisper data={data} />,
	document.getElementById('main')
);
