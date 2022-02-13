// 연결된 모든 socket을 자동으로 추적하고 있음.
//front-end 에서 back-end를 연결
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg){
    console.log(`The backend says : `, msg);
} 

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    
    //emit("event name", payload(서버로 보내는), fuction(서버에서 호출하는))
    // => 여러개의 argument를 보낼수 있음!
    //emit의 마지막 argument가 function이기만 하면 됨!!
    socket.emit("enter_room", {payload : input.value }, backendDone);
    //backendDone은 back server에서 명령을 받아 front에서 실행!

    //socket.send와 유사함. -> object를 string으로 변환해서 넣어야함
    //socket IO는 알아서 변환해줌 (object전송가능!!)
    input.value = ""; //초기화
}
form.addEventListener("submit", handleRoomSubmit);