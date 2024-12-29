// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAi1gCQuw2Hn7EltdwLiEBfZdh4pI-B9R4",
    authDomain: "simple-messaging-app-d60d5.firebaseapp.com",
    databaseURL: "https://simple-messaging-app-d60d5-default-rtdb.firebaseio.com",
    projectId: "simple-messaging-app-d60d5",
    storageBucket: "simple-messaging-app-d60d5.firebasestorage.app",
    messagingSenderId: "838083703261",
    appId: "1:838083703261:web:66be6b36527ad3043c8634"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const loginBox = document.getElementById('loginBox');
const chatBox = document.getElementById('chatBox');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const userEmail = document.getElementById('userEmail');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');

// Buttons
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const sendBtn = document.getElementById('sendBtn');

// Handle auth state changes
function handleAuthStateChange(user) {
    if (user) {
        loginBox.style.display = 'none';
        chatBox.style.display = 'block';
        userEmail.innerText = user.email;
        loadMessages();
    } else {
        loginBox.style.display = 'block';
        chatBox.style.display = 'none';
        messages.innerHTML = '';
    }
}

// Login function
function handleLogin() {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.signInWithEmailAndPassword(email, password).catch(handleError);
}

// Register function
function handleRegister() {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.createUserWithEmailAndPassword(email, password).catch(handleError);
}

// Error handler
function handleError(error) {
    alert(error.message);
}

// Load messages
function loadMessages() {
    const messagesRef = database.ref('messages');
    messagesRef.on('child_added', handleNewMessage);
}

// Handle new message from database
function handleNewMessage(snapshot) {
    const message = snapshot.val();
    console.log("New message", message)
    displayMessage(message);
}

// Display a message
function displayMessage(message) {
    const div = document.createElement('div');
    div.className = 'message';

    if (message.userId === auth.currentUser.uid) {
        div.classList.add('sent');
    } else {
        div.classList.add('received');
        const emailDiv = document.createElement('div');
        emailDiv.className = 'sender-email';
        emailDiv.innerText = message.userEmail;
        div.appendChild(emailDiv);
    }

    const textDiv = document.createElement('div');
    textDiv.innerText = message.text;
    div.appendChild(textDiv);
    messages.appendChild(div);
}

// Send message
function handleSendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    database.ref('messages').push({
        text: message,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    messageInput.value = '';
}

// Add event listeners
auth.onAuthStateChanged(handleAuthStateChange);
loginBtn.onclick = handleLogin;
registerBtn.onclick = handleRegister;
logoutBtn.onclick = () => auth.signOut();
sendBtn.onclick = handleSendMessage;