// http import
import http from "http";
// ws import
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// 모든 node.js에 내장되어있는 http package를 사용해보자 (우선 http를 import해오기)
// create "http" server -> requestListener 경로가 있어야 함 (express application으로부터 서버를 만들어보기)
// webSocket을 하려면 꼭 필요한 부분
const server = http.createServer(app);  // express.js를 이용해 http server 만들기
// app.listen을 하기 전, 아직 server에 access하지 못했었는데, 이젠 접근 가능
// 이 server를 통해 webSocket을 만들 수 있다
// http 서버를 원하지 않는 경우, 필수적인 것은 아님 -> 이런 경우에는 webSocket 서버만 만들면 된다.

// 새로운 "webSocket" server 만들기 (위에 만든 server를 전달(pass)해주기 => 이렇게하면 http서버, webSocket서버 둘 다 돌릴 수 있게 됨)
const wss = new WebSocket.Server({ server });

/* http 서버와 webSocket 서버 둘 다 만든 이유 
    : 2개의 서버가 같은 port에 있길 원하기 때문에 현재는 이 두개를 동시에 함께 만듦
      서버를 만들고 (보이도록 노출시키고), http 서버 위에 ws 서버를 만들기 위함
      그러므로 localhost는 동일한 port에서 http, ws request 두 개를 모두 처리할 수 있다.
*/
/* 이제 해야할 일 : server.listen하기 (port는 아무거나) -> 이제 handleListener를 사용할 수 O
    app.listen처럼 크게 달라져보이는 것은 없지만, 변화의 요점은 "내 http 서버에 access하려는 것"이다.
    그래서 http 서버 위에 webSocket 서버를 만들 수 있도록 한 것
*/

/* day3_Recap 
    서버는 http, ws 2개의 protocol을 이해할 수 있게 되었다.
    http 서버가 있으면, 그 위에서 ws 서버를 만들 수 있고, 2개의 protocol 다 같은 port를 공유하는 것
    서버는 http protocol과 ws connection(연결)을 지원한다.

    http 서버가 필요한 이유 : views, static files, home, redirection을 원하기 때문

    이제 ws연결로 브라우저와 메세지를 주고 받기를 해보자
*/