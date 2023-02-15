import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } 
    from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, onDisconnect, ref, set, get, onValue } 
    from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDGc8fSoXoAOQCjVfs4iUQiLzzyW3827Io",
  authDomain: "mobile-6f7b3.firebaseapp.com",
  databaseURL: "https://mobile-6f7b3-default-rtdb.firebaseio.com",
  projectId: "mobile-6f7b3",
  storageBucket: "mobile-6f7b3.appspot.com",
  messagingSenderId: "303084622691",
  appId: "1:303084622691:web:8a710a58aa27b0ef65b956"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

let uid;
let userRef;

//listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    uid = user.uid;
    userRef = ref(db, "users/" + uid);

    //set user to db
    set(userRef, {
        id: uid,
        x: 666 * 0.5,
        y: 333 * 0.5,
        ix: 0,
        iy: 0
    });

    //remove user from db on disconnect
    onDisconnect(userRef).remove(userRef);
  } else {
    // User is signed out
    // ...
  }
});

signInAnonymously(auth).catch((error) => {
    console.log(
        "errorCode: " + error.code,
        "errorMessage: " + error.message
    );
});

async function getAllUsers(){
    const allUsersRef = ref(db, "users");
    const snapshot = await get(allUsersRef);
    return snapshot.val();
}

export { getAllUsers };