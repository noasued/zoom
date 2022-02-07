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
//create new webSocket Server on the http Server -->
const wss = new WebSocket.Server({ server }); //서버 전달할 수 있음.

//브라우저에서 event : click, submit, Wi-Fi on/off
// server.js에서의 socket : 연결된 브라우저

/*
function handleConnection(socket) { // connection 이루어지면 function 작동
  //frontend와 backend 사이에서 real-time으로 소통 가능
  console.log(socket);
}
*/

//method on the socket
//socket에 data 보내기
function onSocketClose() {
  console.log("Disconnected from the Browser ❌");
}

//create fake database --> 브라우저가 달라도 서로 메세지 확인 가능하도록 설정하기 위함
const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket); //브라우저가 달라도 받은 메세지를 socket에 있는 모든 곳에 전달 가능
  socket["nickname"] = "Anonymous";
  console.log("Connected to Browser ✅"); // 1. connection이 생겼을 때 socket으로 메세지 보내기(hello)
  socket.on("close", onSocketClose); //browser가 꺼졌을 때를 위한 listener
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    //JSON.parse() : string을 javascript obj로 바꿔줌

    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`));//sending back to the user
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
  // socket.send("hello!!"); // browser에 메세지 보냄
});

// on method --> waiting event happen
//   --> backend에 연결된 사람의 정보 제공. (socket에서 옴)
//event in here is --> connection

server.listen(3000, handleListen);


//jSon 형태로 만들기
{
  type: "message";
  payload: "hello everyone!";
}

{
  type: "nickname";
  payload: "hey";
}





