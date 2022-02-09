import http from "http";
import WebSocket from "ws";
import express from "express";
import { type } from "os";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

//http server
const server = http.createServer(app);

//ws server
const wss = new WebSocket.Server({ server });

//누군가 서버에 연결하면 그 connection을 여기에 담는 것
const sockets = [];

//프론트로 메세지 보내고 받고 할 수 있음
//브라우저로의 연결
/*
function handleConnection(socket){
    console.log(socket);
}
*/

wss.on("connection", (socket) => {
    //크롬이 연결되면 크롬을 배열에 넣고, firefox가 연결되면 firefox를 배열에 넣는다는 뜻..
    //연결된 브라우저의 수 만큼 배열에 저장된다는 뜻
    //이렇게 해야 받은 메세지를 모든 소켓에 전달 가능
    sockets.push(socket);

    // 1. browser가 연결되었을 때
    console.log("Connected to Browser ✅");

    //2. browser가 꺼졌을 때
    socket.on("close", () => console.log("Disonnected from the Browser ❌"));

    // 3. browser가 서버에 메세지를 보냈을 때
    socket.on("message", (message) => {
        /* 각 브러우저를 aSocket으로 표시하고 메세지를 보낸다는 뜻 */
        sockets.forEach(aSocket => aSocket.send(message.toString('utf8')));
        //socket.send(message.toString('utf8'));   //프론트에서 받은 메세지를 다시 프론트로 보내줌
    });

    // 4. browser에 메세지를 보내도록 작성
    // connection이 생겼을 때 소켓으로 메세지 보냄
    //socket.send("hello!!!!");
});


server.listen(3000, handleListen);

{
    type:"message";
    payload:"hello everyone";
}

{
    type:"nickname";
    payload:"nico";
}