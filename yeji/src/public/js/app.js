const socket = io();
const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");

const room = document.getElementById("room");
// room 숨기기
room.hidden = true;

/* 누가 참여했는지 알려주기
    - roomName은 처음에 비어있다. 하지만 방에 참가하면 
*/
let roomName;

// 방 이름을 가지고 입장하면 backendDone이라는 function 실행시키기
function backendDone(msg){
    console.log(`The backend says `, msg );
}

// 문제 : 이 function을 서버에 보냈지만 서버에서 실행시킨 적이 없다.
// 실행시켜주기 => server.js => done(); 작성
function showRoom(){
    welcome.hidden = true;
    room.hidden = false;

    // home.pug에서 생성한 h3를 찾아 제목 변경시키기
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    // roomName을 채워주기
    roomName = input.value;
    input.value="";
}


form.addEventListener("submit", handleRoomSubmit);