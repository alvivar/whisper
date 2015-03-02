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
      newData[i].timeLeft -= 1;
    }
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
      timeLeft: 180
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
    this.interval = setInterval(this.props.onTimeLeftSync, 1000);
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


var autolinker = new Autolinker({truncate: 29, twitter: false});
var WhisperPost = React.createClass({
  render: function() {

    // Short message clean up
    this.props.text = this.props.text.trim();
    if (this.props.text.length > 140) {
      this.props.text = this.props.text.substr(0, 140);
    }

    // Autolinked text
    var linkedText = autolinker.link(this.props.text);

    return(
      <div className="row">
        <div className="col-md-6">
          <div className="whisperPost" key={this.props.key}> 
            <span className="author"><strong>@{this.props.author.substr(this.props.author.length - 8)}</strong> </span>
            <span className="time"><span>{this.props.timeLeft}</span>s left </span>
            <br />
            <span className="text" dangerouslySetInnerHTML={{__html: linkedText}} />
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
