import http from 'http';
import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import socketIo from 'socket.io';
import routes from './routes';
import db from './models';
import GamingRoomController from './controllers/GamingRoomController';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

dotenv.config();

app.use(
  session({
    secret: process.env.SECRET_KEY || 'ninjas-game',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
  })
);

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/v1/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err.status
  });
  next();
});

const gamingRoom = new GamingRoomController();
io.on('connection', (socket) => {
  socket.on('createRoom', (member, room) => {
    const createdRoom = gamingRoom.createRoom(member, room);
    if (!createdRoom.isRoom) {
      socket.emit('createdRoom', createdRoom.newRoom);
    }
  });

  socket.on('newMember', (member, room) => {
    const joinedRoom = gamingRoom.joinRoom(member, room);
    socket.emit('newMember', member, joinedRoom.room);
    socket.broadcast.emit('newMember', member, joinedRoom.room);
  });

  socket.on('changeQuestion', (room) => {
    const updatedRoom = gamingRoom.changeQuestion(room);
    socket.emit('changeQuestion', updatedRoom);
    socket.broadcast.emit('changeQuestion', updatedRoom);
  });

  socket.on('answerQuestion', (point, member, room) => {
    const updatedRoom = gamingRoom.answerQuestion(point, member, room);
    socket.emit('answerQuestion', point, member, updatedRoom);
    socket.broadcast.emit('answerQuestion', point, member, updatedRoom);
  });

  socket.on('leaveGame', (member, room) => {
    socket.broadcast.emit('leftGame', gamingRoom.leaveRoom(member, room));
  });

  socket.on('replayGame', (member, room) => {
    socket.emit('gameReplayed', gamingRoom.replayGame(member, room));
    socket.broadcast.emit('gameReplayed', gamingRoom.replayGame(member, room));
  });
});

app.server = server;
export default app;
