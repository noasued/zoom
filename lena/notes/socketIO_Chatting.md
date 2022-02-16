#Socket IO - Chatting

##### home.pug
```javascript
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Noom
        link(rel="stylesheet", href="https://unpkg.com/mvp.css")

    body 
        header 
            h1 Noom
        main 
 
        div#welcome 
            form
                input(placeholder = "room name", required, type = "text")
                button Enter Room  
            
            h4 Open Rooms:
            ul
        div#room
            h3
            ul
            form#name
                input(placeholder = "choose a nickname", required, type = "text")
                button Save  
            form#msg
                input(placeholder = "message", required, type = "text")
                button Send      
        
        script(src = "/socket.io/socket.io.js")
        script(src = "/public/js/app.js") 
```
___
##### app.js
```javascript
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const msg = room.querySelector("#msg");
const nickname = room.querySelector("#name");

welcome.hidden = true;
msg.hidden = true;

let roomName = "";

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${input.value}`);
        input.value = "";
    });
}
function showWelcome(){
    welcome.hidden = true;
    msg.hidden = false;
    room.hidden = false;
    nickname.hidden = true;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room: ${roomName}`;
    msg.addEventListener("submit", handleMessageSubmit);
}

function showRoom(){

    welcome.hidden = false;
    room.hidden = true;
    welcome.addEventListener("submit",handleRoomSubmit);

   // const nameForm = room.querySelector("#name");
   // msgForm.addEventListener("submit", handleMessageSubmit);
    //nameForm.addEventListener("submit", handleNickNameSubmit);
}

function handleNickNameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value, showRoom);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showWelcome);
    //send 대신 emit을 사용: emit되는 event의 이름은 상관없음:: emit an event called "room"
    //we can send an argument when emit :: String만 가능한 websocket과는 다르게 object 자체도 보낼 수 있음
    // 첫번째 argument: 보내고싶은 event :: 서버에서 on을 통해 받아주는 이름
    // 두번째 argument: 보내고싶은 payload :: 여러개 보낼 수 있음
    // 마지막 argument: callback function :: 서버에서 호출하는 function :: but the function is in FE
    roomName = input.value; //room에 이름주기 
    input.value = "";
}

nickname.addEventListener("submit", handleNickNameSubmit);

socket.on("welcome",(user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room: ${roomName} (${newCount})`;
    addMessage(`${user} arrived! 👋`);
}); //listening to socket.to() 

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room: ${roomName} (${newCount})`;
    addMessage(`${left} left 🥲`)
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});
// == socket.on("room_change", (msg) => console.log(msg));

```
___
##### server.js
```javascript
//setting node set up using Express

import http from "http";
//import WebSocket from "ws";
import express from "express";
import { Server } from "socket.io";
import {instrument} from "@socket.io/admin-ui";

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
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
});

instrument(wsServer, {
    auth: false
});

function publicRooms(){
    const {
        sockets: {
            adapter: {sids, rooms},
        },
    } = wsServer;
/*
getting sids, rooms from wsServer.sockets.adapter

const sids = wsServer.sockets.adapter.sids;
const rooms = wsServer.sockets.adapter.rooms;
*/

//room lists
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key)
        }
    });
    return publicRooms;

}
//user count
function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Guest"
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event: ${event}`); //could see what event happened with socket
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);//put name of the room
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); //emitting an event "welcome" to the entire room
        wsServer.sockets.emit("room_change",publicRooms());//sending msg to all sockets
        //socket.emit : 메세지를 하나의 socket에만 보냄
        //io.socket.emit : 연결된 모든 socket에 보냄
    }); 
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => 
            socket.to(room).emit("bye", socket.nickname, countRoom(room) -1)
        );
    });
    
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg, roomName, done) => {
        socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });

    socket.on("nickname", (nickname, done) => {
        socket["nickname"] = nickname;
        done();
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

```