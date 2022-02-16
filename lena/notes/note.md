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

