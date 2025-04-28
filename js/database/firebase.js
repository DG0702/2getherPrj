// Firebase SDK 라이브러리 가져오기
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";





// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

// firebase firestore 모듈에서 getFirestore 함수 가져오기
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";




// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB2T2g8RAbqY7SQETTWdn9VQQcPyNP4b0I",
    authDomain: "gether-1b740.firebaseapp.com",
    projectId: "gether-1b740",
    storageBucket: "gether-1b740.firebasestorage.app",
    messagingSenderId: "1005372435914",
    appId: "1:1005372435914:web:fc4d1477cf52a5dc423333",
    measurementId: "G-1E1RMJH51M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firebase firestore 사용하기 위한 상수 -> 객체를 참조하기 위해 반드시 필요!!
const db = getFirestore(app);
export {db}