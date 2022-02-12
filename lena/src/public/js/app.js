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

socket.on("welcome",(user) => {
    addMessage(`${user} arrived! 👋`)
}); //listening to socket.to() 

socket.on("bye", (left) => {
    addMessage(`${left} left 🥲`)
});

socket.on("new_message", addMessage);
// //getting elements 
// const messageList = document.querySelector("ul");
// const messageForm = document.querySelector("#message");
// const nickForm = document.querySelector("#nickname")

// //btn.addEventListener("click", fn) : similar to WS
// //WS also has similar function as eventlistener  

// //connecting BE and FE using socket
// const socket = new WebSocket(`ws://${window.location.host}`);

// //"ws://localhost:3000" works but localhost only works on your computer ONLY

// //receiving msg sent
// socket.addEventListener("open",() => {
//     console.log("Connected to Server✅"); //when the socket has opened a connection
// });

// socket.addEventListener("message", (message) => {
//     //console.log("New message: ", message.data);

//     //showing msg on the screen
//     const li = document.createElement("li");
//     li.innerText = message.data;
//     messageList.append(li);
    
// });

// socket.addEventListener("close", () => {
//     console.log("Disconnected from Server ❌");
// });

// // setTimeout(() => {
// //     socket.send("hello from the browser!");
// // }, 10000); //set showing time delay when sending msg to the BE

// function makeMessage(type,payload){ //JSON형식의 메세지를 stringify해줌
//     const msg = {type, payload};
//     return JSON.stringify(msg);
// }

// function handleSubmit(event){
//     event.preventDefault();
//     const input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message", input.value)); //sending msg from FE from to BE

//     const li = document.createElement("li");
//     li.innerText = `You: ${input.value}`;
//     messageList.append(li);

//     input.value = "";
// }

// function handleNickSubmit(event){
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname",input.value));
//     input.value = "";
   
// }
// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);