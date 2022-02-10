//setting node set up using Express

import http from "http";
//import WebSocket from "ws";
import express from "express";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug"); //config view engine to Pug
app.set("views",__dirname + "/views"); //set the directory of views
app.use("/public", express.static(__dirname + "/public")); //creat public url so the users can access (make it static)
app.get("/", (req, res) => res.render("home")); //create route handler to render views (home.pug)
app.get("/*", (req, res) => res.redirect("/")); // for all url redirect to "/" which is home in this case : catchAll


/*previously handled http, -> let's change to ws and combine them to the same server
    1. install ws (npm i ws)
    2. import http & Websocket
    3. create http server
    4. create ws server and give http server as parameter (not a mandatory)
    5. set a server to listen
*/

/* 
app.listen :: doesn't handle ws and we weren't able to access server itself

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen); //run port 3000 and run handleListen() 
*/      

/*
creating http server: 
    -> use http package  preinstalled with the node.js
    -> need to import http
*/

const handleListen = () => console.log(`Listening on http://localhost:3000`);
const httpServer = http.createServer(app); // creating server from express application
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`); //could see what event happened with socket
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);//put name of the room
        done(); //calling the callack fun (showRoom)
    
    }); 
    //"room" event를 받고 room안에 있는 msg를 받는다
    //socket io를 사용하면 custom event를 넘겨받을수있다 (message가 아니어도됌)
    // callback function: 프엔에서 받아온 function을 실행시켜줌:  BE에서 실행하지않음!! 보안상 문제가 생길수있음
            // 서버단에서 프엔에 있는 function을 실행시키도록 함
            // argument를 같이 보낼 수 있음
});

//now we are able to create websocket on top of this server

/*
creating websocket server:
    -> use Websocket :: need to import Websocket
*/
//const wss = new WebSocket.Server({server});
httpServer.listen(3000,handleListen); //localhost:3000 can handle both http AND ws

/*
Don't have to pass "server" :: this way, if http server runs, wss also runs
creating wss only is absolutely fine

    reason why we pass server: 
    -> to expose our server so then we can create ws on top of http server
    -> need http server for: views, static files, home, redirection
*/


//1. WebSocket CODES::

//creating connection btw browsers and BE
// const sockets = []; //if browsers is connected, add "socket" info to here

// //EventListener가  event정보를 가지고 있듯이 socket에 대한 정보를 가지고 있음
// wss.on("connection", (socket) => {
//     //inside the socket method
//     console.log("Connected to Browser ✅");
//     sockets.push(socket); //adding browsers (socket) info
//     socket["nickname"] = "Guest";
//     socket.on("close", () => console.log("Disconnected from browser ❌"));
//     socket.on("message", (msg) => {//receiving msg from FE
//         const message = JSON.parse(msg.toString('utf8'));
//         switch(message.type){ //어떤 메세지인지 확인 후 다르게 처리
//             case("new_message"):
//                 sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case("nickname"):
//                 socket["nickname"] = message.payload;
//         }
//     }); 
  
// });//somebody connected to us (socket)


//on the server side, socket = browser that just connected
//on the view, socket = connection btw FE & BE

