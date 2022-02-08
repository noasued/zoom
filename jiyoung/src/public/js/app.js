const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

//백엔드 프론트엔드 연결
//프론트에서 백으로 메세지 보낼 수 있음
//서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

//socket event 종류: open, message, close, error

/* socket open */
//소켓이 서버와 연결되면 실행
socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

/* socket message */
//백에서 프론트로 보낸 메세지를 받음
socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
})

/* socket close */ 
socket.addEventListener("close", () => {
    console.log("Disonnected from Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    //프론트의 form에서 백으로 메세지를 보내는 것
    socket.send(input.value);
    //메세지 보낸 후 다시 공백으로 저장
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);

//프론트에서 백으로 메세지 보내는 것
//timeout -> 바로 실행되지 않음
setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);