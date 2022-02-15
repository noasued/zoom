import http from "http";
import express from "express";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app); 
const wsServer = SocketIO(httpServer);

// socket.on("room")을 하면서 msg를 받을 수 있게 됨 => 잘 작동하는지 console.log
// socket.on 뒤에 내가 원하는 event 작성
wsServer.on("connection", (socket) => {
    //console.log(socket);
    // 1) done 작성 후, 이제 오래 걸리는 일을 한다고 가정해보자.
    socket.on("enter_room", (msg, done) => {
        // 2) 우리가 받은 메세지를 console.log 해주기
        console.log(msg);
        // 3) 서버는 이 function을 호출할 것
        setTimeout(() => {
            // 4) 서버는 두 번째 argument인 done이라는 function을 호출
            // 그리고 서버가 이 function을 실행시키면 이 function은 frontend에서 실행됨 => 서버는 backend에서 function을 호출하지만 function은 frontend에서 실행된 것
            done();
        }, 10000);
    });
});

function onSocketClose(){
    console.log("Disconnected from the Browser ❌");
}

httpServer.listen(3000, handleListen);