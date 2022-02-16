const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

//Create Stream:: stream : video + audio
let myStream;
let muted = false;
let camOff = false;

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

getMedia();

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
};

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCamClick);
cameraSelect.addEventListener("click", handleCameraChange);//input을 사용할시 기기가 한개밖에 없으면 제대로 동작하지않음 (강의에서는 input 사용)
