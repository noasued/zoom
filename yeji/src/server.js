import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); 
const wss = new WebSocket.Server({ server });

function handleConnection(socket){ 
    console.log(socket); 
}

// connection 안에 위와 같은 역할을 하는 익명 함수 만들어주기 => 그러면 socket이 현재 어떤 상태인지 알기 쉽다 : connection이 생기면 socket을 받는다는 것을 알 수 있기 때문에
// (event를 다룰 때도 이렇게 하는게 좋다)
// socket에 있는 method 사용하기
wss.on("connection", (socket) => {
    // 1. browser가 연결되면, 무언가를 console.log하고
    console.log("Connected to Browser ✅");
    
    // 2. browser가 꺼졌을 때를 위한 listener 등록
    socket.on("close", () => console.log("Disconnected from the Browser ❌")); // backend에서는 'close'라는 event를 listen하고 있다
    
    // 3. 브라우저가 서버에 메세지를 보냈을 때를 위한 listener 등록
    // socket.on()을 작성하고, message 이벤트를 등록하기
    socket.on("message", (message) => {
        console.log(message);
    });
    
    // 4. 브라우저에 메세지를 보내도록 작성
    socket.send("hello!!!!");       // connection이 생겼을 때, socket으로 즉시 메세지를 보낸 것
});

server.listen(3000, handleListen);