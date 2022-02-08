const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
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

// message send하는 부분 우선 지우기
// setTimeout(() => {
//     socket.send("hello from the browser!");
// }, 10000);

// 1. function 생성 > message send하기
function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    //console.log(input.value);
    
    // 2. 전에 사용했던 socket.send() 사용 => frontend의 form에서 backend로 무언가를 보내기
    socket.send(input.value);

    // 3. input.value 비워주기 (message send 후에 input 박스 비우기)
    input.value = "";
}


messageForm.addEventListener("submit", handleSubmit);
