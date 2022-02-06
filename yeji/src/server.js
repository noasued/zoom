import http from "http";
import WebSocket from "ws";
import express from "express";

// connection 만들기
// ws를 사용해 backend와 frontend 사이에 connection만들기
// websocket : browser와 server 사이의 연결
const app = express();

app.set("view engine", "pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); 
const wss = new WebSocket.Server({ server });

// 브라우저에서 event란 : click, submit, Wi-Fi on/off 등
// wss.on : event와 function을 받음, 이 function은 이게 발생할 때 호출되는 것

/* on method : event가 발동하는 것 기다림 (지금의 경우는 event가 "connection") + backend에 연결된 사람의 정보를 제공(socket에서 오는 정보)
              => server와 browser 사이의 연결
   function : connection(event)이 이뤄지면 작동
*/
// socket : 연결된 어떤 사람, 즉 연결된 브라우저와의 contract(연락) 라인 -> socket을 이용하면 메세지 주고 받기를 할 수 O
//          -> 이것을 저장해야한다. (최소한 console.log라도 하기)
function handleConnection(socket){  // 여기의 socket이 frontend와 real-time으로 소통할 수 있다.
    console.log(socket); // 여기서 access할 수 있다.
}

wss.on("connection", handleConnection);

server.listen(3000, handleListen);

/* day4_Recap
    server.js의 socket은 연결된 브라우저를 뜻함
    app.js의 socket은 서버로의 연결을 뜻함
*/