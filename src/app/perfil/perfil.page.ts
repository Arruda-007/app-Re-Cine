// src/app/perfil/perfil.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonBackButton, IonButton, IonIcon, AlertController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { person, personOutline, mailOutline, logOutOutline } from 'ionicons/icons';

import { FirebaseService } from 'src/app/services/firebase.service'; // 🔥 Serviço

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonButton, IonIcon,
    CommonModule, FormsModule
  ]
})
export class PerfilPage implements OnInit {
  usuario = {
    nome: '',
    sobrenome: '',
    email: '',
    favoritos: [] as number[]
  };

  constructor(
    private alertController: AlertController,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    addIcons({
      person,
      personOutline,
      mailOutline,
      logOutOutline
    });
  }

  async ngOnInit() {
    const user = this.firebaseService.getCurrentUser();

    if (user) {
      this.usuario.email = user.email || '';

      try {
        const dados = await this.firebaseService.getUserData(user.uid);

        this.usuario.nome = dados['nome'] || '';
        this.usuario.sobrenome = dados['sobrenome'] || '';
        this.usuario.favoritos = dados['favoritos'] || [];
      } catch (error) {
        console.warn('⚠️ Erro ao buscar dados do Firestore:', error);
      }

    } else {
      console.warn('⚠️ Nenhum usuário logado');
    }
  }

  async confirmarSaida() {
    const alert = await this.alertController.create({
      header: 'Confirmar Saída',
      message: 'Tem certeza que deseja sair?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Sair',
          cssClass: 'alert-button-confirm',
          handler: () => this.sair()
        }
      ]
    });

    await alert.present();
  }

  sair() {
    this.firebaseService.logout();
    this.router.navigate(['/home']);
  }
}
