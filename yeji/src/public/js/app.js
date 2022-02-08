const messageList = document.querySelector("ul");

// 4. html에서 작업한 후, id가 nick과 message인 것 추가 작성
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

// function만들기 (type과 payload 받기)
function makeMessage(type, payload){
    // msg 생성
    const msg = {type, payload}

    // 위에서 생성한 msg를 string으로 바꿔서 return 하기
    return JSON.stringify(msg);
}
/* 메세지를 전송하고 싶으면, makeMessage function을 불러주면 됨
    예를 들어 socket.addEventListener("message")코드에서 user가 message를 전송하면 backend로 보낸다.
    그 코드 안에 makeMessage를 쓰기
*/

function handleOpen(){
const messageForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => { 
    console.log("Connected to Server ✅");
}

socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
    // 1. 새로운 message를 받으면 먼저 새로운 li 만들기
    const li = document.createElement("li");

    // 2. message.data를 li 안에 넣어주기
    li.innerText = message.data;

    // 3. li를 messageList 안에 넣어주기
    messageList.append(li);
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {    
    console.log("Disconnected from Server ❌");
});

// 내가 받고싶은 type과 payload 형태로 전송하기
function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    //socket.send(input.value);       // string data만 보낼 수 있다.
    /* JSON 보내기 
        message type은 nickname, payload에는 input의 값을 넣기 (= user가 입력한 값)

        현재는 text를 전송하는 것이 아닌, JSON object 전체를 전송하는 것
    */
    socket.send(makeMessage("new_message", input.value));
    input.value = ""; 
}

/* html에서 nickname을 저장하면 message로 전송됨 (message를 backend에 보내게되면 backend는 모두에게 전송해주게 된다.)
    -> 이런 방식이 싫다면, message를 주고받는 더 좋은 방식을 만들어야 함
    현재는 2가지 type의 message가 있고, 전에는 한 가지 type이 있었다. == text
    message type이 2개이니까 다른 방식으로 보내줘야 한다. 그냥 text를 보내는 대신 JSON을 보낼 것 => server.js
*/
function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    //socket.send(input.value);
    socket.send(makeMessage("nickname", input.value));
    /* 이제 backend로 message를 전송할 때 마다, String을 전송해줄 것
        하지만, String을 보내기 전에 object를 만들고, (10행 const msg = {type, payload}) 
        그 object를 String으로 만들었다. (return JSON.stringfy(msg))
    */
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
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

