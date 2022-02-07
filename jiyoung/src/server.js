import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

//http server
const server = http.createServer(app);

//ws server
const wss = new WebSocket.Server({ server });

//프론트로 메세지 보내고 받고 할 수 있음
//브라우저로의 연결
function handleConnection(socket){
    console.log(socket);
}
wss.on("connection", handleConnection);

server.listen(3000, handleListen);