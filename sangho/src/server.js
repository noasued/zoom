import http from "http";
import {Server} from "socket.io";
// import WebSocket from "ws"; // websocket 주석
import express from "express";
// import {instrument} from "@socket.io/admin-ui";
// import { handle } from "express/lib/application";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


// http 서버
const httpServer = http.createServer(app);
// io 서버
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName, done) =>{
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
});


const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

// //io 서버 backend
// // server / admin UI 설정
// , {
//     cors: {
//         origin: ["http://admin.socket.io"],
//         credentials: true,
//     },
// });
// instrument(wsServer, {
//     auth: false
// });

// function publicRooms() {
//     const {sockets: {adapter: {sids, rooms},
//       },
//     } = wsServer;
//     const publicRooms = [];
//     rooms.forEach((_, key) => {
//         if(sids.get(key) === undefined){
//             publicRooms.push(key);
//         }
//     });
//     return publicRooms;
// }

// function countRoom(roomName){
//     return wsServer.sockets.adapter.rooms.get(roomName)?.size;
// }


// wsServer.on("connection", socket =>{
//     socket["nickname"] = "Anon";
//     socket.onAny((event) => {
//         console.log(wsServer.sockets.adapter);
//         console.log(`Socket Event: ${event}`);
//     });
//     socket.on("enter_room", (roomName, done) => {        
//         socket.join(roomName);
//         done();
//         socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
//         wsServer.sockets.emit("room_change", publicRooms());
//     });
//     socket.on("disconnecting", () => {
//         socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
//     });
//     socket.on("disconnect", () => {
//         wsServer.sockets.emit("room_change", publicRooms());
//     });
//     socket.on("new_message", (msg, room, done) =>{
//         socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
//         done();
//     });
//     socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
// });


// ws 서버를 만든다 이렇게 만들어주면 http와 websocket을 둘다 돌릴 수 있다.
// const wss = new WebSocket.Server({server}); // socket io설치 후 주석
// 만약 http와 ws를 같이 쓰고 싶지 않을때는 하나의 서버만 운영한다.


// WebSocket을 이용한 방법은 주석 처리 io설정을 위한 것
// // fakeDataBase Array 생성
// const sockets = [];
// // socket은 어딘가에 저장해야 한다. 무조건 
// wss.on("connection", (socket) =>{
    //     // socket을 []에 담아주는 코드
    //     sockets.push(socket);
    //     socket["nickname"] = "Anon";
    //     console.log("Connected to Browser 💜");
    //     socket.on("close", () => {console.log("Disconnected from Browser ❌"); });
    //     socket.on("message", (msg) => {
        //         const message = JSON.parse(msg);
        //         switch(message.type){
            //             case "new_message":
            //                 // message = (message.toString('utf-8'));
            //                 sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
            //             case "nickname":
            //                 socket["nickname"] = message.payload;
            
            //         }
            //     });
            // });
            