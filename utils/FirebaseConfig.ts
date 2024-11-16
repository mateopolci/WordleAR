import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDHOIScGSqARs5Ns9YIqxBXKY2TdQX0VKs',
    authDomain: 'wordlear-c9374.firebaseapp.com',
    projectId: 'wordlear-c9374',
    storageBucket: 'wordlear-c9374.appspot.com',
    messagingSenderId: '376926164261',
    appId: '1:376926164261:web:a0144b9580a5ea0c54f6cc',
};

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app);