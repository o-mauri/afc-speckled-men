import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Players
  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/players`);
  }

  createPlayer(data: { name: string; image?: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/players`, data, { headers: this.authHeaders() });
  }

  updatePlayer(id: string, data: { name?: string; image?: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/players/${id}`, data, { headers: this.authHeaders() });
  }

  deletePlayer(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/players/${id}`, { headers: this.authHeaders() });
  }

  // Seasons
  getSeasons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/seasons`);
  }

  createSeason(data: { name: string; isActive: boolean }): Observable<any> {
    return this.http.post(`${this.baseUrl}/seasons`, data, { headers: this.authHeaders() });
  }

  updateSeason(id: string, data: { name?: string; isActive?: boolean }): Observable<any> {
    return this.http.put(`${this.baseUrl}/seasons/${id}`, data, { headers: this.authHeaders() });
  }

  deleteSeason(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/seasons/${id}`, { headers: this.authHeaders() });
  }

  // Matches
  getMatches(seasonId?: string): Observable<any[]> {
    let params = new HttpParams();
    if (seasonId) {
      params = params.set('seasonId', seasonId);
    }
    return this.http.get<any[]>(`${this.baseUrl}/matches`, { params });
  }

  createMatch(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/matches`, data, { headers: this.authHeaders() });
  }

  updateMatch(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/matches/${id}`, data, { headers: this.authHeaders() });
  }

  deleteMatch(id: string, seasonId: string, date: string): Observable<any> {
    const params = new HttpParams().set('seasonId', seasonId).set('date', date);
    return this.http.delete(`${this.baseUrl}/matches/${id}`, { params, headers: this.authHeaders() });
  }

  // Stats
  getStats(seasonId?: string): Observable<any> {
    let params = new HttpParams();
    if (seasonId) {
      params = params.set('seasonId', seasonId);
    }
    return this.http.get(`${this.baseUrl}/stats`, { params });
  }

  // Auth
  login(password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, { password });
  }
}
