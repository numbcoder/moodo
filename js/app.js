 function exportFile(fileName, fileData) {
  try {
    var Blob = new ( window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder );
    Blob.append(fileData);
    saveAs(Blob.getBlob("text/plain;charset=utf-8"), fileName);
  } catch (e) {
    console.log(e);
    return;
  }
};

window.onload = function() {

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/textmate");

  var MarkDownMode = require("ace/mode/markdown").Mode;
  editor.getSession().setMode(new MarkDownMode());

  editor.getSession().setTabSize(2);
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setUseWrapMode(true);
  editor.setShowPrintMargin(false);

  var preview = document.getElementById('preview');

  // Set default options
  marked.setOptions({
    gfm: true,
    pedantic: false,
    sanitize: true,
    // callback for code highlighter
    highlight: function(code, lang) {
      if (lang === 'js') {
        return javascriptHighlighter(code);
      }
      return code;
    }
  });

  var getText = function(){
    return editor.getSession().getValue();
  };

  var loadHtml = function(text){
    // preview.innerHTML = markdown.toHTML(text);
    preview.innerHTML = marked(text);
  };

  var saveDraft = function(text){
    localStorage.setItem('moodo', text);
  };

  var getDraft = function(){
    return localStorage.getItem('moodo');
  };

  var codeHighlight = function(){
    var codes = document.querySelectorAll('pre code'), len = codes.length, i;

    for(i = 0; i < len; i++){
      hljs.highlightBlock(codes[i], '    ');
    }
  };

  var draft = getDraft();
  if(draft){
    editor.getSession().setValue(draft);
    loadHtml(draft);
    codeHighlight();
  }

  var t;
  var saveAndHlight = function(){
    clearTimeout(t);
    t = setTimeout(function(){
      codeHighlight();
      saveDraft(getText());
    }, 2000);
  };

  editor.getSession().on('change', function(a){
    var text = getText();
    loadHtml(text);
    saveAndHlight();
  });

/*
  setTimeout(function(){
    console.log(234);
    exportFile('a.md', 'hello world~~~~~~~~~~~~~!');
  }, 5000);
*/

};







