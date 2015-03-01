// Whisper
// Anonymous temporal short-message board
// by Andrés Villalobos [andresalvivar@gmail.com twitter.com/matnesis]

// Whisper
// 	WhisperInput
// 	WhisperList
// 		WhisperPost


var Whisper = React.createClass({
  render: function() {
    return (
      <div className="whisper">    
        <WhisperInput />
        <WhisperList data={this.props.data}/>    
      </div>
    );
  }
});


var WhisperInput = React.createClass({
  render: function() {
    return (
      <div className="whisperInput">
      </div>
    );
  }
});


var WhisperList = React.createClass({
  render: function() {
    var listNodes = this.props.data.map(function(whisper) {
      return (
        <WhisperPost 
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


var converter = new Showdown.converter();
var WhisperPost = React.createClass({
  render: function() {
    var markupToHtml = converter.makeHtml(this.props.text);
    return(
      <div className="whisperPost container" author={this.props.author}>
        <span className="author">{this.props.author}</span>: 
        <span className="text" dangerouslySetInnerHTML={{__html: $(markupToHtml).html()}} />
      </div>
    );
  }
});


var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];


React.render(
	<Whisper data={data} />,
	document.getElementById('main')
);
