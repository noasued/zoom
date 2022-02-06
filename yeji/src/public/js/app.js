// 여기 frontend를 보면 버튼을 만들고, addEventListener를 만들 수 있다.
// click 이벤트 생성 > callback 작성 || click 이벤트 생성 > 작동할 function 작성 (webSocket방식과 더 비슷 : webSocket도 event가 있고, event가 발동될 때 사용할 function 만들면 됨)
// btn.addEventListener("click",fn)

//frontend에 form이 있고, submit event를 listen한다고 하자.
// JS는 function을 호출하고, 정보를 준다. (event정보와 같이 function을 호출할 것 + 어떤 일이 발생했는 지에 관한 정보)
// webSocket은 listen할 특정한 event명이 있고, ws에서도 추가적인 정보를 받을 function이 존재함
// form.addEventListener("click",fn)

// const socket = new WebSocket("http://localhost:3000");
//Uncaught DOMException: Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. 'http' is not allowed 에러 발생
// 다른 protocol이다. http가 아니다. ws(webSocket)이거나 wss(webSocket Secure)이어야 한다

//const socket = new WebSocket("ws://localhost:3000");
// localhost:3000 이라고 작성하는 대신 내가 어디에 있는지에 대한 정보를 주자. 현재는 그냥 다른 protocol일 뿐이다. 
// 이것을 browser가 가져오게 만들기 -> JS에 옵션이 있다. : location.host => console창 > window.location.host

const socket = new WebSocket(`ws://${window.location.host}`);
// 이제 server로 접속할 수 있다

// frontend에도 socket을 가지고 있음 -> frontend에서 backend로 메세지를 보내고 backend로부터 메세지를 받을 수 있다.