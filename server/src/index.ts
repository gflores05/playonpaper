import 'reflect-metadata';
import { Container } from 'typedi';
import express from 'express';
import { json } from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';

require('dotenv').config({ debug: process.env.DEBUG });

const app: express.Application = express();

Container.set<express.Application>('app', app);

app.use(json());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  })
);
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  })
);

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  winston.info(`Server running at http://localhost:${port}`);
});
