// src/firebase.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

/* ===============================
   Firebase Config
=============================== */

const firebaseConfig = {
  apiKey: "AIzaSyAUJByhmFIvF6mjonwhr9fDEnwebPagFQ4",
  authDomain: "allclubs.firebaseapp.com",
  projectId: "allclubs",
  storageBucket: "allclubs.appspot.com",
  messagingSenderId: "1047960307680",
  appId: "1:1047960307680:web:12a1352000a4d1992d0d85",
  measurementId: "G-89YHC2S4DT"
};

/* ===============================
   Initialize App
=============================== */

const app = initializeApp(firebaseConfig);

/* ===============================
   Core Services
=============================== */

export const auth = getAuth(app);
export const db = getFirestore(app);

const functions = getFunctions(app, "asia-south1");

/* ===============================
   Anonymous DEV Login
=============================== */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    try {
      const cred = await signInAnonymously(auth);
      console.log("Anonymous login success:", cred.user.uid);
    } catch (err) {
      console.error("Anonymous login error:", err);
    }
  } else {
    console.log("User already logged in:", user.uid);
  }
});

/* ===============================
   Callable Cloud Functions
=============================== */

export const createSubscriptionFn = httpsCallable(
  functions,
  "createSubscription"
);

export const updateSubscriptionFn = httpsCallable(
  functions,
  "updateSubscription"
);

export const updateSubscriptionStartDateFn = httpsCallable(
  functions,
  "updateSubscriptionStartDate"
);

export const replaceSubscriptionFn = httpsCallable(
  functions,
  "replaceSubscription"
);

export const openDayFn = httpsCallable(
  functions,
  "openDay"
);

export const startSessionFn = httpsCallable(
  functions,
  "startSession"
);

export const endSessionFn = httpsCallable(
  functions,
  "endSession"
);

export const createClientFn = httpsCallable(
  functions,
  "createClient"
);