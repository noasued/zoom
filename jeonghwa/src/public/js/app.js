const socket = new WebSocket(`ws://${window.location.host}`); //ws 프로토콜

//서버와 연결되었을 때
socket.addEventListener("open", () =>{
    console.log("Connected to Server ✅");
});

//서버에서 메세지를 받았을 때
socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
});

//서버로 부터 연결이 끊겼을 때
socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

//메세지 보낸 후 바로 실행되지 않게 timeout 사용
setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);