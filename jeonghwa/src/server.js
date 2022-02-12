//Express로 views설정, 렌더링.
//나머지는 websocket에서 실시간으로 일어남.
import http from "http";
import WebSocket from "ws";
import express from "express"; 
import { parse } from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/")); //주소를 변경해도 home으로!

//http 서버 (views, static file, home, redirection 사용 시)
// ws 서버 2개 가동.
const handelListen = () => console.log(`Listening on http://localhost:3000`);
//app.listen(3000, handelListen);

const server = http.createServer(app); //http 서버생성
const wss = new WebSocket.Server({ server }); //wss생성

/*function handleConnection(socket) {
    console.log(socket); //frontend와 실시간으로 소통할 수 있음.
}
    wss.on("connection", handleConnection);
*/

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket); //브라우저를 연결할때 sockets에 넣어줌.
    socket["nickname"] = "Anon" //익명 user
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (msg) => {
        //const messageString = message.toString('utf8');
        const message = JSON.parse(msg); //배열로 형변환
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`)); //sockets안에잇는 브라우저에 메세지 보내기  
            case "nickname":
                socket["nickname"] = message.payload; //nickname저장
            break;
        }

        //socket.send(message); back-end에서 메세지 전송
        //console.log(message.toString('utf8')); Buffer -> utf-8
    });
}); //실행횟수 : 브라우저 당 1개

server.listen(3000, handelListen); //http와 같은 서버 사용




