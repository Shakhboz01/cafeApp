import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1XcZL_HZ6Y6skDdj0qlVRP7vwn1QUDv8",
  authDomain: "cafe2-c7976.firebaseapp.com",
  projectId: "cafe2-c7976",
  storageBucket: "cafe2-c7976.appspot.com",
  messagingSenderId: "365370314303",
  appId: "1:365370314303:web:204bcf3b8eff17654d728a",
  databaseURL: "https://cafe2-c7976-default-rtdb.asia-southeast1.firebasedatabase.app",
  measurementId: "G-JC0T6YNE65"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);
export default firebase
