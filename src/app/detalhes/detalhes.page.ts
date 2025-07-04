import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DetalhesPage implements OnInit {
  filme: any = {};
  isFavorito = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarFilme(+id);
    }
  }

  carregarFilme(id: number) {
    this.movieService.getFilmePorId(id).subscribe((data: any) => {
      this.filme = {
        titulo: data.title,
        poster_path: data.poster_path,
        rating: data.vote_average,
        ano: data.release_date?.split('-')[0],
        duracao: `${data.runtime} min`,
        sinopse: data.overview,
        generos: data.genres.map((g: any) => g.name),
        elenco: []
      };

      this.movieService.getElencoDoFilme(id).subscribe((creditos: any) => {
        this.filme.elenco = (creditos.cast || [])
          .slice(0, 10)
          .map((ator: any) => ({
            nome: ator.name,
            personagem: ator.character,
            foto: ator.profile_path
              ? `https://image.tmdb.org/t/p/w185${ator.profile_path}`
              : null
          }));
      });
    });
  }

  toggleFavorito() {
    this.isFavorito = !this.isFavorito;
    if (this.isFavorito) {
      console.log('❤️ Filme adicionado aos favoritos!');
    } else {
      console.log('💔 Filme removido dos favoritos!');
    }
  }

  getInitials(nome: string): string {
    return nome
      .split(' ')
      .map((p) => p.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
