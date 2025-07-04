import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonButton,
  IonButtons, IonBackButton
} from '@ionic/angular/standalone';

import { NavController } from '@ionic/angular';
import { FirebaseService, db } from '../services/firebase.service'; // ✅ usa o serviço
import { doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton,
    IonButtons, IonBackButton
  ]
})
export class CadastroPage implements OnInit {
  cadastro = {
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  async cadastrar() {
    if (this.cadastro.senha !== this.cadastro.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      const userCredential = await this.firebaseService.register(
        this.cadastro.email,
        this.cadastro.senha
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        nome: this.cadastro.nome,
        sobrenome: this.cadastro.sobrenome,
        email: this.cadastro.email
      });

      localStorage.setItem('usuario', JSON.stringify({
        uid,
        nome: this.cadastro.nome,
        sobrenome: this.cadastro.sobrenome,
        email: this.cadastro.email
      }));

      alert('Cadastro realizado com sucesso!');
      this.navCtrl.navigateRoot('/principal');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar: ' + (error as any).message);
    }
  }
}
