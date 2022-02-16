const socket = io();

//phone call Form

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label == camera.label){
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        })
    }catch(e){
        console.log(e);
    }
}

async function getMedia(deviceId){
    const initialConstrains = {
        audio: true, 
        video: {facingMode: "user"},
    };
    const cameraConstrains = {
        audio: true,
        video: {deviceId: {exact: deviceId}},
    };
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }
    } catch(e){
        console.log(e);
    }
}


function handleMuteClick(){
    myStream.getAudioTracks().forEach((track) => (track.enabled =!track.enabled));
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    }else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick(){
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled =! track.enabled));
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    }else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange(){
    await getMedia(cameraSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);

// Welcome Form (join a room)

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function startMedia(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();     //카메라, 마이크 불러오고 stream 하는 함수
    makeConnection();
}

function handleWelcomSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("join_room", input.value, startMedia);
    roomName = input.value;
    input.value = "";

}

welcomeForm.addEventListener("submit", handleWelcomSubmit);


//Soket Code
    /* Peer A에서 실행(내 경우 크롬) */
socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
});

    /*Peer B에서 실행(내 경우 사파리) */
socket.on("offer", (offer) => {
    console.log(offer);
});

//RTC Code
function makeConnection(){

    //1. peerConnection을 각 브라우저에 만드는 것
    myPeerConnection = new RTCPeerConnection();
    myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));
}