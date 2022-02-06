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
wss.on("connection", (socket) =>{
//    console.log(socket); 
    socket.send("hello!!!");        // socket으로 data보내기
});

server.listen(3000, handleListen);
