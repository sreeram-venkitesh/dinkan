const editor = document.getElementById('editor');
const latex = document.getElementById('latex');
const messageElement = document.getElementById('messages');
const nickname = sessionStorage.getItem("nickname"); //nickname to here from index.ejs 

var generator = new latexjs.HtmlGenerator({ hyphenate: false })

generator = latexjs.parse(editor.value, { generator: generator })

var socket = io('/');

socket.emit('join-room',roomId)

socket.on('user-connected',(userId)=>{
    console.log('User joined : ',userId)
  })

// document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
// latex.innerHTML = '';
document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
latex.appendChild(generator.domFragment())

function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

function insert(command) {
    console.log(command)
    switch(command){
        case 'section' : insertAtCursor(editor,'\\section{}')
                         break
        case 'listitem' : insertAtCursor(editor,'\\begin{itemize}\n    \\item\n\\end{itemize}')
                          break;
        case 'eqn' : insertAtCursor(editor,'\\[ x^n + y^n = z^n \\]')
                          break;
    }
}


function keystop(){
    var keystoppedTimer = null;
    var keystoppedInputs = document.getElementsByTagName('textarea');
    for (var i = 0, l = keystoppedInputs.length; i < l; i++) {
        keystoppedInputs[i].addEventListener('keydown', function(event){
            clearTimeout(keystoppedTimer);
            keystoppedTimer = setTimeout(function() {
                event.target.dispatchEvent( new Event('keystopped') );
            }, 1000);
        }, false);
    }
};
keystop();

editor.addEventListener('keystopped', ()=>{
    console.log(editor.value)

    var generator = new latexjs.HtmlGenerator({ hyphenate: false, stylesAndScripts : "font-size:30px" })

    generator = latexjs.parse(editor.value, { generator: generator })

    // document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
    latex.innerHTML = '';
    document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
    latex.appendChild(generator.domFragment())

});

editor.addEventListener('keyup',()=>{
    socket.emit('chat message', editor.value, roomId ,nickname);
    return false;
});

socket.on('chat message', function(msg){
    editor.value = String(msg);
    var generator = new latexjs.HtmlGenerator({ hyphenate: false, stylesAndScripts : "font-size:30px" })

    generator = latexjs.parse(editor.value, { generator: generator })

    // document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
    latex.innerHTML = '';
    document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
    latex.appendChild(generator.domFragment())
});

socket.on('new peer', (number)=>{
    console.log('New person joined, total : ',number)
})

socket.on('new edit', (msg) => {
    var newLog = document.createElement("LI"); 

    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let editmsg= time+msg;

    var textnode = document.createTextNode(editmsg);
    newLog.appendChild(textnode);
    //messageElement.appendChild(newLog);
    messageElement.insertBefore(newLog, messageElement.childNodes[0]);
    
  })

var shareButton = document.getElementById('shareButton');
shareButton.onclick = function(){
    var dummy = document.createElement('input'),
    text = window.location.href.split('editor/')[1];

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    shareButton.innerHTML = '<strong>Invite Code Copied!</strong>';
    setTimeout(() =>shareButton.innerHTML="<strong>Share</strong>",1000);
}

const downloadButton = document.getElementById('downloadButton')
downloadButton.addEventListener('click',()=>{
    console.log('Download clicked')
})