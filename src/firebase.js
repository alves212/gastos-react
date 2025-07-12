// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDecIEyVIlFcbyI9PjjbD-VhTn0LOaEUJ0',
  authDomain: 'financeiro-react-212390.firebaseapp.com',
  projectId: 'financeiro-react-212390',
  storageBucket: 'financeiro-react-212390.firebasestorage.app',
  messagingSenderId: '753759873054',
  appId: '1:753759873054:web:4a2957702f0cc1ee41660f',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
