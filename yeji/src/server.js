/*
    다시 정리
    JSON.stringfy() : JS object를 String으로 바꿔줌
    JSON.parse() : string을 JS object로 바꿔줌

    type : message 종류
    payload : 메시지에 담겨있는 중요한 정보

    socket에 data를 저장할 수 있다.
    - nicknam, email 뭐든 상관없다.
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
    //socket.on("message", (message) =>{
    socket.on("message", (msg) =>{
        /* JS object로 만들어야 type을 확인할 수 O => 그래서 JSON.parse() 사용
           const parsed = JSON.parse(message);
        */
        const message = JSON.parse(msg);        // String을 parse해서 message가 되었다
        //console.log(parsed, message);
        
        // type이 new_message인지 확인하고 그 메세지를 모두에게 보내줄 것
        /* parsed.payload를 보내고 싶다면?
            message를 parsed.payload로 바꿔주기
        */ 
/*        if(parsed.type==="new_message"){
            //sockets.forEach((aSocket) => aSocket.send(message));
            sockets.forEach((aSocket) => aSocket.send(parsed.payload));
        }else if(parsed.type === "nickname"){
            console.log(parsed.payload);
        }
*/

        // if~else if 대신 switch문 사용해보기
/*         switch(parsed.type){
             case "new_message":
                 sockets.forEach((aSocket) => aSocket.send(parsed.payload));
             case "nickname":
                 console.log(parsed.payload);
         }
*/

        // parsed를 message object로 바꿔주기
        switch (message.type){
            case "new_message":
                //sockets.forEach((aSocket) => aSocket.send(message.payload));
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname":
                //console.log(message.payload);       
                /* 이 payload 즉 nickname을 socket안에 넣어줘야 한다. => ∴socket이 누구인지 알고싶기 때문에
                   socket에 새로운 item을 추가할 것이다. ∴ socket은 기본적으로 객체이기 때문에 무엇이든 원하는 것을 넣을 수 있다.
                   
                   아래의 코드는 받은 nickname을 socket에 넣어주는 것
                   ∵따라서 message가 socket에서 전송되고 message의 type이 new_message면 message를 72행처럼 payload만 보내는 대신 73행처럼 작성
                   nickname property를 socket object에 저장하고있다.

                   ex. firefox가 connection하면, firefox를 socket array에 저장 > 즉시 그 socket에 nickname을 줄 것 > console.log 
                        > close를 listen > socket이 message를 보낼 때까지 기다림 > socket이 new_message tyoe 메시지를 보내면 다른 모두에게 익명의 socket이 보낸 메시지를 전달
                        > 나중에 firefox가 nickname type의 message를 전송할 수도 있다 (message에 뭐가 있던지 그것을 firefox의 nickname으로 바꿔줄거야)
                */
                socket["nickname"] = message.payload;
                /* 익명 socket에 대해서도 생각해보자 (아직 nickname을 정하지 않은 사람들)
                    이런 경우를 위해 socket이 연결될 때, 36행처럼 작성
                */
        }
        sockets.forEach(aSocket => aSocket.send(message));
    });
});

server.listen(3000, handleListen);

// { 
//     type:"message",
//     payload;"hello everyone!"
// }
// {
//     type:"nickname",
//     payload;"yeji"
// }