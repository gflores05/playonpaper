import 'reflect-metadata';
import { createServer } from 'http';
import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import { Server, Socket } from 'socket.io';

require('dotenv').config({ debug: process.env.DEBUG });

const whitelist = [process.env.CLIENT_DOMAIN];

const app: express.Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_DOMAIN,
    methods: ['GET', 'POST']
  }
});

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'device-remember-token',
    'Access-Control-Allow-Origin',
    'Origin',
    'Accept'
  ]
};

app.use(cors(corsOptions));
app.use(json());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.json()
    )
  })
);
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.json()
    )
  })
);

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

io.on('connection', (socket: Socket) => {
  winston.info(`a user connected`);
  socket.on('disconnect', () => {
    winston.info('user disconnected');
  });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  winston.info(`Server running at http://localhost:${port}`);
});
