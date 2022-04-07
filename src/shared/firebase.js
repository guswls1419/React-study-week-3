import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
   
};
// 파이어베이스에서 가져온 키값.

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
//파이어베이스 공식문서에 사용법 있음
//파이어베이스 시작하는 구문
const firestore = firebase.firestore();
const storage = firebase.storage();

export{auth, apiKey, firestore, storage}; //apiKey => 파이어베이스 인증키를 export