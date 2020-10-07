const express = require('express')
const app = express()
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');


app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/learn',(req,res)=>{
    res.render('learn')
})

app.get('/about',(req,res)=>{
    res.render('about')
})

app.get('/editor',(req,res)=>{
    res.render('editor')
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log('Server has started')
})