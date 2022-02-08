//getting elements 
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

//btn.addEventListener("click", fn) : similar to WS
//WS also has similar function as eventlistner  

//connecting BE and FE using socket
const socket = new WebSocket(`ws://${window.location.host}`);

//"ws://localhost:3000" works but localhost only works on your computer ONLY

//receiving msg sent
socket.addEventListener("open",() => {
    console.log("Connected to Server✅"); //when the socket has opened a connection
});

socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

// setTimeout(() => {
//     socket.send("hello from the browser!");
// }, 10000); //set showing time delay when sending msg to the BE


function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value); //sending msg from FE from to BE
    input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);