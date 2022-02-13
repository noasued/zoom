/* 현재 여기서는 내가 보내는 메세지를 화면에 그리지 않고 있음
    만약 화면에 그리고 싶다면?
    socket이 메시지를 받을 때 실행되는 코드를 잘라내고, handleSubmit에 붙여줌

    나를 제외한 다른 모두에게 메시지를 전송해주는 function 만들기
*/
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

/* makeMessage function은 메세지를 만들고, stringfy를 해줌 > 그리고 나서 backend에서 메세지를 받으면 parse 해주기 > 메세지 타입 확인하기
    이것이 표준 방법은 아님
    만약 frontend에서 내가 new_messagee라고 잘못 작성하면, 실수를 찾아내기 정말 힘들다. ∴new_messagee는 new_message와 다르기 때문에
    그리고 내가 frontend에 object와 같은 메세지를 보내고 싶다면, socket.addEventListener("message",(message) =>) 내의 코드는 별로 좋지 않다. ∴이 함수 내에 보이는 message는 그냥 string이기 때문에
    그런데 내가 frontend에 많은 것을 보내고 싶어서 object로 보내고 싶다면, backend에서 JSON.stringfy를 이용해서 message를 만들어줘야 함
    그리고 frontend에서는 JSON.parse를 해주는 새로운 함수를 만들어줘야 한다. ∴그냥 text를 받고 있기 때문에

    나중에 여러 종류의 메세지를 받을 수도 있다.
    ex. 누군가 채팅방에 들어오면 다른 메세지로 보여줘야 한다.
        또 다른 종류의 메세지로는 "chat메세지"와 "채팅방을 나갔을 때 나오는 메세지"가 있다.

    지금은 frontend에 오직 한 개의 메시지만이 있고, 만약 지금 사용하고 있는 것을 계속 사용하게 된다면, 나중에는 addEventListener("message")라는 중이 다른 것으로 바뀔 것
    브라우저가 여러 종류의 메세지를 backend에 보내는 것처럼 backend도 frontend로 다양한 메세지를 보낼 수 있다. 
        => 다시 말하면, frontend에서 parse를 해줘야 한다는 것 (내가 parse를 했던 방식으로)
        => backend에서도 우리가 했던 방식으로 stringfy를 해줘야 한다는 말
*/
function makeMessage(type, payload){
    const msg = {type, payload}
    return JSON.stringify(msg);
}

function handleOpen(){
    console.log("Connected to Server ✅");
}

socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {    
    console.log("Disconnected from Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    // 화면에 뿌리고 싶은 경우 아래와 같이 작성
    const li = document.createElement("li");
    //li.innerText = message.data;
    // message.data 대신 아래와 같이 작성
    li.innerText = `You: ${input.value}`;
    input.value = ""; 
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value="";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
