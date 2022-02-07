import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); 
const wss = new WebSocket.Server({ server });

function handleConnection(socket){ 
    console.log(socket); 
}

wss.on("connection", (socket) => {
    console.log("Connected to Browser ✅");
    
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));

    socket.on("message", (message) => {
        console.log(message);
    });
    
    socket.send("hello!!!!");
});

server.listen(3000, handleListen);


/*1.5 Recap
    event listen
    backend / frontend 두 곳에서 event를 listen한다.
    backend : websocket server를 만들고, connection이라는 event를 listen하고 있다. => connection event가 발생하면 반응해야 함
              frontend를 위해 필수적인 것은 아니다 (내가 아무것도 작성하지 않아도 front와 back은 서로 connection되고 있다) => 이럴 때 event를 listen해줘야 함
              22행에서 connection event를 listen해주는 것 + 그리고 connection이 생기면 socket에서 누가 연결했는지를 알 수 있다. (JS가 방금 연결된 socket을 넣어줄 것 : 현재는 browser가 연결됨)
              이제 browser마다 연결된 socket에서 event를 listen할 수 있다.
              socket에서 connection을 종료시키면(ex. browser의 탭을 닫거나, 컴퓨터가 잠자기 모드에 들어가는 것) 나는 무언가를 해줄 것(close event)
              또한 특정 socket에서 메세지를 기다리고 있다.(message) => 이것이 바로 22행의 socket이다.
              그래서 이 특정 socket에 event listener를 등록했고, 서버에 event listener를 등록하지 않았다. ∴이 event listener는 backend와 연결한 각 browser를 위한 것이기 때문에 (wss는 서버 전체를 위한 것)
              socket.on message : 특정 socket에서 메시지를 받았을 때 발생할 것 (새로운 browser가 내 서버에 들어오면, 같은 코드를 실행시켜줄 것)

              event listener 추가 > message를 browser로 전달 > borwser에서는 backend와 connection을 열어주고 있음 > 다시 event listener 등록 (vanillJS와 비슷 => addEventListener("click"))

              새로운 것 : frontend에서 backend로 뭔가 보낼 수 있고, backend에서 frontend로도 보낼 수 있음
                         frontend에서는 addEventListener("message") 사용
                         backend에서는 socket.on("message") 사용

              chat을 만들기 위한 필요한 것을 전부 setting 해놓음
              +
              그리고 25행과 같이 이름이 없는 function인 "익명함수(anonymous function)"를 준비함 
              (만약 이렇게 익명함수를 사용하기 싫다면, () => console.log("Disconnected from the Browser ❌")); 부분을 지우고 onSocketClose function을 위에 작성하면 됨)
              ex. function onSocketClose(){
                  () => console.log("Disconnected from the Browser ❌");
              }

                // 메세지 받기 (매개변수에 message 넣기)
                  function onSocketMessage(message){
                      console.log(message);
                  }

        위의 예시와 같이 코드를 작성하면 socket코드는 더 짧아지는 대신 분리된 function이 생긴다. (내가 편한대로 사용하면 됨 frontend도 마찬가지)

        많은 event가 발생하고, 그 이벤트들이 frontend와 backend에 둘 다 생긴다는 것
        대신, 비슷한 코드를 작성하기 때문에 frontend와 backend가 헷갈릴 수 있기 때문에 파일명을 보고 확인하자
        두 곳 모두 event와 function을 사용하고, 똑같이 생겼기 때문에 구분하는 것이 중요 => 그래서 어디서 발생하는 것인지 잘 알아야 한다.

*/