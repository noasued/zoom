//frontend단의 js

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);
//프론트엔드에서의 socket은 서버로의 연결을 뜻한다.

socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) =>{
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected to Browser ❌");
});

// setTimeout(() => {
//     socket.send("hello from the browser!");
// }, 3000);

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);