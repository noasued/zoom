const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);

/* frontend에서도 익명함수를 사용하지않고 분리된 function을 사용하고 싶다면 
    3행에 작성된 것을 지우고, 아래의 예시처럼 function을 작성

    ex. function handleOpen(){
        console.log("Connected to Server ✅");
    }
*/