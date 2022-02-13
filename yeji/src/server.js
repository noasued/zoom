/* 아주 쉽게 실시간 기능을 만들어주는 framework 사용하기 
    framework의 이름 : socket IO
    => socket IO : 나온지 매우 오래되었고, 안정적이다.
       socket IO 역할 : 실시간, 양방향, event 기반의 통신을 가능케 함 (websocket과 매우 비슷해보임)

       websocekt과의 공통점 : 양방향(browser와 backend의 양방향을 의미함)으로 통신, 둘 다 메세지를 주고 받을 수 O, event 기반의 통신을 함

       그렇다면 socket IO의 다른 점은 ?
        - socket IO는 webSocket보다 조금 더 무겁다. (ws는 많은 기능이 있지 않기때문에 용량이 매우 작음)
        - socket IO는 websocket을 실행하는 것이 X => socket IO는 framework인데 실시간/양방향/event기반 통신을 제공함
        - websocket보다 탄력성이 뛰어남(websocket은 Socket IO가 실시간/양방향/event 기반 통신을 제공하는 방법 중 하나, 많은 방법 중 하나일 뿐)
          ex. 만약 내 browser 또는 핸드폰이 websocket을 지원하지 않는다면(websocket에 문제가 생겨도), Socket IO는 계속 작동한다. 
          => socket IO는 "websocket의 부가기능이 아니다."

          "탄력성"
          => websocket이 이용이 불가능하다면 socket IO는 다른 방법을 이용해서 계속 작동할 것 (websocket을 지원하지 않는 경우, HTTP long polling과 같은 것을 사용할 것)
          => Socket IO가 websocket을 이용한 연결에 실패하더라도 다른 방법을 찾을 것이라는 말

    * socket IO는 가끔 websocket을 이용해서 실시간/양방향/event 기반 통신을 제공하는 framework이다.
               + front와 backend 간 실시간 통신을 가능하게 해주는 framework 또는 라이브러리이다. (front와 backend 간 실시간 통신을 websocket을 이용해서 할 수 O)
    -> front와 backend 간 실시간 통신을 하기 위해서 꼭 Socket IO를 사용할 필요는 X
       그러나 Socket IO는 실시간 기능 등을 더 쉽게 만드는 편리한 코드를 제공한다.

        - socket IO는 우리에게 신뢰성(reliability)을 주는 것
            즉, 
                1) 브라우저가 websocket 지원을 하지 않거나, 
                2) websocket 연결에 문제가 있거나, 
                3) 회사에서 websocket 사용이 안되는 경우나, 
                4) Firewall 혹은 proxy가 있는 등등의 경우에도 
            socket IO는 실시간 기능을 제공해준다.

*/

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

function onSocketClose(){
    console.log("Disconnected from the Browser ❌");
}

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

server.listen(3000, handleListen);