import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonButton, IonIcon, IonInput, IonBackButton
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDtlXmE4m0tMCrVoJJ2WLz7Zs0PUkFiehA",
  authDomain: "re-cine.firebaseapp.com",
  projectId: "re-cine",
  storageBucket: "re-cine.firebasestorage.app",
  messagingSenderId: "311664258317",
  appId: "1:311664258317:web:a687b801cf635c2b689444",
  measurementId: "G-74LB0CN39R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, IonInput, IonBackButton
  ]
})
export class LoginPage implements OnInit {

  email: string = '';
  senha: string = '';

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  goBack() {
    this.navCtrl.navigateBack('/home');
  }

 async fazerLogin() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, this.email, this.senha);
    const user = userCredential.user;

    console.log('Login realizado com sucesso!', user);

    // 🟢 Salvar no localStorage
    localStorage.setItem('usuarioLogado', JSON.stringify({
      nome: user.displayName || 'Não informado',
      email: user.email || 'Não informado'
    }));

    this.navCtrl.navigateForward('/principal');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login: ' + (error as any).message);
  }
}

}
