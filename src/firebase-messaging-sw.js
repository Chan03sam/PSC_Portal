importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyATZzZihKVOQna8Uv_4cqN1Gimu3KBgl7Q",
    authDomain: "myangu.firebaseapp.com",
    databaseURL: "https://myangu-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "myangu",
    storageBucket: "myangu.appspot.com",
    messagingSenderId: "15173791329",
    appId: "1:15173791329:web:0be0e7d9915d687bd20420",
    measurementId: "G-BYQ3J3RN1H"
});

const messaging = firebase.messaging();