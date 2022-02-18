const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

//Create Stream:: stream : video + audio
let myStream;
let muted = false;
let camOff = false;
let roomName;
let myPeerConnection;
let myDataChannel;

//-------MEDIA----------
//유저의 카메라 정보 가져오기
async function getCameras(){
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => (device.kind === "videoinput"));
        const currentCamera = myStream.getVideoTracks()[0];

        //카메라 목록 보여주기
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;

            //getting current camera of the stream and compare to selected camera
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

//유저의 stream 정보 가져오기
async function getMedia(deviceId){
    //처음 실행시 가져올 카메라 설정: user (셀카용 카메라 가져옴)
    const initialConstraints = {
        audio: true,
        video: {facingMode: "user"},
    };

    //특정 deviceId로 가져와서 카메라 설정
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



//음소거
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

//카메라 onoff
function handleCamClick(){
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

//카메라 선택 
async function handleCameraChange(){
    await getMedia(cameraSelect.value);
    if(myPeerConnection){
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection
            .getSenders()
            .find((sender) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);

    }
};

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCamClick);
cameraSelect.addEventListener("click", handleCameraChange);//input을 사용할시 기기가 한개밖에 없으면 제대로 동작하지않음 (강의에서는 input 사용)



//----------------WELCOME FORM : choose a room----------------------
//룸에 입장하면 비디오 보이게
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

//-------SOCKET CODE-------------
//1. peer A: 다른사람이 룸을 참가하는경우: offer 만들기
socket.on("welcome", async () => {
    //data channel
    myDataChannel = myPeerConnection.createDataChannel("chat");
    myDataChannel.addEventListener("message", (event) => console.log(event.data));
    console.log("made data channel");

    const offer = await myPeerConnection.createOffer(); //create offer
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer")
    socket.emit("offer", offer, roomName); //send offer to server

});

//2. Peer B 가 받는 부분:
socket.on("offer", async(offer) => { //receive offer
    myPeerConnection.addEventListener("datachannel", (event) => {
        myDataChannel = event.channel;
        myDataChannel.addEventListener("message", (event) => console.log(event.data));
    });
    console.log("received the offer")
    myPeerConnection.setRemoteDescription(offer); //set remote description
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);//send answer to server
    console.log("sent the answer")
});

//Peer A가 다시 받는 부분
socket.on("answer", (answer) => {
    console.log("received the answer")
    myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", ice => {
    console.log("received candidate");
    myPeerConnection.addIceCandidate(ice);
});


//--------RTC CODE------
//PTP Connection 
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
    myPeerConnection.addEventListener("icecandidate", handleIce); //ice candidate

    //addstream은 safari 기반 브라우저(최신 아이폰 등)에선 동작 안할 수 있음
    myPeerConnection.addEventListener("addstream", handleAddStream);
    //대신 아래 코드 사용
    //myPeerConnection.addEventListener("track", handleTrack)
    myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream));
};
//Peer A: one who starts connection : creates "offer"
function handleTrack(data) {
    console.log("handle track")
    const peerFace = document.querySelector("#peerFace")
    peerFace.srcObject = data.streams[0]
};
function handleIce(data){
    console.log("sent candidate");
    socket.emit("ice", data.candidate, roomName);
};

function handleAddStream(data){
    const peerFace = document.getElementById("peerFace");
    peerFace.srcObject = data.stream;
};
