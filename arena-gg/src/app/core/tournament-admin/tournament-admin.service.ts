import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TournamentDto {
  id?: string;
  gameId: string;
  name: string;
  description?: string;
  prize: number;
  fee: number;
  maxEntries: number;
  format: string;
  mode: string;
  level: string;
  status: string;
  featured: boolean;
  startsAt: string;
  entries?: number;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TournamentAdminService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/api/tournaments';

  getAll(userId?: string): Observable<TournamentDto[]> {
    const params = userId ? `?userId=${userId}` : '';
    return this.http.get<TournamentDto[]>(`${this.api}${params}`);
  }

  getById(id: string, userId?: string): Observable<TournamentDto> {
    const params = userId ? `?userId=${userId}` : '';
    return this.http.get<TournamentDto>(`${this.api}/${id}${params}`);
  }

  registerToTournament(tournamentId: string, userId: string): Observable<any> {
    return this.http.post(`${this.api}/${tournamentId}/register`, { userId });
  }

  create(t: TournamentDto): Observable<TournamentDto> {
    return this.http.post<TournamentDto>(this.api, t);
  }

  update(id: string, t: TournamentDto): Observable<TournamentDto> {
    return this.http.put<TournamentDto>(`${this.api}/${id}`, t);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
