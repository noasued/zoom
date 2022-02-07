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
/*
function handleConnection(socket){
    console.log(socket);
}
*/

wss.on("connection", (socket) => {
    // 1. browser가 연결되었을 때
    console.log("Connected to Browser ✅");

    //2. browser가 꺼졌을 때
    socket.on("close", () => console.log("Disonnected from the Browser ❌"));

    // 3. browser가 서버에 메세지를 보냈을 때
    socket.on("message", (message) => {
        console.log(message.toString('utf8'));
    });

    // 4. browser에 메세지를 보내도록 작성
    // connection이 생겼을 때 소켓으로 메세지 보냄
    socket.send("hello!!!!");
});


server.listen(3000, handleListen);