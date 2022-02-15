const socket = io();

/*
    여기서 말하는 room이란?
    : user가 웹사이트로 가면 방을 만들거나, 방에 참가할 수 있는 form을 볼 수 있다.
    => socket IO로 room 개념을 소개할 수 있다. ∴ socket IO에는 이미 room 기능이 있기 때문에

    Socket IO를 이용하면 방에 참가하고 나가는 것이 매우 간단 + 이것을 통해서 socket IO의 다른 기능도 배울 수 O
    1) frontend에 form 만들기 -> home.pug
    2) home.pug의 form을 app.js로 가져오기
*/

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");

function handleRoomSubmit(event){
    event.preventDefault();
    // form 안에서 input가져오기
    const input = form.querySelector("input");

    /* 메세지 보내기 (socket.send X), 원하는 것을 emit해주기 => emit을 하면 argument를 보낼 수 있다. argument는 object가 될 수 있다.
        websocket : 메세지만 전송, object 전송 X (object->String 변환 -> String을 전송)
        socket IO : 1) 특정한 event를 emit해줄 수 있다.(어떤 이름이든 상관X = 어떤 event든지 전송할 수 O =  꼭 메세지가 아니어도 되고, 원하는 어떤 event도 가능)
                    2) object를 전송할 수 O (websocket처럼 String만 전송할 필요가 없다.) (frontend에서 object를 전송할 수 O)
    */
    // socket.emit("enter_room",{ payload: input.value } ); // 현재는 room이라는 event를 emit해주면 된다.
                        // room 메세지 전송 > backend에서는 어떻게 보이나?
                        // socket.on()을 

    // socket.emit의 3번째 argument로 function을 넣어주기
    socket.emit("enter_room",{ payload: input.value }, () => {
        console.log("server is done!");
        /* socket.emit 사용 
            1) argument에는 event 이름이 들어감
            2) argument에는 보내고 싶은 payload가 들어감
            3) argument에는 서버에서 호출하는 function이 들어감

            ★☆ 중요함 ☆★
            => 서버로부터 function을 호출할 수 있는데, 그 function은 frontend에 있음
            -> 다시 socket.emit으로 돌아와서
                1) argument는 event 이름의 text
                    물론, emit과 on은 같은 이름, 같은 String이어야 한다.
                2) argument 보내주기
                    1. JSON object 보내기("enter_room")
                    2. function 보내기 (익명함수) 만약 이 function이 done이라고 한다면? => server.js로 넘어가서 확인하자


            32행 정말 중요함
            event 이름으로 emit > payload : input.value 메세지 보내기 > function 보내기 (서버에도 보낼 것)
        */
    });
    input.value="";
}

form.addEventListener("submit", handleRoomSubmit);