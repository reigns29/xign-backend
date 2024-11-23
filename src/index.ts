import express, { Express } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import router from "./router";

const app: Express = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const PORT = process.env.PORT || 8000

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})

mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());