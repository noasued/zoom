const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let camOff = false;
let roomName;
let myPeerConnection;
let myDataChannel;

async function getCameras(){
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => (device.kind === "videoinput"));
        const currentCamera = myStream.getVideoTracks()[0];
        
        //카메라목록
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;

            if(currentCamera.label === camera.label){
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        });
    } 
    catch (e) {
        console.log(e);
    }
}
async function getMedia(deviceId){
    const initialConstraints = {
        audio: true,
        video: {facingMode: "user"},
    };
    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
    };
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId? cameraConstraints : initialConstraints
        );
            myFace.srcObject = myStream;
            if(!deviceId){
                await getCameras();
            };
    }
    catch(e){
        console.log(e);
    }
};

function handleMuteClick(){
    myStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
    if(!muted){
        muteBtn.innerHTML = "Unmute";
        muted = true;
    }
    else{
        muteBtn.innerHTML = "Mute";
        muted = false;
    }
};

function handleCameraClick(){
    myStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
    if(camOff){
        cameraBtn.innerHTML = "Turn off Camera"
        camOff = false;
    }
    else{
        cameraBtn.innerHTML = "Turn on Camera"
        camOff = true;
    }
};

async function handleCameraChange(){
    await getMedia(cameraSelect.value);
    //sender : 다른 브라우저로 보내진 비디오와 오디오 데이터를 컨트롤 하는 방법
    if(myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection
          .getSenders()
          .find( (sender) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);

    }
}


muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("click", handleCameraChange);//input을 사용할시 기기가 한개밖에 없으면 제대로 동작하지않음 (강의에서는 input 사용)

//Welcome From (Join a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomeSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    await initCall();
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

//Socket Code
//Peer A : offer생성, offer전송
socket.on("welcome", async () => {
    myDataChannel = myPeerConnection.createDataChannel("chat");
    myDataChannel.addEventListener("message", console.log);
    console.log("made data channel");
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer")
    socket.emit("offer", offer, roomName);
});

//Peer B
socket.on("offer", async (offer) => {
    myPeerConnection.addEventListener("datachannel", console.log);
    console.log("received the offer")
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
    console.log("sent the answer")

});

socket.on("answer", answer => {
    console.log("received the answer")
    myPeerConnection.setRemoteDescription(offer);

});

//IceCadidate 
//Internet Connectivity Establishment(인터넷 연결 생성)
//webRTC에 필요한 프로토콜
//브러우저가 서로 소통할 수있게 하는 방법(중재 프로세스)
socket.on("ice", (ice) =>{
    console.log("received candidate");
    myPeerConnection.addIceCandidate(ice);
});

//RTC Code
function makeConnection(){
    myPeerConnection = new RTCPeerConnection({
        iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
              ],
            },
          ], 
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myPeerConnection.addEventListener("track", handleTrack);
    myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data){
    console.log("sent condidate");
    socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data){
    const peerFace = document.getElementById("peerFace");
    peerStream.srcObject = data.stream; //다른브라우저의 stream

}

function handleTrack(data) {
    console.log("handle track")
    const peerFace = document.querySelector("#peerFace")
    peerFace.srcObject = data.streams[0]
}