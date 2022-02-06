//setting node set up using Express

import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug"); //config view engine to Pug
app.set("views",__dirname + "/views"); //set the directory of views
app.use("/public", express.static(__dirname + "/public")); //creat public url so the users can access (make it static)
app.get("/", (req, res) => res.render("home")); //create route handler to render views (home.pug)
app.get("/*", (req, res) => res.redirect("/")); // for all url redirect to "/" which is home in this case : catchAll


/*previously handled http, -> let's change to ws and combine them to the same server
    1. install ws (npm i ws)
    2. import http & Websocket
    3. create http server
    4. create ws server and give http server as parameter (not a mandatory)
    5. set a server to listen
*/

/* 
app.listen :: doesn't handle ws and we weren't able to access server itself

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen); //run port 3000 and run handleListen() 
*/      

/*
creating http server: 
    -> use http package  preinstalled with the node.js
    -> need to import http
*/

const handleListen = () => console.log(`Listening on http://localhost:3000`);
const server = http.createServer(app); // creating server from express application

//now we are able to create websocket on top of this server

/*
creating websocket server:
    -> use Websocket :: need to import Websocket
*/
const wss = new WebSocket.Server({server});
server.listen(3000,handleListen); //localhost:3000 can handle both http AND ws

/*
Don't have to pass "server" :: this way, if http server runs, wss also runs
creating wss only is absolutely fine

    reason why we pass server: 
    -> to expose our server so then we can create ws on top of http server
    -> need http server for: views, static files, home, redirection
*/

