const socket = io();

const myFace = document.getElementById("myFace");
// stream : 비디오 오디오 연결된 것
const muteBtn = document.getElementById("mute");
const cameraBtn =document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            myFace.srcObject = myStream;
    } catch (e) {
        console.log(e);
    }
}

getMedia();

function handlemuteClick(){
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    }else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handlecameraClick(){
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    }else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

muteBtn.addEventListener("click", handlemuteClick);
cameraBtn.addEventListener("click", handlecameraClick);
// socket io 내용
// const socket = io();

// const welcome = document.getElementById("welcome");
// const form = welcome.querySelector("form");
// const room = document.getElementById("room");

// room.hidden = true;

// let roomName;

// function addMessage(message){
//     const ul = room.querySelector("ul");
//     const li = document.createElement("li");
//     li.innerText = message;
//     ul.appendChild(li);
// }

// function handleMessageSubmit(event){
//     event.preventDefault();
//     const input = room.querySelector("#msg input");
//     const value = input.value;
//     socket.emit("new_message", input.value, roomName, () => {
//         addMessage(`You: ${value}`);
//     });
//     input.value = "";
// }
// function handleNicknameSubmit(event){
//     event.preventDefault();
//     const input = room.querySelector("#name input");
//     socket.emit("nickname", input.value);
// }

// function showRoom(){
//     welcome.hidden = true;
//     room.hidden = false;
//     const h3 = room.querySelector("h3");
//     h3.innerText = `Room ${roomName}`;
//     const msgForm = room.querySelector("#msg");
//     const nameForm = room.querySelector("#name");
//     msgForm.addEventListener("submit", handleMessageSubmit)
//     nameForm.addEventListener("submit", handleNicknameSubmit)
// }

// function handleRoomSubmit(event){
//     event.preventDefault();
//     const input = form.querySelector("input");
//     socket.emit("enter_room", input.value, showRoom);
//     roomName = input.value;
//     input.value = "";
// }

// form.addEventListener("submit", handleRoomSubmit);


// socket.on("welcome", (user, newCount) =>{
//     const h3 = room.querySelector("h3");
//     h3.innerText = `Room ${roomName} (${newCount})`;
//     addMessage(`${user} arrived`);
// });

// socket.on("bye", (left, newCount) =>{
//     const h3 = room.querySelector("h3");
//     h3.innerText = `Room ${roomName} (${newCount})`;
//     addMessage(`${left} left`);
// });

// socket.on("new_message", addMessage);

// socket.on("room_change", (rooms) =>{
//     const roomList = welcome.querySelector("ul");
//     roomList.innerHTML = "";
//     if(rooms.length === 0){
//         return;
//     }
//     rooms.forEach(room => {
//         const li = document.createElement("li");
//         li.innerText = room;
//         roomList.append(li);
//     });
// });


// websocket frontend
// const messageList = document.querySelector("ul");
// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");
// const socket = new WebSocket(`ws://${window.location.host}`);

// // nickname, message의 형변환을 위한 함수 생성
// function makeMessage(type, payload){
//     const msg = {type, payload};
//     return JSON.stringify(msg);
// }

// socket.addEventListener("open", () =>{
//     console.log("Connected to Server 💜");
// });

// socket.addEventListener("message", (message) => {
//     const li = document.createElement("li");
//     li.innerText = message.data;
//     messageList.append(li);
// });

// socket.addEventListener("close", () =>{
//     console.log("Disconnected from Server ❌");
// });

// function handleSubmit(event){
//     event.preventDefault();
//     const input = messageForm.querySelector("input");
//     // backend로 전송할때 마다 String으로 전송해야줘야 하기때문에 형변환 함수 실행
//     socket.send(makeMessage("new_message", input.value));
//     // const li = document.createElement("li");
//     // li.innerText = `You: ${input.value}`;
//     // messageList.append(li);
//     input.value = "";
    
// }

// function handleNickSubmit(event){
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname", input.value));
//     input.value = "";
// }

// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);