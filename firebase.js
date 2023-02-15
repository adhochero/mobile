import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } 
    from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, onDisconnect, ref, set, get, update, onValue } 
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

//listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    const userRef = ref(db, "users/" + uid);

    //set user to db
    set(userRef, {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
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

async function getMyId() {
    return await signInAnonymously(auth)
    .then(() => auth.currentUser.uid)
    .catch((error) => {
        console.log(
            "errorCode: " + error.code,
            "errorMessage: " + error.message
        );
        return undefined
    });
}

async function getAllUsers(){
    const allUsersRef = ref(db, "users");
    const snapshot = await get(allUsersRef);
    return snapshot.val();
}

function updateUserData(id, x, y, direction){
    update(ref(db, "users/" + id), {
        x: x,
        y: y,
        dx: direction.x,
        dy: direction.y
    }).catch((error) => {
        console.log(error);
    });
}


export { getMyId, getAllUsers, updateUserData };