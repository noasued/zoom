// 연결된 모든 socket을 자동으로 추적하고 있음.
//front-end 에서 back-end를 연결
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`); //nickname
    });
    value ="";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
   
    socket.emit("nickname", value )
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);

}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    
    //emit("event name", payload(서버로 보내는), fuction(서버에서 호출하는))
    // => 여러개의 argument를 보낼수 있음!
    //emit의 마지막 argument가 function이기만 하면 됨!!
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;


    //socket.send와 유사함. -> object를 string으로 변환해서 넣어야함
    //socket IO는 알아서 변환해줌 (object전송가능!!)
    input.value = ""; //초기화
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${user} arrived! `);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${left} left ㅠㅠ!`);
});

socket.on("new_message", addMessage);
//== socket.on("new_message", (msg) => {addMessage(msg)} );

socket.on("room_change", (rooms) =>{
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if( rooms.length === 0) {
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});
//== socket.on("room_change", (msg) => console.log(msg));

