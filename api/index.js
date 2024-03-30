
// const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const express = require('express');
const { v4: uuid } = require('uuid')

const { generateFile } = require('./generateFile');
const { executePy } = require('./executePy');
const cors = require('cors')
const jobs = require('./models/Job')
const testRoute = require('./routes/testRoute')
const questionRoute = require('./routes/questionRoute')
const testCaseRoute = require('./routes/testCaseRoute')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const courseRoute = require('./routes/course/courseRoute')
// const nodemailer = require('nodemailer')
const sockets = []
const rooms = {}
const socketIds = {}
const games = {}
const friendRequests = {}

const PORT = process.env.PORT;
dotenv.config();

const app = express();
const http = require("http").createServer(app);
const io = require('socket.io')(http,
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(helmet());
app.use(morgan("common"));
app.use(cors())



// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'structoclient@gmail.com',
//         pass: 'ClientStructo1234'
//     }
// });
// transporter.verify().then(console.log).catch(console.error);

io.on("connection", (socket) => {
    sockets.push(socket.id)

    socket.on("initiate userId connection", ({ }) => {
        socket.emit("request userId", {})
    })


    socket.on("save userId", ({ userId }) => {
        socketIds[userId] = socket.id

        console.log(socketIds)
        socket.emit("saved socketId", {})
    })
    //actual room configurations
    socket.on("join room -2", ({ roomId }) => {

        let room = {
            id: roomId,
            people: []
        }
        rooms.push(room)
        socket.join(room.id)
        io.to(room.id).emit("welcome message", { message: 'welcome my bois to this private room' })
    })



    socket.on("challenge", ({ fromId, toId, testId }) => {
        console.log(`challenge request from ${fromId} to ${toId}`)
        console.log('t socket id = ', socketIds[toId])
        io.sockets.to(socketIds[toId]).emit("challenge request", { fromId, toId, testId })
    })
    socket.on("accept challenge", ({ fromId, toId, testId }) => {

        console.log(fromId, toId, testId)
        let challengeId = uuid()
        io.sockets.to(socketIds[fromId]).emit("challenge accepted", { fromId, toId, challengeId, testId })
        if (io.sockets.sockets.get(socketIds[fromId]) !== undefined && io.sockets.sockets.get(socketIds[toId]) !== undefined) {
            rooms[challengeId] = { challengeId, members: [fromId, toId] }
            io.sockets.sockets.get(socketIds[fromId]).join(challengeId)
            io.sockets.sockets.get(socketIds[toId]).join(challengeId)
            io.to(challengeId).emit("challenge welcome", { message: 'welcome to the challenge bossmans', challenge: { testId } })
            io.to(challengeId).emit("challenge redirect", { challenge: { testId, challengeId } })
            console.log("yoooo it works dubs ww]]]]")
        }

    })
    socket.on("decline challenge", ({ fromId, toId }) => {
        io.sockets.to(socketIds[fromId]).emit("challenge declined", { fromId, toId })
    })

    socket.on("opponent update", ({ challengeId, message, update }) => {
        // for (let member of rooms[challengeId].members) {
        // if (socketIds[member] !== socket.id) {
        socket.broadcast.to(challengeId).emit("opponent update", { challengeId, message, update })
        // }
        // }
    })
    socket.on("end challenge", ({ challengeId, fromId }) => {
        // for (let member of rooms[challengeId].members) {
        // if (socketIds[member] !== socket.id) {
        console.log(rooms[challengeId])
        let loserId;
        loserId = fromId === rooms[challengeId].members[1] ? rooms[challengeId].members[0] : rooms[challengeId].members[1]
        io.to(challengeId).emit("challenge winner", { winnerId: fromId, loserId })
        delete rooms[challengeId]
        // }
        // }
    })

    function configureLiveGameSocket(socket) {

        socket.on("host game request", ({ fromId, testId }) => {
            let gameId = uuid()
            let gamePin = (Math.floor(Math.random() * 1000)).toString()
            let game = {
                pin: gamePin,
                id: gameId,
                host: fromId,
                participants: [],
                participantNames: [],
                removed: [],
                progress: {},
                leaderboard: [],
                scores: {},
                testId
            }
            games[gameId] = game
            // console.log(games)
            socket.join(gameId)
            socket.emit("game created", { message: "successfully created the room", game })
        })

        socket.on("join game", ({ gamePin, requestId, requestName }) => {
            console.log('reached the join socket function')
            let x = 0
            for (let gameId of Object.keys(games)) {
                x += 1
                // console.log(game)
                let game = games[gameId]
                let { pin, participants, participantNames, id, leaderboard } = game
                // console.log('participants', participants)
                let repeatCheck = participants.includes(requestId)
                console.log(repeatCheck)
                console.log(pin === gamePin)
                if (pin === gamePin && repeatCheck === false) {
                    console.log('entered')
                    let temp = participants
                    temp.push(requestId)
                    game.participants = temp
                    let nameTemp = participantNames
                    nameTemp.push(requestName)
                    game.participantNames = nameTemp


                    game.scores[requestId] = 0;

                    if (socketIds[requestId] !== undefined) {
                        io.sockets.sockets.get(socketIds[requestId]).join(id)
                        console.log('participants', game.participants)
                        console.log(' from the socket room')
                        console.log()
                        io.to(id).emit("new player", { participants, participantNames })
                        socket.emit("joined game", { id })
                    } else {
                        console.log('socket problem')
                    }
                    break
                }
                console.log(x)
            }
        })
        socket.on("remove player", ({ removeId, gameId }) => {
            console.log(removeId, gameId)
            let game = games[gameId]
            if (game !== undefined) {

                const { participants, id, removed } = game
                if (id === gameId) {
                    let temp = participants.filter((par, i) => {
                        return par !== removeId
                    })
                    game.participants = temp
                    let removedTemp = removed
                    removedTemp.push(removeId)
                    game.removed = removedTemp
                    console.log(game.participants)
                    io.to(gameId).emit("player removed", { removeId })
                }
            }

        })
        socket.on("leave game", ({ removeId, gameId }) => {
            console.log(removeId, gameId)
            let game = games[gameId]
            if (game !== undefined) {

                const { participants, id, removed, participantNames } = game
                if (id === gameId) {
                    let index;
                    let temp = participants.filter((par, i) => {
                        if (par === removeId) {
                            index = i
                        }
                        return par !== removeId
                    })
                    game.participants = temp

                    let temp2 = participantNames.filter((parName, i) => {
                        return index !== i;
                    })

                    game.participantNames = temp2

                    console.log(game.participants)
                    // io.to(gameId).emit("player removed", { removeId })
                    io.to(gameId).emit('refresh game info', {})
                }
            }

        })
        socket.on("start game", ({ gameId }) => {
            console.log('server received the start message')
            io.to(gameId).emit("start game", { game: games[gameId] })
        })
        socket.on("end game", ({ gameId }) => {
            console.log("reached backend")
            console.log(games[gameId])
            if (games[gameId] !== undefined) {
                socket.broadcast.to(gameId).emit("game ended", {})
                console.log('games', games)
                delete games[gameId]
            }
        })
        socket.on("game progress", ({ participantId, gameId, testReport }) => {
            if (games[gameId] !== undefined) {
                let game = games[gameId]
                game.progress[participantId] = testReport
                io.to(gameId).emit("player progress", {})
            }

        })

        socket.on("update score", ({ gameId, increment, playerId }) => {
            console.log("going to update score")
            let game = games[gameId]
            if (game !== undefined) {
                game.scores[playerId] += increment;
                let tempLeaderboard = [];
                for (let x = 0; x < game.participants.length - 1; x++) {
                    for (let y = 0; y < game.participants.length - 1 - x; y++) {
                        let score1 = game.scores[game.participants[x]]
                        let score2 = game.scores[game.participants[x + 1]]
                        if (score1 < score2) {
                            let temp = game.participants[x]
                            game.participants[x] = game.participants[x + 1]
                            game.participants[x + 1] = temp

                            let temp2 = game.participantNames[x]
                            game.participantNames[x] = game.participantNames[x + 1]
                            game.participantNames[x + 1] = temp2
                        }
                    }
                }
                console.log(game.scores[playerId]);



                io.to(gameId).emit("refresh game info", {})
            }
        })
        socket.on("game winner", ({ gameId }) => {
            console.log('reached the server')
            socket.broadcast.to(gameId).emit("show game winner", {})
        })
    }
    function friendsSocketConfiguration(socket) {
        socket.on("new friend request", async ({ fromEmail, toEmail }) => {
            try {

                let from = await users.findOne({ emailId: fromEmail })
                let to = await users.findOne({ emailId: toEmail })

                if (from !== undefined && to !== undefined) {
                    console.log(from)
                    console.log(to)

                    if (from.friends.friends.includes(to._id.toString()) === false && from.friends.pending.includes(to._id.toString()) === false) {


                        from.friends.pending.push(to._id.toString())
                        to.friends.requests.push(from._id.toString())

                        try {
                            await from.save()
                            await to.save()
                            console.log("saved users successfully")
                            if (io.sockets.sockets.get(socketIds[to._id.toString()]) !== undefined && io.sockets.sockets.get(socketIds[from._id.toString()]) !== undefined) {
                                // io.sockets.sockets.get(socketIds[to._id.toString()]).emit("friend request", { fromId: from.emailId, toId: to._id.toString() })
                                io.sockets.sockets.get(socketIds[to._id.toString()]).emit("update user", {})
                                io.sockets.sockets.get(socketIds[from._id.toString()]).emit("update user", {})
                            }
                            socket.emit("update user", {})
                        } catch (usersSaveError) {
                            console.log(usersSaveError)
                        }
                    }
                }

            } catch (userError) {
                console.log("userError", userError)
            }
        })
        socket.on("accept friend request", async ({ fromId, toId }) => {
            try {

                let from = await users.findById(fromId)
                let to = await users.findById(toId)

                if (from !== undefined && to !== undefined) {
                    console.log(from)
                    console.log(to)

                    from.friends.friends.push(to._id.toString())
                    to.friends.friends.push(from._id.toString())

                    from.friends.pending = from.friends.pending.filter((fr) => {
                        return fr !== to._id.toString()
                    })
                    to.friends.requests = to.friends.requests.filter((fr) => {
                        return fr !== from._id.toString()
                    })

                    try {
                        await from.save()
                        await to.save()
                        console.log("saved users successfully")
                        if (io.sockets.sockets.get(socketIds[to._id.toString()]) !== undefined && io.sockets.sockets.get(socketIds[from._id.toString()]) !== undefined) {
                            // io.sockets.sockets.get(socketIds[to._id.toString()]).emit("friend request", { fromId: from.emailId, toId: to._id.toString() })
                            io.sockets.sockets.get(socketIds[to._id.toString()]).emit("update user", {})
                            io.sockets.sockets.get(socketIds[from._id.toString()]).emit("update user", {})
                        }
                        socket.emit("update user", {})
                    } catch (usersSaveError) {
                        console.log(usersSaveError)
                    }
                }

            } catch (userError) {
                console.log("userError", userError)
            }
        })

    }

    configureLiveGameSocket(socket)
    friendsSocketConfiguration(socket)

})


// Mongoose connect

mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err)
        console.log("connected to MongoDB");
    else
        console.log(err);
});


const path = require("path");
const users = require('./models/User');
const { emit } = require('process');
// const { default: axiosLink } = require('../frontend/src/axiosInstance');


// Routes configuration
app.use('/api/test', testRoute)
app.use('/api/question', questionRoute)
app.use('/api/testCase', testCaseRoute)
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/course', courseRoute)
// app.use('/api/module', moduleRoute)

// Step 1:  

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
    // Step 2:
    app.get("*", function (request, response) {
        response.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("hello da");
        // console.log('hi baby doll')
    });
}

// Express Configuration

// Rest API function


app.get("/api/compile/:hi", (req, res) => {
    const { language, code } = req.body;
    res.send(req.params.hi)
});
app.get("/api/game/:id", (req, res) => {
    const { id } = req.params
    let bool = false
    console.log(games)
    let game = games[id]
    if (game !== undefined) {

        if (game.id === id) {
            console.log('correct game')
            bool = true
            res.status(200).send({ game })
        }
    }

    if (bool === false) {
        res.status(400).send({ err: "game not found" })
    }
});

app.post("/api/run", async (req, res) => {
    const lang = req.body.language;
    const code = req.body.code;
    const input = req.body.input;
    const funcName = req.body.funcName;
    const inputArray = input.split('\n');
    console.log(funcName);

    const newJob = new jobs()
    try {
        const filepath = await generateFile(lang, code, inputArray, funcName)
        newJob.language = lang;
        newJob.filepath = filepath;

        newJob.startedAt = new Date()
        const out = await executePy(filepath, inputArray)
        newJob.completedAt = new Date();
        newJob.output = out
        newJob.compileStatus = "success"
        try {
            await newJob.save()
            console.log('saved yaay')
        } catch (saveErr) {
            console.log(saveErr)
        }
        res.status(200).json({ out, jId: newJob._id })

    } catch (error) {
        console.log(error)
        newJob.filepath = ''
        newJob.compileStatus = "error"
        newJob.output = error.stderr
        try {
            await newJob.save()
        } catch (saveErr) {
            console.log(saveErr)
        }

        res.send({ err: error.stderr }, 300)
    }
    // res.send('error')


})

app.get('/api/status', async (req, res) => {
    const jobId = req.query.id
    if (jobId === undefined) {
        res.status(400).send({ success: false, err: 'invalid request' })
    } else {
        try {
            let job = await jobs.findById(jobId)
            if (job === undefined) {
                res.status(404).send({ success: false, err: 'Job not found' })
            } else {
                res.status(200).send(job)
            }

        } catch (jobError) {
            res.status(500).send({ success: false, err: jobError })
        }
    }
})

app.post('/api/mail', async (req, res) => {
    const jobId = req.query.id
    const mail = req.body
    console.log('hi');
    transporter.sendMail(mail, function (error, info) {
        if (error) {
            console.log('hi');
            console.log(error);
            res.status(404).send({ error, success: false })
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({ success: true })
        }
    });
})



http.listen(PORT || 3001, () => {
    for (var x = 0; x < 3; x++) {
        console.log("----------------------------------------");
    } 
    console.log("successfully started on Port " + PORT);
});

