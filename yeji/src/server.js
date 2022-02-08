import http from "http";
import WebSocket from "ws";
import express from "express";
// import { copyFileSync } from "fs";

const app = express();

app.set("view engine", "pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); 
const wss = new WebSocket.Server({ server });

// function handleConnection(socket){ 
//     console.log(socket); 
// }

function onSocketClose(){
    console.log("Disconnected from the Browser ❌");
}

// function onSocketMessage(message){
//     console.log(message);
// }

//두 개의 socket이 생긴다. => 이렇게 되면 메시지를 다른 모든 socket에 전달해줄 수 있다.
const sockets = [];
/*
    brave가 connection되면 brave의 socket을 가져와서 array에 넣어준다.
    그리고 firefox가 connection되면 그 socket을 넣어줌
    brave에서 메시지를 받으면, 받은 메세지를 socket에 있는 모든 곳에 전달해줄 수 있다.
*/

wss.on("connection", (socket) => {
    //firefox가 연결될 때, firefox를 이 array에 넣어준다는 것 + brave가 연결될 때는 brave를 31행에 있는 array에 넣어줄 것
    sockets.push(socket);
    
    // socket.on()을 작성하고, message 이벤트를 등록하기
    socket.on("message", (message) => {
        console.log(message);
    });
    
    // 4. 브라우저에 메세지를 보내도록 작성
    socket.send("hello!!!!");       // connection이 생겼을 때, socket으로 즉시 메세지를 보낸 것
});

server.listen(3000, handleListen);