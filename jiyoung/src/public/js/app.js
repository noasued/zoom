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

/* socket open */
//소켓이 서버와 연결되면 실행
socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

/* socket message */
//백에서 프론트로 보낸 메세지를 받음
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

/* socket close */ 
socket.addEventListener("close", () => {
    console.log("Disonnected from Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    //프론트의 form에서 백으로 메세지를 보내는 것
    socket.send(makeMessage("new_message", input.value));
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
/*
setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);
*/