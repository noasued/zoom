// frontend에서 socket을 만듦 + 3개의 event에 대해 listen 하기

// 새로고침 시, 4행의 코드가 실행
const socket = new WebSocket(`ws://${window.location.host}`);

// socket event 종류 : open, message, close, error

// socket이 open 되었다면, browser에 연결되었다고 log에 출력하기
socket.addEventListener("open", () => { // socket이 connection을 open했을 때 발생 (server와 연결되었을 때, 실행)
    console.log("Connected to Server ✅");
});

// message를 받을 때마다 내용을 출력하는 message
socket.addEventListener("message", (message) => {
    // backend에서 frontend로 보낸 메세지를 받는 방법
    // console.log("Just got this: ", message.data , " from the Server"); 
    console.log("New message: ", message.data);
});

// server가 offline이 될 때 발생
// close를 발생시키려면 서버를 disconnect해야한다. (서버를 꺼야한다.) => tab 나가기
socket.addEventListener("close", () => {    // 서버로부터 연결이 끊겼을 때 발생
    console.log("Disconnected from Server ❌");
});
// 브라우저의 연결이 끊기면, 서버에 (있는 socket의 )event를 발생시키고, 서버가 오프라인되면 브라우저한테 알려준다

// frontend에서 backend로 메세지 보내기
// 1. 메세지 보내기 (즉시 실행되지 않게 timeout 사용)
setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);