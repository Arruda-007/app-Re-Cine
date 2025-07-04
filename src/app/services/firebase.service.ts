// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtlXmE4m0tMCrVoJJ2WLz7Zs0PUkFiehA",
  authDomain: "re-cine.firebaseapp.com",
  projectId: "re-cine",
  storageBucket: "re-cine.appspot.com",
  messagingSenderId: "311664258317",
  appId: "1:311664258317:web:a687b801cf635c2b689444",
  measurementId: "G-74LB0CN39R"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  async saveUserData(uid: string, data: any) {
    return setDoc(doc(db, "usuarios", uid), data, { merge: true });
  }

  async getUserData(uid: string): Promise<any> {
    const ref = doc(db, "usuarios", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }

  async updateUserData(uid: string, data: any) {
    const ref = doc(db, "usuarios", uid);
    return updateDoc(ref, data);
  }
}

export { auth, db };
