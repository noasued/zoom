import express from "express";

// express로 할 일 : views를 설정해주고, render 해주기 + 나머지는 Websocket에서 실시간으로 일어날 것
const app = express();

// 1. 나중에 pug 페이지들을 render하기 위해 pug 설정을 해줘야 함
app.set("view engine", "pug");
app.set("views",__dirname + "/views");

// 3. user가 /public으로 가게되면 __dirname +"/public" 폴더를 보여주게 할 것
app.use("/public", express.static(__dirname + "/public"));

// 2. 사용할 유일한 route 만들기
app.get("/",(req,res) => res.render("home"));

// catchall url 만들기
// app.get 입력 후, 여기서 user가 어떤 url로 이동하던지 홈으로 돌려보내면 됨 ∴다른 url을 사용하지 않을 것이기 때문에(홈만 사용할 것)
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);

// Recap
/*
    1. 개발 환경 설정 (express를 사용한 일반적인 NodeJS 설정 - package.json, script 생성, babel ..)
        - babel-node를 실행 > babel-node는 바로 babel.config.json을 찾음 > 거기서 코드에 적용돼야하는 preset을 실행시킬 것
        - Nodemon을 설정하기 위해 nodemon.json 생성
            * Nodemon : 나의 프로젝트를 살펴보고 변경사항이 있을 시, 서버를 재시작해주는 프로그램 
                        서버를 재시작하는 대신에 babel-node를 실행하게 되는데 babel은 내가 작성한 코드를 일반 NodeJS코드로 compile해주는 데 그 작업을 src/server.js에서 해준다 (* nodemon.json 파일 참고)
            * server.js : express를 import > express 애플리케이션을 구성 > view engne을 pug로 설정 > views 디렉토리 설정 > public 파일들에 대해서도 똑같은 작업을 해준다 (public 파일들은 FrontEnd에서 구동되는 코드, 아주 중요한 부분)
                          server.js는 BackEnd에서 구동 (app.js : FrontEnd에서 구동)
                    app.user("/public"~~) 코드 : public 폴더를 user에게 공개해주는 것 (user는 쉽게 서버 내 모든 폴더를 들여다 볼 수 X => user가 볼 수 있는 폴더를 따로 지정해줘야 함 [현재는 user는 /public으로 이동할 시, public 폴더 내용을 볼 수 O])
                    app.get("/",~~) 코드 : 홈페이지로 이동 시, 사용될 template을 render해주는 것
        - views 폴더에 있는 home.pug를 render하면 끝

        - 만약 catchall url을 만들고 싶다면, app.get("/*",~~ )코드 작성하기
*/