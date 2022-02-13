//backend단의 js

import http from "http";
import SocketIO from "socket.io";
import {instrument} from "@socket.io/admin-ui";
import express from "express";
// import WebSocket from "ws";

const app = express();
/* const 상수로 지정한 app에 node.js에 있는 npm(노드패키지매니지먼트)
에 인스톨 받은 백단의 서버형(?) 툴이라고 생각..express */

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);



/* 백엔드에서의 socket은 연결된 브라우저
function handleConnection(socket){
    console.log(socket)
} */

/* function onSocketClose(){
    () => console.log("Disconnected from the Browser ❌");
} */

const httpServer = http.createServer(app);
//http 프로토콜로 서버를 생성해서 server라는 상수에 넣는다
/* const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
});
instrument(wsServer, {
    auth: false,
}); */
const  wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) =>{
    socket.on("join_room", (roomName) =>{
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) =>{
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
});
/* function publicRooms(){
    const {
        sockets: {
            adapter: {sids, rooms},
        },
    } = wsServer;
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
} */
//adapter란? 서버들 사이에 실시간 어플리케이션 동기화를 해준다.
//서버 내 메모리에서 adapter를 사용하는 것이지, 데이터베이스에 저장하는것은 없다.
//해서 서버를 종료하고 다시 시작할때 모든 room과 msg, socket등이 사라진다.
//백엔드에서의 서버 메모리에 connection된 것들을 모두 저장해줌.
//무엇을 이용해서 구분하느냐? socket의 id값(sids)를 이용한다.
//socket에 저장된 기본적인 id값을 private room이라고 하고
//클라이언트가 만든 id(rooms)값을 public room이라고 한다.
//rooms과 sids는 map 형태로 이루어져있고 당연하게도 키와 밸류를 가지고있다.
//key값은 socket에 저장된 가장 기본적인 private room이고 랜덤 sids값을 가지고있다.
//예를들어, 현재 클라이언트가 3명이있고
//클라이언트들마다 소켓에 연결됨과 동시에 sids가 생성된다
//sids의 id값은 랜덤하게 생성되며 unique하다.
//이 클라이언트가 room을 생성하게 되면 public room이 생기는데,
//rooms에 클라이언트가 만든 id의 값과 동일한 키값이 추가된다.
//그러나 sids의 id값은 변경되는게 없다.
// sids === rooms 였으나 클라이언트가 방을 생성하게되면
// sids(2), rooms(3)가 되는것..
// sids(0)의 key값이 1, sids(1)의 key값 2, sids(2)의 key값 3일때
// 3번째 클라이언트가 방을 생성하게되면 sids값은 그대로지만
// rooms(0)의 key값 1, rooms(1)의 key값 2, rooms(2)의 key값 3, rooms(3)의 key값은
// 클라이언트가 생성한 id가 key값이 됨..
//즉 public과 private 룸의 차이는 sids.get(key)를 했을때 undefined
// 키값을 찾을수 없다고 나오면, 그것은 public room인것을 알수있고 찾을 수 있음.

/* function countRoom(roomName){
   return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) =>{
    socket["nickname"] = "anonymous"
    socket.onAny((event) =>{
        console.log(`Socket Event:${event}`);
    });

    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        wsServer.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => 
            wsServer.to(room).emit("bye", socket.nickname, countRoom(room)-1));
    });

    socket.on("disconnect", () =>{
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    })

    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
}); */

/* 
const wss = new WebSocket.Server({ server });
//웹소켓 프로토콜로 서버를 생성하는데, 여기에 위에 만든
//http 서버를 { server } 로 넣어주어 http, ws 두개를 범용 사용
const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    //브라우저와 연결될 때 마다, sockets array 안에 push해준다.
    socket["nickname"] = "Anon";
    console.log("Connected to Browser ✅")
    socket.on("close", onSocketClose);
    socket.on("message", (msg) =>{
        const message = JSON.parse(msg);

        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.paylod}`));
                break;
            case "nickname":
                socket["nickname"] = message.paylod;
                break;
        }
    });
}); */


httpServer.listen(3000, handleListen);
/* 위의 app.listen과 다른점은 http 프로토콜 서버 위의 ws 서버를
넣었다는 점과 http 서버에 access(?)할 수 있다. */
