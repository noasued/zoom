
//socketIO와 front-end 연결
const socket = io();    //io()는 자동적으로 back-end와 socket.io 연결해주는 함수 -> port, ws 등 필요 없음

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

//화면에 메세지 띄움
function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

//채팅방 입장
function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");

    //SocketIO socket.emit
    // -socket.emit과 back-end의 socket.on에서 '같은 이름' 사용해야함
    // -원하는 만큼 back-end에 보낼 수 있음
    // -WebSocket은 string만 보낼 수 있었는데 이건 뭐든 다 됨!!
    // -function도 보내기 가능 단, 함수는 argument의 마지막에 작성해야 함
    // -function은 back에서 실행되는 것(x) front에서 실행(o) -> back에서 실행되면 보안상 문제됨
    // -socket.emit("event이름", 원하는 것, ...., function)
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);


//addEventListener를 사용하지 않고 socket.on을 우리가 원하는 데로 쓸 수 있음
//back에서 "welcome" event가 발생하면 실행한다는 뜻
socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
})

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} left TT`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    //ㄴㅐ 어플리케이션에 room이 하나도 없을 때 모든 것을 비워줌
    if(rooms.length === 0){
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});

/* WebSocket 사용
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

//백엔드 프론트엔드 연결
//프론트에서 백으로 메세지 보낼 수 있음
//서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}

//socket event 종류: open, message, close, error

socket open 
//소켓이 서버와 연결되면 실행
socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

socket message 
//백에서 프론트로 보낸 메세지를 받음
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

socket close
socket.addEventListener("close", () => {
    console.log("Disonnected from Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    //프론트의 form에서 백으로 메세지를 보내는 것
    socket.send(makeMessage("new_message", input.value));

    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);

    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);

//프론트에서 백으로 메세지 보내는 것
//timeout -> 바로 실행되지 않음

setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);



note

1. SocketIO
    - 실시간, 양방향, event 기반의 통신을 가능하게 함
    - websocket을 실행하는 것이 아니라
    - 가끔 websocket을 이용해서 실시간, 양방향, event 기반 통신을 제공하는 프레임워크/라이브러리
    - automatic reconnection 기능 제공 -> 탄력성 뛰어남 (websocket에서는 연결 끊기면 직접 기능 구현해줘야 함)

    즉, front와 back의 실시간 통신은 websocket만으로도 가능하지만 SocketIO는 이를 더 쉽게 만드는 편리한 코드 제공
*/
