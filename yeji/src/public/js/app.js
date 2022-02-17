const socket = io();
const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");

const room = document.getElementById("room");
room.hidden = true;

let roomName;

// 메세지를 추가해주는 function 생성
function addMessage(message){
    const ul = room.querySelector("ul")
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function backendDone(msg){
    console.log(`The backend says `, msg );
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;

    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value="";
}
form.addEventListener("submit", handleRoomSubmit);

// 4. event에 반응하도록 frontend도 만들어주기
socket.on("welcome", () => {
    const ul = room.querySelector("ul")
    const li = document.createElement("li");
    li.innerText = "Someone joined!"
    ul.appendChild(li);
});