// socket IO 설치하기

import http from "http";
// import WebSocket from "ws";
import express from "express";
// socket IO import 해주기
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app); 
// const wss = new WebSocket.Server({ server });

// WebSocket 대신 Socket IO 서버 만들기
// 1. backend에 connection 받을 준비
const wsServer = SocketIO(httpServer);

// front와 back에 모두 socket IO 설치를 해야한다.
wsServer.on("connection", socket => {
    console.log(socket);
});

function onSocketClose(){
    console.log("Disconnected from the Browser ❌");
}

// websocket 코드와 socket IO 코드를 비교하기 위해 주석처리
/* 이제까지 websocket을 어떻게 만들었는지 상기해보자
    1) HTTP 서버 생성 (const server = http.createServer(app))
    2) 새로운 WebSocket을 만들 때 HTTP를 위에 쌓아올리며 만들었음 (const wss = new WebSocket.Server({ server });)
    => Socket IO 생성도 마찬가지이다. 
*/
/*
const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);

    socket["nickname"] = "Anon";

    console.log("Connected to Browser ✅");    
    socket.on("close", onSocketClose);
    socket.on("message", (msg) =>{
        const message = JSON.parse(msg);
        switch (message.type){
            case "new_message":
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname}: ${message.payload}`)
                );
            case "nickname":
                socket["nickname"] = message.payload;
        }
        sockets.forEach(aSocket => aSocket.send(message));
    });
});
*/
httpServer.listen(3000, handleListen);

/* socket IO를 설치해주는 것으로 Socket IO는 url을 제공한다. (/socket.io/socket.io.js)
    localhost:3000은 /socket.io/socket.io.js 라는 url을 제공한다. => 이것을 user에게 준다.
    이렇게 하는 이유는 SocketIO가 websocket의 부가기능이 아니기 때문에

    Socket IO는 "재연결"과 같은 부가기능이 있다.
    또는, websocket을 사용할 수 없을 때 다른 것을 사용할 것
    => 내가 socketIO를 서버에 설치한 것처럼 client에도 socketIO를 설치해야 함

    * socket IO는 websocket의 부가기능 X
      과거에는 backend에 아무것도 설치할 필요가 없었음           ∴ browser가 제공하는 webSocket API를 사용하면 됐었다.
      하지만 browser가 주는 websocket은 socket IO와 호환이 안됨 ∴ socket IO가 더 많은 기능을 제공하기 때문에
      ∵ socket IO를 browser에 설치해야 한다.
      그래서 url을 준 것이다. frontend에서는 이걸 쉽게 import할 수 있다.


*/