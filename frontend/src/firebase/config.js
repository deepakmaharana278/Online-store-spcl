import { initializeApp } from "firebase/app";
import { getFirestore  } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR3yLzpLo5z47HwPVW50y4PxlVHCPhCok",
  authDomain: "online-store-42ee9.firebaseapp.com",
  projectId: "online-store-42ee9",
  storageBucket: "online-store-42ee9.firebasestorage.app",
  messagingSenderId: "1029373985711",
  appId: "1:1029373985711:web:bca0b19781aa430724655a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
