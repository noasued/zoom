/* ~0206.5
// alert("Hi");
function fn(event) { }
form.addEventListener("click", fn); //event와 함께 function 실행
//webSocket은 listen할 특정 event명 있음
//추가적인 정보를 받을 function 존재
*/


const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");
//socket과 연결하자!
// WebSocket --> browser와 server 사이의 연결
// app.js에서의 socket : 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`); // host url을 자동으로 가져오게 함.
//backend에 연결

function makeMessage(type, payload) {
  const msg = { type, payload }
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅"); // 2. open되면 출력될 메세지
});

socket.addEventListener("message", (message) => {
  //console.log("New message : ", message.data); // 3. 메세지를 받을 때마다 내용 출력

  //message 받을 때마다 li 생성
  const li = document.createElement("li");

  //message.data를 li 안에 넣자
  li.innerText = message.data;

  //li를 messageList안에 넣기
  messageList.append(li);

});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌"); // 4. close되면 출력될 메세지
});

/*
setTimeout(() => {
  socket.send("hello from the browser!"); //browser에서 보낸 hello를 backend에서 받을 수 있나 확인 ㄱㄱ
}, 10000);
*/




//add eventListeners to the messageForm
function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value)); //backend로 msg value 보내기
  // console.log(input.value);
  input.value = "";
}

//add eventListeners to the nickForm
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value)); //backend로 nickname value 보내기
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);