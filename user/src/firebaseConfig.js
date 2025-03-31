// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6NFMaTstqpEAIz4xq-Tr0q7r6zIitJ8Y",
  authDomain: "toynest-75071.firebaseapp.com",
  projectId: "toynest-75071",
  storageBucket: "toynest-75071.firebasestorage.app",
  messagingSenderId: "1078628535089",
  appId: "1:1078628535089:web:16dd26e7e7c37fc39b3e10",
  measurementId: "G-GRHJ12L262"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };