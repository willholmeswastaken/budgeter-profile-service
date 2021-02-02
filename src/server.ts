import 'reflect-metadata';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';
import morgan from 'morgan';
import express from 'express';

import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

import './services';
import './data/repositories';

useContainer(Container);

const app = express();
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(morgan('combined'));

const port = process.env.PORT || '8000';

useExpressServer(app, {
    routePrefix: '/api',
    controllers: [ __dirname + "/api/*.ts" ]
})

app.listen(port);