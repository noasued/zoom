const socket = io(); //알아서 socket.io를 실행하고 있는 서버를 찾음

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName; //처음에는 방이름이 비어있다가 참가하면 생김

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  // console.log(`The backend says: `, msg);
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");

  // 1 : 이벤트명 / 2 : 보내려는 payload 혹은 원하는 그 무언가 ㅋ / 3 : 서버에서 호출하는 function
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value; //처음에는 방이름이 비어있다가 참가하면 생김
  input.value = ""
}

form.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", () => {
  addMessage("someone joined!");
});

socket.on("bye", () => {
  addMessage("someone left ㅠㅠ");
});

socket.on("new_message", addMessage);
// socket.on("new_message", (msg) => { addMessage(msg) });