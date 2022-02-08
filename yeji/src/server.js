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


const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    
    console.log("Connected to Browser ✅");    
    socket.on("close", onSocketClose);

    // message type을 만들어주기
    // 하나는 message chat, 다른 하나는 nickname으로 해주기
    socket.on("message", (message) =>{
        sockets.forEach(aSocket => aSocket.send(message));

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
});

server.listen(3000, handleListen);

// JSON 보내기
/* 
    type이 다른 message 두 개 생성

    - type : message의 type
    - payload : 내가 사용하고 싶은 nickname 작성

    그래서 이 2가지 type의 message를 구별해줄 수 있어야 한다.
    하지만 app.js의 31행의 socket.send(input.value); 에서 string data만 보낼 수 있다 => 그래서 JSON으로 만들어주는 것이 좋다 => app.js의 handleNickSubmit 수정
*/
{ 
    type:"message",
    payload;"hello everyone!"
}
{
    type:"nickname",
    payload;"yeji"
}

/* backend에서 JSON을 열어서 message를 확인한 후 무엇을 할 지 결정하기 (String만 전송해야 함)
    * JS object를 가지고 String을 전송하는 가장 좋은 방법이 무엇일까? (단, JSON으로 사용할 수 있어야 함)
      + 그리고 그 String을 다시 JS object로 만드는 방법이 무엇일까?

      => console 창에서 JSON.stringfy
      ∴backend에서 String을 가져다 JSON.parse할 수 있다.

      ->이렇게 String으로 바뀐 object를 가져와서 string으로 바꿔줄 것
      Backend에서는 그 String을 다시 object로 바꿔준다.
      == 즉 backend에서 socket으로 message를 전송하고싶으면, object를 가져와서 String으로 만들어줘야 한다.
      Frontend에서도 동일하게 그 String을 가져와서 새로운 message가 왔을 때, 그 String을 object로 만들어야 한다. => app.js에서 function을 만드는 것부터 시작

*/