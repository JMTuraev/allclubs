/* ===============================
src/firebase.js
=============================== */

import { initializeApp } from "firebase/app";

import {
getAuth,
signInAnonymously,
onAuthStateChanged
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import {
getFunctions,
httpsCallable
} from "firebase/functions";

import { getStorage } from "firebase/storage";

/* ===============================
Firebase Config
=============================== */

const firebaseConfig = {
apiKey: "AIzaSyAUJByhmFIvF6mjonwhr9fDEnwebPagFQ4",
authDomain: "allclubs.firebaseapp.com",
projectId: "allclubs",
storageBucket: "allclubs.firebasestorage.app",
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
export const storage = getStorage(app);

/* ===============================
Cloud Functions
=============================== */

const functions = getFunctions(app, "asia-south1");

/* ===============================
Callable Helper
(returns res.data automatically)
=============================== */

const call = (name) => {
const fn = httpsCallable(functions, name);

return async (data) => {
const res = await fn(data);
return res.data;
};
};

/* ===============================
Anonymous DEV Login Only
=============================== */

if (import.meta.env.DEV) {
onAuthStateChanged(auth, async (user) => {
if (!user) {
try {
const cred = await signInAnonymously(auth);
console.log("Anonymous DEV login:", cred.user.uid);
} catch (err) {
console.error("Anonymous login error:", err);
}
}
});
}

/* ===============================
Callable Cloud Functions
=============================== */

export const createSubscriptionFn =
call("createSubscription");

export const updateSubscriptionFn =
call("updateSubscription");

export const updateSubscriptionStartDateFn =
call("updateSubscriptionStartDate");

export const replaceSubscriptionFn =
call("replaceSubscription");

export const openDayFn =
call("openDay");

export const startSessionFn =
call("startSession");

export const endSessionFn =
call("endSession");

export const createClientFn =
call("createClient");

export const getOrCreateOpenBarCheckFn =
call("getOrCreateOpenBarCheck");

export const addItemToBarCheckFn =
call("addItemToBarCheck");

export const decreaseItemFromBarCheckFn =
call("decreaseItemFromBarCheck");

export const createBarCategoryFn =
call("createBarCategory");

export const updateBarCategoryFn =
call("updateBarCategory");

export const deleteBarCategoryFn =
call("deleteBarCategory");

export const createBarProductFn =
call("createBarProduct");

export const updateBarProductFn =
call("updateBarProduct");

export const deleteBarProductFn =
call("deleteBarProduct");

export const createBarIncomingFn =
call("createBarIncoming");

export const deleteBarIncomingFn =
call("deleteBarIncoming");

export const addItemToCheckFastFn = httpsCallable(
  functions,
  "addItemToCheckFast"
);