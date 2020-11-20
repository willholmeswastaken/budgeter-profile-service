import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';
import morgan from 'morgan';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';

import './api/controllers';
import container from './Container';

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(morgan('combined'));

const port = process.env.PORT || '8000';

let server = new InversifyExpressServer(container, null, { rootPath: "/api" }, app);

let appConfigured = server.build();
appConfigured.listen(port);