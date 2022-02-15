import http from "http";
//import WebSocket from "ws";
import {Server} from "socket.io";
import express from "express";
import {instrument} from "@socket.io/admin-ui";
import { type } from "os";
import { parse } from "path";
import { setTimeout } from "timers/promises";
import { count } from "console";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));


//http server
const httpServer = http.createServer(app);
//SocketIO server 생성
const wsServer = new Server(httpServer);

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);
