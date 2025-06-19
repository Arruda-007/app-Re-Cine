import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { MovieService } from '../app/services/movie.service'; 

interface Filme {
  id: number;
  titulo: string;
  poster: string;
  rating: number;
  ano: string;
  favorito: boolean;
}


@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,  HttpClientModule],
  providers: [MovieService] // 👈 Força o Angular a reconhecer
})
export class PrincipalPage implements OnInit {

  buscaAtiva = false;
  termoBusca = '';
  carregando = false;
  categoriaAtual = 'Populares';
  filmesFiltrados: any[] = [];
  todoFilmes: any[] = [];
  paginaAtual = 1;
  totalPaginas = 1;
  filmes: any[] = [];
  generos: any[] = [];


  constructor(private router: Router, private http: HttpClient, private movieService: MovieService ) { }

  ngOnInit() {
    console.log('Página Principal carregada');
    // Inicializar arrays
    this.buscarFilmesApi(); // Carregar filmes da API
    this.carregarGeneros();
    this.carregarMaisFilmes();
  }

  getIconeGenero(nome: string): string {
  const icones: { [key: string]: string } = {
    Ação: 'flame-outline',
    Aventura: 'compass-outline',
    Animação: 'color-palette-outline',
    Comédia: 'happy-outline',
    Crime: 'alert-circle-outline',
    Documentário: 'book-outline',
    Drama: 'sad-outline',
    Família: 'people-outline',
    Fantasia: 'sparkles-outline',
    História: 'time-outline',
    Terror: 'skull-outline',
    Música: 'musical-notes-outline',
    Mistério: 'help-circle-outline',
    Romance: 'heart-outline',
    Ficção: 'planet-outline',
    Suspense: 'eye-outline',
    Guerra: 'medkit-outline',
    Faroeste: 'navigate-outline'
  };

  return icones[nome] || 'film-outline'; // ícone padrão
}

  filtrarPorGenero(idGenero: number) {
  this.filmesFiltrados = this.filmes.filter(filme =>
    filme.generos?.includes(idGenero)
  );
}

  carregarGeneros() {
  this.movieService.getGeneros().subscribe(res => {
    this.generos = res.genres;
  });
}

  carregarMaisFilmes(event?: CustomEvent) {
    if (this.paginaAtual > this.totalPaginas) {
    if (event) (event.target as HTMLIonInfiniteScrollElement).disabled = true;
    return;
  }

      this.carregando = true;

      this.movieService.getFilmesPopulares(this.paginaAtual).subscribe(res => {
       const novosFilmes: Filme[] = res.results.map((filme: any) => ({
        id: filme.id,
        titulo: filme.title,
        poster: 'https://image.tmdb.org/t/p/w500' + filme.poster_path,
        rating: filme.vote_average,
        ano: filme.release_date?.split('-')[0],
        favorito: false,
        generos: filme.genre_ids
    }));

    // Filtrar apenas os filmes que ainda não estão na lista
      const filmesNaoRepetidos = novosFilmes.filter(
      (novo: Filme) => !this.filmes.some(f => f.id === novo.id)
      );

    // Só adiciona os filmes únicos
      this.filmes.push(...filmesNaoRepetidos);

      this.filmesFiltrados = this.filmes;
      this.paginaAtual++;
      this.totalPaginas = res.total_pages; // ← armazena o total de páginas

    if (event) (event.target as HTMLIonInfiniteScrollElement).complete();
    this.carregando = false;

    // Desativa scroll se não tiver mais páginas
    if (this.paginaAtual > this.totalPaginas && event) {
      (event.target as HTMLIonInfiniteScrollElement).disabled = true;
    }
  }, () => {
    if (event) (event.target as HTMLIonInfiniteScrollElement).complete();
    this.carregando = false;
  });
}


  abrirMenu() {
    console.log('Menu aberto');
    // Aqui você implementaria a abertura do menu lateral
    // Exemplo: this.menuController.open();
  }

  abrirBusca() {
    this.buscaAtiva = !this.buscaAtiva;
    console.log('Busca ativada:', this.buscaAtiva);
    
    // Focar no input de busca após ativação
    if (this.buscaAtiva) {
      setTimeout(() => {
        const inputElement = document.querySelector('.search-item ion-input') as HTMLIonInputElement;
        if (inputElement) {
          inputElement.setFocus();
        }
      }, 200);
    } else {
      // Limpar busca ao fechar
      this.termoBusca = '';
      this.filtrarPorCategoria(this.categoriaAtual);
    }
  }

  buscarFilmes(event: any) {
    const termo = event.detail.value.toLowerCase();
    console.log('Buscando por:', termo);
    
    if (termo.trim() === '') {
      // Resetar para filmes da categoria atual
      this.filtrarPorCategoria(this.categoriaAtual);
    } else {
      // Filtrar filmes por título
      this.filmesFiltrados = this.todoFilmes.filter(filme => 
        filme.titulo.toLowerCase().includes(termo)
      );
    }
  }

  limparBusca() {
    this.termoBusca = ''; // Limpa o texto
    this.filtrarPorCategoria(this.categoriaAtual); // Reseta a lista
    console.log('Busca limpa');
  }

  selecionarCategoria(categoria: any) {
    // Desativar todas as categorias de gênero
    this.generos.forEach(gen => gen.ativo = false);
    
    // Ativar a categoria selecionada se for um gênero
    if (categoria.nome !== 'Favoritos' && categoria.nome !== 'Populares') {
      const genero = this.generos.find(g => g.nome === categoria.nome);
      if (genero) {
        genero.ativo = true;
      }
    }
    
    this.categoriaAtual = categoria.nome;
    
    // Limpar busca quando trocar categoria
    this.termoBusca = '';
    this.buscaAtiva = false;
    
    console.log('Categoria selecionada:', categoria.nome);
    
    // Filtrar filmes por categoria
    this.filtrarPorCategoria(categoria.nome);
  }

  filtrarPorCategoria(categoria: string) {
    switch (categoria) {
      case 'Populares':
        this.filmesFiltrados = [...this.todoFilmes];
        break;
      case 'Favoritos':
        this.filmesFiltrados = this.todoFilmes.filter(filme => filme.favorito);
        break;
      default:
        this.filmesFiltrados = this.todoFilmes.filter(filme => 
          filme.categoria === categoria
        );
        break;
    }
    console.log(`Categoria ${categoria}: ${this.filmesFiltrados.length} filmes`);
  }

  // Método para contar favoritos
  getFavoritosCount(): number {
    return this.todoFilmes.filter(filme => filme.favorito).length;
  }

  carregarFilmesPorCategoria(categoria: string) {
    this.carregando = true;
    
    // Simular carregamento
    setTimeout(() => {
      console.log('Carregando categoria:', categoria);
      this.carregando = false;
    }, 1000);
  }

  toggleFavorito(filme: any, event: Event) {
    event.stopPropagation();
    
    filme.favorito = !filme.favorito;
    console.log('Filme favoritado:', filme.titulo, filme.favorito);
    
    // Se estamos na aba de favoritos, atualizar a lista
    if (this.categoriaAtual === 'Favoritos') {
      this.filtrarPorCategoria('Favoritos');
    }
    
    if (filme.favorito) {
      console.log('❤️ Adicionado aos favoritos:', filme.titulo);
      this.mostrarFeedbackFavorito(true);
    } else {
      console.log('💔 Removido dos favoritos:', filme.titulo);
      this.mostrarFeedbackFavorito(false);
    }
  }

  mostrarFeedbackFavorito(adicionado: boolean) {
    // Feedback visual simples
    console.log(adicionado ? '✨ Filme adicionado aos favoritos!' : '💔 Filme removido dos favoritos');
    
    // Aqui você pode adicionar toast, alert ou animação mais elaborada
    // Exemplo com toast (precisa importar ToastController):
    // const toast = await this.toastController.create({
    //   message: adicionado ? 'Adicionado aos favoritos!' : 'Removido dos favoritos',
    //   duration: 2000,
    //   position: 'bottom'
    // });
    // toast.present();
  }

  abrirDetalhes(filmeId: number) {
    console.log('Abrindo detalhes do filme:', filmeId);
    
    // Buscar o filme específico
    const filme = this.todoFilmes.find(f => f.id === filmeId);
    if (filme) {
      console.log('Filme selecionado:', filme.titulo);
    }
    
    // Navegar para página de detalhes
    this.router.navigate(['/detalhes', filmeId]).catch(err => {
      console.log('Erro na navegação - Rota /detalhes não configurada ainda:', err);
      console.log('💡 Dica: Configure a rota /detalhes no app-routing.module.ts');
    });
  }

  irParaFavoritos() {
    console.log('Navegando para seção Favoritos');
    // Selecionar automaticamente a categoria Favoritos
    this.selecionarCategoria({ nome: 'Favoritos', ativo: false });
  }

  irParaPerfil() {
    console.log('Navegando para Perfil');
    this.router.navigate(['/perfil']).catch(err => {
      console.log('Erro na navegação - Rota /perfil não configurada ainda:', err);
      console.log('💡 Dica: Configure a rota /perfil no app-routing.module.ts');
    });
  }

  // Métodos utilitários adicionais

  /**
   * Método para ordenar filmes por rating
   */
  ordenarPorRating() {
    this.filmesFiltrados.sort((a, b) => b.rating - a.rating);
    console.log('Filmes ordenados por rating');
  }

  /**
   * Método para ordenar filmes por ano
   */
  ordenarPorAno() {
    this.filmesFiltrados.sort((a, b) => b.ano - a.ano);
    console.log('Filmes ordenados por ano');
  }

  /**
   * Método para obter estatísticas
   */
  obterEstatisticas() {
    const stats = {
      totalFilmes: this.todoFilmes.length,
      totalFavoritos: this.getFavoritosCount(),
      porcentagemFavoritos: Math.round((this.getFavoritosCount() / this.todoFilmes.length) * 100),
      generoMaisFavorito: this.obterGeneroMaisFavorito(),
      ratingMedio: this.calcularRatingMedio()
    };
    
    console.log('📊 Estatísticas dos filmes:', stats);
    return stats;
  }

  /**
   * Método para encontrar o gênero com mais favoritos
   */
  private obterGeneroMaisFavorito(): string {
    const favoritos = this.todoFilmes.filter(f => f.favorito);
    const generoCount: { [key: string]: number } = {};
    
    favoritos.forEach(filme => {
      generoCount[filme.categoria] = (generoCount[filme.categoria] || 0) + 1;
    });
    
    return Object.keys(generoCount).reduce((a, b) => 
      generoCount[a] > generoCount[b] ? a : b, 'Nenhum'
    );
  }

  /**
   * Método para calcular rating médio
   */
  private calcularRatingMedio(): number {
    const soma = this.todoFilmes.reduce((acc, filme) => acc + filme.rating, 0);
    return Math.round((soma / this.todoFilmes.length) * 10) / 10;
  }

API_KEY = 'Bearer SEU_TOKEN_AQUI'; // coloque aqui seu token no formato Bearer

buscarFilmesApi() {
  this.carregando = true;
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=2052a8753dc64d27e0a8ca46ca5eec06&language=pt-BR`;

   this.http.get(url).subscribe({
    next: (res: any) => {
      this.todoFilmes = res.results.map((filme: any) => ({
        id: filme.id,
        titulo: filme.title,
        ano: parseInt(filme.release_date?.split('-')[0] || '0', 10),
        rating: filme.vote_average,
        favorito: false,
        categoria: 'Populares',
        poster: `https://image.tmdb.org/t/p/w500${filme.poster_path}`
      }));
      this.filmesFiltrados = [...this.todoFilmes];
      this.carregando = false;
      console.log('Filmes carregados da API:', this.todoFilmes);
    },
    error: (err) => {
      console.error('Erro ao buscar filmes da API:', err);
      this.carregando = false;
    }
  });
}


}

