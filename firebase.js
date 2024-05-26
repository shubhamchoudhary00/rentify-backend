const express=require('express');
const firebase=require('firebase/app');
const GoogleAuthProvider=require('firebase/auth');

const {getStorage,ref, uploadBytes}=require('firebase/storage')

const firebaseConfig = {
    apiKey: "AIzaSyC_2BqJs2dVxB1Sa7jABwPgihhMu8cQ2Pg",
    authDomain: "rentify-73df8.firebaseapp.com",
    projectId: "rentify-73df8",
    storageBucket: "rentify-73df8.appspot.com",
    messagingSenderId: "217432575896",
    appId: "1:217432575896:web:35e2185f9755b223f465ed"
  };


module.exports=firebase.initializeApp(firebaseConfig);

// const storage=getStorage();
// const upload=multer({storage:multer.memoryStorage()});

