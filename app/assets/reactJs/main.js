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
      count: 0,
    };
  },
  handleWhisperPost: function(whisper) {
    // Append the new whisper
    var whispers = this.props.data;
    var newWhispers = [whisper].concat(whispers);    
    this.setProps({
      data: newWhispers,
      count: this.props.count + 1
    });
  },
  handleTimeLeftSync: function() {
    // One second left
    var data = this.props.data;
    for(i = 0; i < data.length; i++) {
      if (data[i].timeLeft > 0) {
        data[i].timeLeft -= 1;
      }
    }
    // Clean up!
    // data = data.filter(function(whisper) {
    //   if (whisper.timeLeft > 0) {
    //     return true;
    //   }
    //   return false;
    // });
    this.setProps({
      data: data
    });
  },
  handleWhisperTimeChange: function(uid, time) {
    var data = this.props.data;
    var whisper = _.find(data, {key: uid});

    whisper.timeLeft += time;
    whisper.timeLeft = whisper.timeLeft < 0 ? 0 : whisper.timeLeft;

    this.setProps({
      data: data
    });
  },
  render: function() {
    return (
      <div className="whisper">    
        <WhisperInput author={this.props.author} 
          count={this.props.count}
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
      placeholders: [
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
        "I'm here with you...",
      ],
      currentPlaceholder: ''
    };
  },
  refreshCurrentPlaceholder: function() {  
    this.state.currentPlaceholder = _.sample(this.state.placeholders);    
  },
  componentDidMount: function() {    
    this.refs.whisperBox.getDOMNode().focus();
    this.refreshCurrentPlaceholder();
  },  
  handleSubmit: function(e) {
    e.preventDefault();

    // Ignore empty 
    if (this.refs.whisperBox.getDOMNode().value.trim().length < 1) {
      return;
    }

    // Update whisper list
    this.props.onWhisperPost({
      key: this.props.count,
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
    var listNodes = _.map(this.props.data, function(whisper) {
      return (
        <WhisperPost 
          key={whisper.key}
          uid={whisper.key}
          author={whisper.author} 
          text={whisper.text}
          timeLeft={whisper.timeLeft}
          onWhisperTimeChange={this.onWhisperTimeChange} />
      );
    }, {onWhisperTimeChange: this.props.onWhisperTimeChange});

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
    $(time).css({'color': '#000'}).animate({color: color}, 2500);
  },
  render: function() {

    // Autolinked text
    var linkedText = Autolinker.link(this.props.text.trim(), {truncate: 29});

    // Whisper end, fade out
    if (this.props.timeLeft < 1) {
      var node = this.getDOMNode();
      $(node).fadeOut(2500, function() {
        $(node).empty();
      });
    }

    return(
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="whisperPost" id={this.props.uid}>
            <div className="author">
              <span>@{this.props.author.substr(this.props.author.length - 8)} </span>              
            </div>
            <div className="text">
              <span dangerouslySetInnerHTML={{__html: linkedText}} />
            </div>
            <div className="timePanel">
              <TimeButton prefix={'+'} uid={this.props.uid} minutes={3} onWhisperTimeChange={this.props.onWhisperTimeChange} />
              <TimeButton prefix={'-'} uid={this.props.uid} minutes={-1} onWhisperTimeChange={this.props.onWhisperTimeChange} />
              <span className="time">
                { ('0' + Math.floor(this.props.timeLeft / 60)).slice(-2) + ":" + ('0' + this.props.timeLeft % 60).slice(-2) + ' left' }
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
    this.props.onWhisperTimeChange(this.props.uid, this.props.minutes * 60);

    var button = $(this.getDOMNode());
    button.attr('disabled', 'disabled');
    button.animate({'color' : '#ccc'}, 250);
  },
  render: function() {
    return (
      <button onClick={this.handleClick} type="button" className="timeButton btn btn-default btn-xs">
        { this.props.prefix + Math.abs(this.props.minutes) }
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
