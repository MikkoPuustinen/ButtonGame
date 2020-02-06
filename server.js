const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
const uuid = require('uuid/v4');
const path = require('path');
const session = require('express-session');

const cors = require('cors')

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

app.use(cookieParser());
app.use(session({   

    secret: 'example',
    resave: false,
    saveUninitialized: true,
    
}));

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,  'build');
app.use(express.static(publicPath));
/*app.listen(port, () => {
   console.log(`Server is up on port ${port}!`);
});*/


let Game = require('./Game');
let game = new Game();
let socket = require('socket.io');

//port = process.env.PORT || 3001;

let server = app.listen(port);

let scores = [];

let io = socket(server);



app.get('/start', (req, res) => {
    console.log(req.cookies, "cookies")
    let user;
    if (req.cookies['uuid']) {
        console.log("cookie found")
        user = scores.find(function(e) {
            return e.name == req.cookies['uuid']
        });
        if (!user) {
            user = {
                name: req.cookies['uuid'],
                score: 20   
            }
            scores.push(user);  
        }
    } else {
        console.log("new user")
        user = {
            name: uuid(),
            score: 20
        };
        scores.push(user);
        res.cookie('uuid', user.name, {maxAge: 900000000});
    }
    let senduser = {
        name: user.name,
        score: user.score,
        distance: game.getDistanceToNextReward()
    }
   
    res.send(senduser);
})

app.get('/reset', (req, res) => {
    let user;
    if (req.cookies['uuid']) {

        user = scores.find(function(e) {
            return e.name == req.cookies['uuid']
        });
        if (!user) {
            user = {
                name: req.cookies['uuid'],
                score: 20   
            }
            scores.push(user);  
        }
    } else {
        user = {
            name: uuid(),
            score: 20
        };
        scores.push(user);
        res.cookie('uuid', user.name, {maxAge: 900000000});
    }
    user.score = 20
    console.log(user)
    res.send(user)
    
})


app.get('/click', (req, res) => {
    var user = scores.find(function(e) {
        return e.name == req.cookies['uuid']
    })  
    if (user) {
        if (user.score < 1) {
            res.send({msg: 'error'})
        } else {
            user.score += game.buttonPress();
            res.send(user);
            console.log("clicked", user.score)
        }

        
    }
    console.log(user)
    
})

io.on('connection', function(socket) {
    socket.on('click', function() {        
        io.emit('clicked', game.getDistanceToNextReward());
    })
})