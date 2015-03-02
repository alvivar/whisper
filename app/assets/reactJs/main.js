// Whisper
// Anonymous temporal short-message board
// by Andrés Villalobos [andresalvivar@gmail.com twitter.com/matnesis]

//  Whisper
//    WhisperInput
//    WhisperList
//      WhisperPost


var autolinker = new Autolinker({truncate: 29, twitter: false});

var constant = {
  whisper_duration: 180,
  list_refresh_rate: 1000,
  seconds_to_substract: 1,
};


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
      newData[i].timeLeft -= constant.seconds_to_substract
    }
    // Clean up!
    newData = newData.filter(function(whisper) {
      if (whisper.timeLeft > 0)
        return true;
      return false;
    });
    this.setProps({
      data: newData
    });
  },
  render: function() {
    return (
      <div className="whisper">    
        <WhisperInput author={this.props.author} onWhisperPost={this.handleWhisperPost} />
        <WhisperList data={this.props.data} onTimeLeftSync={this.handleTimeLeftSync} />
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
      "...",
      "Something good happened?",
      "Why are good things so hard?",
      "Time does not exists...",
      "Tame your sadness!",
      "I won't judge you...",
      "It's ok...",
      "Tell me whatever you want...",
      "I don't know...",
      "Forgive yourself!",
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
      timeLeft: constant.whisper_duration,
    });

    // Reset
    this.refreshCurrentPlaceholder();
    this.refs.whisperBox.getDOMNode().value = '';
    this.refs.whisperBox.getDOMNode().focus();
  },
  render: function() {
    return (      
      <div className="row">
        <form className="whisperInput col-md-6" onSubmit={this.handleSubmit}>
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
      this.interval = setInterval(this.props.onTimeLeftSync, constant.list_refresh_rate);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },  
  render: function() {
    var listNodes = this.props.data.map(function(whisper) {
      return (
        <WhisperPost 
          key={whisper.key}
          author={whisper.author} 
          text={whisper.text}
          timeLeft={whisper.timeLeft} />
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

    $(node).hide().fadeIn(500);

    var color = $(time).css('color');
    $(time).css({'color': '#000'}).animate({'color': color}, 1000);
  },
  render: function() {

    // Short message clean up
    // this.props.text = this.props.text.trim();
    // if (this.props.text.length > 140) {
    //   this.props.text = this.props.text.substr(0, 140);
    // }

    // Autolinked text
    var linkedText = autolinker.link(this.props.text.trim());

    return(
      <div className="row">
        <div className="col-md-6">
          <div className="whisperPost" key={this.props.key}>
            <div className="author">
              <span>@{this.props.author.substr(this.props.author.length - 8)} </span>              
            </div>
            <div className="text">
              <span dangerouslySetInnerHTML={{__html: linkedText}} />
            </div>
            <div className="timePanel">
              <button type="button" className="btn btn-default btn-xs">{'+3'}</button>       
              <span className="time"><span>{this.props.timeLeft}</span>s left </span>
            </div>     
          </div>
        </div>
      </div>
    );
  }
});


var data = [
  
];


React.render(
	<Whisper data={data} />,
	document.getElementById('main')
);
