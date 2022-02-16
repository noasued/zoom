//setting node set up using Express

import http from "http";
//import WebSocket from "ws";
import express from "express";
import { Server } from "socket.io";
import {instrument} from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug"); //config view engine to Pug
app.set("views",__dirname + "/views"); //set the directory of views
app.use("/public", express.static(__dirname + "/public")); //creat public url so the users can access (make it static)
app.get("/", (req, res) => res.render("home")); //create route handler to render views (home.pug)
app.get("/*", (req, res) => res.redirect("/")); // for all url redirect to "/" which is home in this case : catchAll

const httpServer = http.createServer(app); // creating server from express application
const wsServer = new Server(httpServer);

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000,handleListen); //localhost:3000 can handle both http AND ws

