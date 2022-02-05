import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));//homepage로 이동 시 사용될 템플린 render

//make catchall url 
//유저가 어떤 url로 이동하던지 home으로 돌려보냄.(redirect)
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);
//ws 기능 설치를 위해 위 한 줄 가리고 아래부터 진행

const server = http.createServer(app); //서버에 접근 가능. 여기서 webSocket 만들 수 있음

//create new webSocket Server on the http Server
const wss = new WebSocket.Server({ server }); //서버 전달할 수 있음.

server.listen(3000, handleListen);
