import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = '2052a8753dc64d27e0a8ca46ca5eec06'; // 🔒 Substitua pela sua chave da TMDb
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  // Filmes populares
  getFilmesPopulares(page: number = 1): Observable<any> {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=pt-BR&page=${page}`;
    return this.http.get(url);
  }

  // Buscar filme por ID
  getFilmePorId(id: number): Observable<any> {
    const url = `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=pt-BR`;
    return this.http.get(url);
  }

  // Buscar elenco de um filme
  getElencoPorId(id: number): Observable<any> {
    const url = `${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}&language=pt-BR`;
    return this.http.get(url);
  }

  // Buscar por termo de pesquisa
  buscarFilmes(termo: string): Observable<any> {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=pt-BR&query=${encodeURIComponent(termo)}`;
    return this.http.get(url);
  }

  getElencoDoFilme(id: number) {
  return this.http.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=2052a8753dc64d27e0a8ca46ca5eec06&language=pt-BR`);
}

 //generos filmes
getGeneros(): Observable<any> {
  const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=pt-BR`;
  return this.http.get(url);
}
}
