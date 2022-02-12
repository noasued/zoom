import http from "http";
import WebSocket from "ws";
import express from "express";
import { handle } from "express/lib/application";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http 서버
const server = http.createServer(app);

// ws 서버를 만든다 이렇게 만들어주면 http와 websocket을 둘다 돌릴 수 있다.
const wss = new WebSocket.Server({server});
// 만약 http와 ws를 같이 쓰고 싶지 않을때는 하나의 서버만 운영한다.

// fakeDataBase Array 생성
const sockets = [];

// socket은 어딘가에 저장해야 한다. 무조건 
wss.on("connection", (socket) =>{
    // socket을 []에 담아주는 코드
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser 💜");
    socket.on("close", () => {console.log("Disconnected from Browser ❌"); });
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                // message = (message.toString('utf-8'));
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname":
                socket["nickname"] = message.payload;
            
        }
    });
});

server.listen(3000, handleListen);
