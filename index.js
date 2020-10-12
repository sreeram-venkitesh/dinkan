const express = require('express')
const app = express()

const http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(express.json());       
app.use(express.urlencoded()); 


const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 4)


app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/learn',(req,res)=>{
    res.render('learn')
})

app.get('/about',(req,res)=>{
    res.render('about')
})

app.post('/',(req,res)=>{
    res.redirect(`/editor/${nanoid()}`)
    console.log(req.body.nickname); //console printing of input...dark test
})

app.post('/join',(req,res)=>{
    res.redirect(`/editor/${req.body.code}`)
    console.log(req.body.uname);
    console.log(req.body.code); //console printing of input...dark test
})

// app.get('/editor',(req,res)=>{
//     res.render('editor')
// })

app.get('/editor/:room',(req,res)=>{
    res.render('editor',{roomId:req.params.room})
})

numClients = {}

io.on('connection', (socket) => {

    socket.on('join-room',(roomId,userId)=>{
        if (numClients[roomId] === undefined) {
            numClients[roomId] = 1;
        } else {
            numClients[roomId] = numClients[roomId]+1;
        }
        console.log(numClients)
        io.to(roomId).emit('new peer',numClients[roomId])
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    })

    socket.on('chat message', (msg,roomId,nickname) => {
        io.to(roomId).emit('chat message', msg);
        //dark edited
        
        let editmsg= " :-  Last edited by " +nickname;
        io.to(roomId).emit('new edit',editmsg);
        
        //dark edit
      });

    socket.on('disconnect', (roomId) => {
        numClients[roomId]--;
        io.to(roomId).emit('new peer',numClients[roomId])
        console.log('user disconnected');
    });   
});



const PORT = process.env.PORT || 5000

http.listen(PORT, ()=>{
    console.log('Server started')
})