const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

const call = document.getElementById("call");

// 처음에 call은 숨겨져 있을 것
call.hidden = true;

// Stream 생성 : video와 audio
let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;
let myDataChannel;

// camera 정보
async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        // console.log(myStream.getVideoTracks()); => 어떤 카메라가 선택되었는지 알 수 있도록

        // videoTracks의 첫 번째 track 가져오기
        const currentCamera = myStream.getVideoTracks()[0];

        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;

            // currentCamera.label이 camera.label과 같다면 option이 select된 것(내 카메라)이라고 작성
            if(currentCamera.label === camera.label){
                option.selected = true;
            }
            // Stream의 현재 카메라와 paint할 때의 카메라 option을 가져오기

            cameraSelect.appendChild(option);
        })
    }catch(e){
        console.log(e);
    }
}

// user 정보(device의 Id를 받고 있음 => Id를 사용하는 것 : 비디오를 강제로 다시 시작하는 방법 ∵정말정말 중요)
async function getMedia(deviceId){
    // device Id가 없는 constraints
    const initialConstrains = {
        audio: true, 
        video: {facingMode: "user"},
    };

    // deviceId가 있는 경우 사용
    const cameraConstrains = {
        audio: true,
        video: {deviceId: {exact: deviceId}},
    };

    // video를 다시 시작하게 하는 방법
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains // getMedia를 할 때 마다 camera 가져오기
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }
    } catch(e){
        console.log(e);
    }
}

// 음소거 버튼 클릭
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

// user camera click (on/off)
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

// handleCameraChange -> getMedia function
async function handleCameraChange(){
    await getMedia(cameraSelect.value);
    if(myPeerConnection){
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection
            .getSenders()
            .find((sender) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);

    }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);


// Welcome Form (choose a room 방 선택)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

// startMedia : welcome을 가져다 welcome.hidden=true; 실행
async function startMedia(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();   // getMedia() : 카메라,마이크 등 불러옴
    makeConnection();
}

async function initCall(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia(); 
    makeConnection();
}

async function handleWelcomSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    // console.log(input.value);
    await initCall();
    // event 이름 : join_room / event의 value 또는 payload는 사용자가 적은 text
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value = "";

}
// welcome 내의 Form
welcomeForm.addEventListener("submit", handleWelcomSubmit);

// Socket Code
socket.on("welcome", async () => {
    myDataChannel = myPeerConnection.createDataChannel("chat");
    myDataChannel.addEventListener("message", console.log);
    console.log("made data channel");
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
});

socket.on("offer", async(offer) => {
    myPeerConnection.addEventListener("datachannel", (event) => {
        myDataChannel = event.channel;
        myDataChannel.addEventListener("message", console.log);
    });
    console.log("received the offer");
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
    console.log("sent the answer");
});

socket.on("answer", answer => {
    console.log("received the answer");
    myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", ice => {
    console.log("received candidate");
    myPeerConnection.addIceCandidate(ice);
});



// RTC Code
/* webRTC(web Real-Time Communication) : 실시간 커뮤니케이션을 가능하게 해주는 기술
    peer-to-peer : 나의 영상, 오디오, 텍스트가 서버로 가지 않는다(=직접 다른 사람에게 간다는 뜻)
*/
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
    // 
    myPeerConnection.addEventListener("addstream", handleAddStream);
    // 
    myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data){
    console.log("sent candidate");
    socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data){
    const peerFace = document.getElementById("peerFace");
    peerFace.srcObject = data.stream;
}