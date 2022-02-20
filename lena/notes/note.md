### babel
* JS Compiler : 최신 자스 문법은 (ES6, ES7 등) 브라우저가 이해 하지 못하기 때문에 babel이 브라우저가 이해할 수 있는 문법 (ES5)으로 변환해주는 Node.js 의 패키지
* ES6 문법 예) 
   * arrow function
   * let & const

```
npm install @babel/preset-env //기본 js코드 검사
npm i -D @babel/core @babel/node @babel/preset-env

// 바벨 핵심기능, Node.js 명령줄 모드, 기본 js코드 검사 규칙 설치하기
```
### npm
* Node Packaged Manager: 노드 모듈 (패키지)를 관리할 수 있게 해주는 툴
* 의존성 주입에 이용 (스프링에서 maven dependencies 추가해주는것과 비슷)
* Json 파일을 만들어 그 안에 기록을 통해서 관리함
```
npm init
```
위 명령어를  Terminal 창 등에 입력을 하면 프로젝트 관련 정보가 등록된 package.json파일이 생성된다.

```
{
  "name": "lena",
  "version": "1.0.0",
  "description": "Zoom Clone using node.js, WebRTC and WebSockets",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon"
  },
  "devDependencies": {
    "@babel/cli": "^7.16.8",
    "@babel/core": "^7.16.12",
    "@babel/node": "^7.16.8",
    "@babel/preset-env": "^7.16.11",
    "nodemon": "^2.0.15"
  },
  "dependencies": {
    "@socket.io/admin-ui": "^0.2.0",
    "express": "^4.17.2",
    "localtunnel": "^2.0.2",
    "pug": "^3.0.2",
    "socket.io": "^4.4.1",
    "ws": "^8.4.2"
  }
}
 ```
script는 우리가 run 명령어를 통해서 실행할 것들을 적어두는 것
dependencies의 경우는 설치할 모듈들을 의미


```
npm I <패키지명>
```

package.json 을 같이 배포하면 해당 프로그램 개발에 사용되었던 모듈을 그대로 인스톨할 수 있다. 
```
npm install
```


### request & response:

```javascript
app.get("/", (req, res) => res.render("home")); 
/*
1. create route handler to render views (home.pug)
2. when user sends GET request to homepage, server respond with a template.
*/

app.get("/*", (req, res) => res.redirect("/")); 
/* 
1. for all url redirect to "/" which is home in this case : catchAll
2. when user sends GET request to any page, server respond with a 'redirect'
*/

```


___
### http:
- protocol, where all the servers work
    * `http://~~`
* **DOES NOT HAPPEN REAL-TIME**
    server has to get request _first_ in order to respond
* **stateless**: BE does not remember users 
    * no connection between the user & BE
     * After respond, BE forgets about the user(browser) and just wait for the next request. : reason why we use **cookie** or **session**

### Websocket :
*  another type of protocol that **allows real-time communication**
    * `ws://~~~`
* browser sends request -> server either accepts or deny that request.
* once it accepts, ***connection*** is established: 
    * server & user(browser) can communicate directly without request/response at any point. (bi-directional)
* connection can be between two BE servers

### WS: 
* websocket implementation for Node.js (library)
* it has the most basic, core feature of websocket
* install by using "npm i ws"
---
# Socket IO
* It is a framework:
    * helps building real-time connection btw FE and BE
    * uses ***WebSocket*** if the browser supports WebSocket
    * if not, uses ***HTTP long-polling***
* **is NOT an implementation of web socket**
* if there is problem with WS, it will try to reconnect automatically : gives **reliability**
___
### room: 
* groups of sockets that can communicate each other
* like chat rooms
* socketIO supports rooms natively
* join, leave, disconnecting
    * disconnecting: client is going to be disconnected, but not **yet leave the rooms**
 ```javascript
 //socketIO 의 기본 메서드
 socket.join("name of the room") //entering room
 socket.leave("name of the room") // leaving room
 socket.to("name of the room")  //sending msg to the whole room EXCEPT YOURSELF
 ```

```javascript
 //화면에 메세지를 보여주도록 하는 function
function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}
```
```javascript

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${input.value}`);
        input.value = "";
    });
 ```
 차이점: **callback을 부르는 시점이 message를 받고 난 후 이므로 두번째처럼 하면 addMessage() 에 빈 값이 들어감**  

```javascript
function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${input.value}`);
    });
        input.value = "";
 ```
 ___
 ### Adapter
 * server-side component
 * window into app
 * tells who is connected how many rooms are currently in
 * synchronizing real-time app among different servers
 * in memory adapter: adapter within the server    
    * Can't communicate with clients connected to other servers

<img width="598" alt="adapter" src="https://user-images.githubusercontent.com/86010657/153757727-e06fc061-0e30-4872-a0cd-9d6ed7642d62.png">

---
#### recap:
* set: cannot have duplicate value
* map: CAN have duplicate but UNIQUE key

___
# Video
- stream: Video + Audio
- it gives ***track*** and we can access each track
___
### async & await:
- 자스의 비동기 처리 방법중 가장 최신 방법
- callback 함수 단점 보완
#### async function:
- function always returns promise
#### await
- waits until the promise is ***settled***
___
### Web RTC : Web Real-Time Communication
- API that helps real time communication
- **peer-to-peer**: communicating directly between users not through server
- *socketIO는 PTP ❌* 
    * 웹소켓 서버에 연결되어있고 서버가 메세지를 전달하는 역할을 함
    즉, 유저끼리 주고받은것 ❌
- signaling: 끝나면 PTP 커넥션이 생성됨
- PTP에서 서버: 브라우저의 위치 ip, port, server config 등을 제공해주는 용도로 사용됨

### Signaling Process
***Need server to exchange offers***
1. offer: ***Peer A*** opens up an connection and "invite"
2. setLocalDescription(offer)
3. send the offer to server 
```javascript
//Peer A
socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer(); //create offer
    myPeerConnection.setLocalDescription(offer); //setLocalDescription
    socket.emit("offer", offer, roomName); //send offer
});
```
3. Answer : ***Peer B*** answers the offer
4. setRemoteDescription(offer) : for remote Peers
5. createAnswer();
6. setLocalDescription(answer)
7. send answer to server
```javascript
//2. Peer B 가 받는 부분:
socket.on("offer", async(offer) => { //receive offer
    myPeerConnection.setRemoteDescription(offer); //set remote description
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);//send answer to server
});
```
8. Peer A receives and create Remote
```javascript
//Peer A가 다시 받는 부분
socket.on("answer", answer => {
    myPeerConnection.setRemoteDescription(offer);
})
```

(A) set Local Description & make an offer and send to (B)
***- create an offer: set Local Desc*** 
(B) Receives the description & set Remote Description & make an answer & send answer to (A)
***- receives offer: set Remote Desc, create Answer, set Local Desc, send Answer to B***
(A) Receives answer and have remote description
***- receives Answer: set Remote Desc***

 => both A & B will have LOCAL & REMOTE description

 * Ice Candidate: after offer & answer both peers will initiate ice candidate event
  
* Internet Connectivity Establishment
Describes protocol needed for webRTC to be able to communicate with remote device
* 각 피어에서 커넥션 방법이 몇가지 제시되고 모든 피어들이 동의하는 한가지의 커넥션 방법을 선택하면 webRTC가 시작됨

```javascript
    //addstream은 safari 기반 브라우저(최신 아이폰 등)에선 동작 안할 수 있음
    myPeerConnection.addEventListener("addstream", handleAddStream);

    function handleAddStream(data){
        const peerFace = document.getElementById("peerFace");
        peerFace.srcObject = data.stream;
};
    //대신 아래 코드 사용
    myPeerConnection.addEventListener("track", handleTrack)

    function handleTrack(data) {
        console.log("handle track")
        const peerFace = document.querySelector("#peerFace")
        peerFace.srcObject = data.streams[0]
};
```

___
##### localtunnel 
1. npm i -g localtunnel 설치
2. npm run dev 실행후 ctrl z 로 잠시 suspend시킴
3. lt --port 3000 & (& 는 백그라운드에서 실행한다는 의미)
4. fg %1 로 서버 재실행

### STUN Server
- if you request something then the internet tells who you are
it will tell public IP
___
### Data Channel
channel that peer-to-peer users can send/receive any kind of data
video와 audio 외에 img, file, text, chat 등등 데이터 타입도 가능

```javascript
// offer만들기전에 datachannel을 만들어줌 : Offer를 보내는 Peer A
let myDataChannel;

socket.on("welcome", async () => {
    myDataChannel = myPeerConnection.createDataChannel("chat");
    const offer = await myPeerConnection.createOffer(); //create offer

    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer")
    socket.emit("offer", offer, roomName); //send offer to server
});
```
* 다른 peer는 DataChannel을 만들필요없음
    * DataChannel이 존재 할때  addEventListener해주면 됌

```javascript
socket.on("offer", async(offer) => { //receive offer
    //DataChannel이 존재 할때  addEventListener
      myPeerConnection.addEventListener("datachannel", (event) => {
        myDataChannel = event.channel; //datachannel이 존재하면 저장
        myDataChannel.addEventListener("message", console.log);
    });

    console.log("received the offer")
    myPeerConnection.setRemoteDescription(offer); //set remote description
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);//send answer to server
    console.log("sent the answer")
});
```
