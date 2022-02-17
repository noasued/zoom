/* 들어간 방 안에 있는 모든 사람에게 메세지 보내기
    - socket.to(방이름).emit("an event", { some:"data" });
    ex. socket.to(others).emit("an event", { some : "data"}) 
        : others라는 방에 있는 모든 사람에게 메세지를 보내고
          우리가 원하는 데이터를 가지고 String인 "an event"를 emit할 것
          우리는 여러 개의 방에 같은 event를 emit할 수 있다.

    - Private Message(개인메세지)를 보낼 수 있다.
        socket.to(// another socket id).emit("hey");
*/

import http from "http";
import express from "express";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app); 
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        // 1. 방에 참가하면
        socket.join(roomName);
        // 2. done() function을 호출 => frontend에 있는 showRoom()을 실행
        done();

        // 3. 그 event를 방금 참가한 방 안에 있는 모든 사람에게 emit해주는 것
        // welcome event를 roomName에 있는 모든 사람들에게 emit한 것
        socket.to(roomName).emit("welcome");
    });
});

function onSocketClose(){
    console.log("Disconnected from the Browser ❌");
}

httpServer.listen(3000, handleListen);