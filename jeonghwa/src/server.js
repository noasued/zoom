//Express로 views설정, 렌더링.
//나머지는 websocket에서 실시간으로 일어남.
import http from "http";
import WebSocket from "ws";
import express from "express"; 

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

wss.on("connection", (socket) => {
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (message) => {
        console.log(message.toString('utf8')); //Buffer -> utf-8
    });
    socket.send("hello!!");
});

server.listen(3000, handelListen); //http와 같은 서버 사용



