const editor = document.getElementById('editor');
const latex = document.getElementById('latex');

var generator = new latexjs.HtmlGenerator({ hyphenate: false })

generator = latexjs.parse(editor.value, { generator: generator })

// document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
latex.innerHTML = '';
document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
latex.appendChild(generator.domFragment())

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
    // latex.innerText = editor.value
    
    // let generator = new HtmlGenerator({ hyphenate: false })

    // let doc = parse(editor.value, { generator: generator }).htmlDocument()
    // latex.innerHTML = doc.documentElement.outerHTML
    // console.log(doc.documentElement.outerHTML)

    var generator = new latexjs.HtmlGenerator({ hyphenate: false, stylesAndScripts : "font-size:30px" })

    generator = latexjs.parse(editor.value, { generator: generator })

    // document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
    latex.innerHTML = '';
    document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
    latex.appendChild(generator.domFragment())
});