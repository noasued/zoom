//setting node set up using Express

import express from "express";

const app = express();

app.set("view engine", "pug"); //config view engine to Pug
app.set("views",__dirname + "/views"); //set the directory of views
app.use("/public", express.static(__dirname + "/public")); //creat public url so the users can access (make it static)
app.get("/", (req, res) => res.render("home")); //create route handler to render views (home.pug)
app.get("/*", (req, res) => res.redirect("/")) // for all url redirect to "/" which is home in this case : catchAll
const handleListen = () => console.log(`Listening on http://localhost:3000`);

app.listen(3000, handleListen); //run port 3000 and run handleListen()
