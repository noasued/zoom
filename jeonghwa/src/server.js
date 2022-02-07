//Express로 views설정, 렌더링.
//나머지는 websocket에서 실시간으로 일어남.

import express from "express"; 

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home"));

const handelListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handelListen);