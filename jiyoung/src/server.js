import http from "http";
//import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";
import { type } from "os";
import { parse } from "path";
import { setTimeout } from "timers/promises";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

//http server
const httpServer = http.createServer(app);
//SocketIO server 생성
const wsServer = SocketIO(httpServer);

//back에서 connection 받을 준비 됨
wsServer.on("connection", socket => {
    socket.onAny((event) => {   //onAny: socket에 있는 모든 event를 살핌
        console.log(`Socket Event: ${event}`);
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");    //"welcome" event를 roomName에 있는 모든 사람에게 emit한 것 front에서 받아야 화면에 나옴
    });
});


httpServer.listen(3000, handleListen);

//ws server 생성
//const wss = new WebSocket.Server({ server });

/* WebSocket 이용한 방법
//누군가 서버에 연결하면 그 connection을 여기에 담는 것
const sockets = [];

//프론트로 메세지 보내고 받고 할 수 있음
//브라우저로의 연결

//function handleConnection(socket){
//    console.log(socket);
//}


wss.on("connection", (socket) => {
    //크롬이 연결되면 크롬을 배열에 넣고, firefox가 연결되면 firefox를 배열에 넣는다는 뜻..
    //연결된 브라우저의 수 만큼 배열에 저장된다는 뜻
    //이렇게 해야 받은 메세지를 모든 소켓에 전달 가능
    sockets.push(socket);

    //사용자가 닉네임 정하지 않은 경우 -> "Anon" 부여
    socket["nickname"] = "Anon";    

    // 1. browser가 연결되었을 때
    console.log("Connected to Browser ✅");

    //2. browser가 꺼졌을 때
    socket.on("close", () => console.log("Disonnected from the Browser ❌"));

    // 3. browser가 서버에 메세지를 보냈을 때
    socket.on("message", (msg) => {
        //JSON.parse(): string을 JavaScript object로 바꿔줌
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                // 각 브러우저를 aSocket으로 표시하고 메세지를 보낸다는 뜻
              sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
              //socket.send(message.toString('utf8'));   //프론트에서 받은 메세지를 다시 프론트로 보내줌
            case "nickname":
                //Anon -> 사용자가 지정한 닉네임
                socket["nickname"] = message.payload;
        }
    });

    // 4. browser에 메세지를 보내도록 작성
    // connection이 생겼을 때 소켓으로 메세지 보냄
    //socket.send("hello!!!!");
});
*/


/*
{
    type:"message";
    payload:"hello everyone";
}

{
    type:"nickname";
    payload:"nico";
}
*/