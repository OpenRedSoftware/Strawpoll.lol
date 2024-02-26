import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { firebaseConfig } from '/firebaseConfig.js';

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
