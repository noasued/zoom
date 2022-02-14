// 방금 설치한 코드 사용
const socket = io();        //=> socketIO를 frontend와 연결할 수 있음
/*
    socket IO를 설치해주면, 화면 console에서 io라는 function을 볼 수 있다. (console에서 io 입력)
    io : 자동적으로 backend socket.io와 연결해주는 function
         알아서 socket.io를 실행하고 있는 server를 찾음
    No need to port, No need to ws
*/