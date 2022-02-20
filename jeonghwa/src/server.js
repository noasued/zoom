
import http from "http";
import SocketIO from "socket.io";
import express from "express"; 
import { parse } from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/")); //주소를 변경해도 home으로!

const httpServer = http.createServer(app); //http 서버생성
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) =>{
    socket.on("join_room", (roomName) => {
        socket.join(roomName);       
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) =>{
        socket.to(roomName).emit("offer",offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
});

const handelListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handelListen); //http와 같은 서버 사용




