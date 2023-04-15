import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { System } from './interfaces/system';
import { Geometry } from './interfaces/geometry';
import { Comment } from './interfaces/comment';
import { Mesh } from './interfaces/mesh';
import { Tool } from './interfaces/tool';
import { CountrySystemAssociation } from './interfaces/country_system_association';
import { Contributor } from './interfaces/contributor';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class HyperdbService {

  private apiUrl = 'api/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getComments(type?: string): Observable<Comment[]> {
    let url = this.apiUrl + 'comments'
    if (type != undefined) {
      url += "?type=" + type;
    }

    return this.http.get<Comment[]>(url)
      .pipe(
        catchError(this.handleError<Comment[]>('getComments', []))
      );
  }

  getSystemCountryAssociations(): Observable<CountrySystemAssociation[]> {
    return this.http.get<CountrySystemAssociation[]>(this.apiUrl + 'systems')
      .pipe(
        catchError(this.handleError<CountrySystemAssociation[]>('getCountrySystemAssociations', []))
      );
  }

  getMeshes(): Observable<Mesh[]> {
    return this.http.get<Mesh[]>(this.apiUrl + 'meshes')
      .pipe(
        catchError(this.handleError<Mesh[]>('getMeshes', []))
      );
  }

  getSystems(): Observable<System[]> {
    return this.http.get<System[]>(this.apiUrl + 'systems')
      .pipe(
        catchError(this.handleError<System[]>('getSystems', []))
      );
  }

  getGeometries(): Observable<Geometry[]> {
    return this.http.get<Geometry[]>(this.apiUrl + 'geometries')
      .pipe(
        catchError(this.handleError<Geometry[]>('getGeometries', []))
      );
  }

  getContributors(): Observable<Contributor[]> {
    return this.http.get<Contributor[]>(this.apiUrl + 'contributors')
      .pipe(
        catchError(this.handleError<Contributor[]>('getContributors', []))
      );
  }

  getTools(): Observable<Tool[]> {
    return this.http.get<Tool[]>(this.apiUrl + 'tools')
      .pipe(
        catchError(this.handleError<Tool[]>('getTools', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a message */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
