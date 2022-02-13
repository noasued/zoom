/* Recap
    사용자와 개발자의 편의를 위한 개선사항
    이제까지 메세지를 보낼 때, 메세지를 보낸 후 값을 비워주고 그 메세지를 서버로 간다.( socket.on("message",(msg))  로 간다.)
    메세지를 처리하고, message type을 확인 (const message = JSON.parse(msg))
    switch문을 통해 그 메세지가 new_message면 자신과 다른 브라우저에 전송하고있다.

    자신을 제외한 모든 socket에 메시지를 보내는 function이 있다.
    오로지 websocket specification에 맞춰서 protocol을 실행시킬 뿐이고, 개발자에게 도움되는 것은 없다. ∴모두 개발자가 작성하고 있기 때문에
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