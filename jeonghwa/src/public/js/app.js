const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`); //ws 프로토콜

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg); //string으로 형변환
}

//서버와 연결되었을 때
socket.addEventListener("open", () =>{
    console.log("Connected to Server ✅");
});

//서버에서 메세지를 받았을 때
socket.addEventListener("message", (message) => {
    //console.log("New message: ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

//서버로 부터 연결이 끊겼을 때
socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

//메세지 보낸 후 바로 실행되지 않게 timeout 사용
/*setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);*/

//메세지 전송
function handleSubmit(event){
    event.preventDefault(); //이벤트 바로 시작하지 않게 막기
    const input = messageForm.querySelector("input");
   // console.log(input.value);
    socket.send(makeMessage("new_message", input.value)); //back-end로 메세지 전송
    input.value = ""; //초기화
}

//nickname 지정
function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = ""; //초기화
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);