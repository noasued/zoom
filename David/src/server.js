//backend단의 js

import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();
//const 상수로 지정한 app에 node.js에 있는 npm(노드패키지매니지먼트)
//에 인스톨 받은 백단의 서버형(?) 툴이라고 생각..express

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

const server = http.createServer(app);
//http 프로토콜로 서버를 생성해서 server라는 상수에 넣는다

const wss = new WebSocket.Server({ server });
//웹소켓 프로토콜로 서버를 생성하는데, 여기에 위에 만든
//http 서버를 { server } 로 넣어주어 http, ws 두개를 범용 사용

//백엔드에서의 socket은 연결된 브라우저
// function handleConnection(socket){
//     console.log(socket)
// }

function onSocketClose(){
    () => console.log("Disconnected from the Browser ❌");
}

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    //브라우저와 연결될 때 마다, sockets array 안에 push해준다.
    console.log("Connected to Browser ✅")
    socket.on("close", onSocketClose);
    socket.on("message", (message) =>{
        sockets.forEach(aSocket => aSocket.send(message.toString()));
    });
});

server.listen(3000, handleListen);
//위의 app.listen과 다른점은 http 프로토콜 서버 위의 ws 서버를
//넣었다는 점과 http 서버에 access(?)할 수 있다.