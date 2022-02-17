/* 서로 소통할 수 있는 socket 그룹이 필요함 (-> 이 개념을 잘 설명할 수 있는 것이 chat room)
    room 은 어떤 곳에서든 사용할 수 있다.
    => socket IO는 기본적으로 room을 제공함

    serverAPI | clientAPI

    serverAPI
        - socket.id : socket의 id를 보여줌
        - socket.rooms : socket이 있는 rooms를 보여줌
         => console.log(socket.rooms) : socket이 현재 어떤 room에 있는지 console.log를 통해 알 수 있음
        - socket.join : 방에 참가하는 기능만들 때 사용
        - socket.onAny : onAny는 마치 middleware같은 것, 
         => socket.onAny((event, ...args) => {
                console.log(`got ${event}`); 
            }
         어느(any) event에서든지 console.log를 할 수 있다.

         user의 id와 방의 id가 같다
         ∴ socketIO에서 모든 socket은 기본적으로 user와 server사이에 private room이 있기 때문에

         socket으로 또 다른 무엇을 할 수 있나?
            1) 방에 참가(여러 방에 동시에 참가도 可)
            2) 방 퇴장
            3) 방 전체에 메세지를 보낼 수 O
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
        console.log(`Socket Event:${event}`);   // 여기서의 event는 enter_room
    });
    socket.on("enter_room", (roomName, done) => {
        // 현재 socket이 어느 room에 있는지 알 수 있다.
        //console.log(socket.rooms);

        //console.log(roomName);
        // 단순히 socket.join이라 작성 후, room 이름만 입력하면 O
        //socket.join("")
        // 그렇다면 roomName으로 방에 참가하기
        socket.join(roomName);      // 방에 참가하고 싶다면 socket.join
        //console.log(socket.rooms);
        
        done();
        
        // setTimeout(() => {
        //     done();
        // }, 10000);
    });
});

function onSocketClose(){
    console.log("Disconnected from the Browser ❌");
}

httpServer.listen(3000, handleListen);