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
    
    console.log("Connected to Browser ✅");    
    socket.on("close", onSocketClose);

    // frontend input에서 보낸 message를 backend로 받았다. 그 message를 다시 frontend로 그대로 보내주기
    socket.on("message", (message) =>{
        /* aSocket : 위의 socket.on의 socket과는 다르다.
                     각 브라우저를 aSocket으로 표시하고 메시지를 보낸다는 의미
        */

        //console.log(message.toString('utf8'));
        sockets.forEach(aSocket => aSocket.send(message));
        //socket.send(message);       // user로부터 message를 받아서 다시 돌려주고 있음
    });
    /* chrome에서는 어떠한 메세지도 뜨지 않는다 (∴chrome에게 메시지를 보내지 않았기 때문에 올바르게 작동한 것)
       firefox가 backend에 메시지를 전달했고, 서버가 firefox에 답장을 해줌
       한 개의 서버가 서로 다른 두 브라우저로부터 메시지를 받고 있지만, 서로 다른 브라우저는 서로 메세지를 주고받지 못한다.
       wss.on 안에 있는 코드들은 firefox와 brave에서 모두 작동한다. => firefox가 서버에 메시지를 보내면, 서버는 firefox에게 답장을 해준다 => wss.on안의 코드들은 brave와 connectino될 때와 firefox와 connection될 때에도 작동(총 2번 작동한다.)
       => brave와 서버 사이에 websocket이 있고, firefox와 서버 사이에도 websocket이 있다.
       현재는 서버와 브라우저 둘이서만 주고받고 있음 -> 그래서 서버가 firefox로부터 메세지를 받아서 brave에 전달해줄 것 (이러기 위해서는 누가 연결되었는지 알아야 한다.)
       => fake database를 만들어주고, 누군가 내 서버에 연결하면 그 connection을 여기에 넣는다
    */
//    socket.send("hello!!!!");
});

server.listen(3000, handleListen);