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
  render: function() {
    return (
      <div className="whisper">    
        <WhisperInput author={this.props.author} onWhisperPost={this.handleWhisperPost} />
        <WhisperList data={this.props.data}/>    
      </div>
    );
  }
});


var WhisperInput = React.createClass({
  componentDidMount: function() {    
    this.refs.whisperBox.getDOMNode().focus();
  },
  handleSubmit: function(e) {
    e.preventDefault();

    // Update whisper list
    this.props.onWhisperPost({
      key: Math.random(), 
      author: this.props.author,
      text: this.refs.whisperBox.getDOMNode().value,
    });

    // Reset
    this.refs.whisperBox.getDOMNode().value = "";
    this.refs.whisperBox.getDOMNode().focus();
  },
  render: function() {

    // Random placeholders
    var placeholders = [
      "...",
      "Something good happen?",
      "Why are good things so hard?",
      "Time does not exists...",
      "Tame your sadness!",
      "I won't judge...",
      "It's ok...",
    ];
    var chosenPlaceholder = _.sample(placeholders);

    return (      
      <div className="row">
        <form className="whisperInput col-md-6" onSubmit={this.handleSubmit}>
          <div className="input-group">
              <input className="form-control" ref="whisperBox" type="text" placeholder={chosenPlaceholder} />
              <span className="input-group-btn">
                <button className="btn btn-default" type="submit" value="Post">Whisper</button>
              </span>
          </div>
        </form>
      </div>
    );
  }
});


var WhisperList = React.createClass({
  render: function() {
    var listNodes = this.props.data.map(function(whisper) {
      return (
        <WhisperPost 
          key={whisper.key}
          author={whisper.author} 
          text={whisper.text} />
      );
    });
    return (
      <div className="whisperList">
        {listNodes}
      </div>
    );
  }
});


var autolinker = new Autolinker({truncate: 29});
var WhisperPost = React.createClass({
  render: function() {

    // Autolinked text
    var linkedText = autolinker.link(this.props.text);

    return(
      <div className="row">
        <div className="col-md-6">
          <div className="whisperPost" key={this.props.key}> 
            <span className="author"><small><em><strong>@{this.props.author}</strong> </em></small></span>
            <br />
            <span className="text" dangerouslySetInnerHTML={{__html: linkedText}} />            
          </div>
        </div>
      </div>
    );
  }
});


var data = [
  {key: 0, author: (new Date).getTime(), text: "Say whatever you want"}
];


React.render(
	<Whisper data={data} />,
	document.getElementById('main')
);
