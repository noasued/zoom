// frontend에서 두 가지를 보내고 싶다
/* function handleSubmit(event)의 메시지는 chat으로 보내는 message
    하지만 이 부분의 message는 내가 nickname을 변경하고 싶을 때 backend로 보내고 있다.
    서로 다른 form에서 전송되고 있다. (#nickname / #message)
    => 여기서 문제는 backend가 JS object를 전혀 이해하지 못한다
        ex. backend로 JS object를 보내면 좋지 않다 -> ∴연결하고 싶은 frontend와 backend 서버가 JS 서버가 아닐 수 도 있기 때문에(Java server  || GO server일 수도 있다.)
        이러한 이유로 JS object를 backend로 보내면 안된다.
        이 server는 JS로 만들었는데, 누군가는 GO server를 이용해 접속하려할 수 있기때문에 JS의 object를 GO로 보내면 안된다.
        => 이런 이유로 String을 보내야 한다.
        그리고 backend에 있는 모든 서버는 그 String을 가지고 뭘 할지 정한다.

        왜 object를 String으로 바꿔야 하나?
        -> webSocket이 browser에 있는 API이기 때문이다. backend에서는 다양한 프로그래밍 언어를 사용할 수 있기때문에 이 API는 어떠한 판단도 하면 안된다.
        => 이러한 이유로 String을 보내주는 것

        backend에서는 String을 받아서 우리에게 보여주지만, 다시 backend에서 이 String을 JS object로 바꿔줘야 한다.
        ==> server.js에서 message를 보여주기 console.log로 message 보여주기
*/
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg = {type, payload}
    return JSON.stringify(msg);
}

function handleOpen(){
    console.log("Connected to Server ✅");
}

socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {    
    console.log("Disconnected from Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = ""; 
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value="";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
