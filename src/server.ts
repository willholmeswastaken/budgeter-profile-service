import "reflect-metadata";
import helmet from "helmet";
import cors from "cors";
import compress from "compression";
import morgan from "morgan";
import express, { Request } from "express";

import { useExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";

import "./services";
import "./data/repositories";
import { Context } from "./models";
import BudgetController from "./controllers/BudgetController";
import AuthController from "./controllers/AuthController";

useContainer(Container);

const app = express();
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(morgan("combined"));
app.use((req: Request, res: any, next: any) => {
  Context.bind(req);
  next();
});

const port = process.env.PORT || "8000";

useExpressServer(app, {
  routePrefix: "/api",
  controllers: [ AuthController, BudgetController ],
});

app.listen(port);
