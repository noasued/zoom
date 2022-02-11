
//socketIO와 front-end 연결
const socket = io();    //io()는 자동적으로 back-end와 socket.io 연결해주는 함수 -> port, ws 등 필요 없음

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", {payload: input.value }, () => {
        console.log("server is done!");
    });
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

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
