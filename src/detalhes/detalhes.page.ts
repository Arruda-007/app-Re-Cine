import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MovieService } from '../app/services/movie.service'; // ajuste o caminho conforme sua estrutura

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DetalhesPage implements OnInit {

  // Dados mockados do filme
  filme: any = {};
  isFavorito = false;

  
  constructor(private route: ActivatedRoute,  private movieService: MovieService) { }
  
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
        elenco: [] // pode preencher depois com outro endpoint
      };

        // Agora busca o elenco
    this.movieService.getElencoDoFilme(id).subscribe((creditos: any) => {
      // Pegando só os primeiros 10 atores
      this.filme.elenco = creditos.cast.slice(0, 10).map((ator: any) => ({
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
    console.log('Filme favoritado:', this.isFavorito);
    
    // Aqui você implementaria a lógica de favoritar
    // Exemplo: salvar no localStorage, enviar para API, etc.
    
    // Feedback no console para ver se está funcionando
    if (this.isFavorito) {
      console.log('❤️ Filme adicionado aos favoritos!');
    } else {
      console.log('💔 Filme removido dos favoritos!');
    }
  }
  
  getInitials(nome: string): string {
    return nome.split(' ')
      .map(palavra => palavra.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  
  // Método para carregar filme (usar quando integrar com API)
  // carregarFilme(id: string) {
  //   // Aqui você faria a chamada para a API
  //   // this.filmeService.getFilme(id).subscribe(filme => {
  //   //   this.filme = filme;
  //   // });
  // }
}