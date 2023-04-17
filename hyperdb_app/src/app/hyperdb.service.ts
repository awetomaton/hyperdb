import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { System, NewSystem } from './interfaces/system';
import { Geometry } from './interfaces/geometry';
import { Comment, NewComment } from './interfaces/comment';
import { Mesh } from './interfaces/mesh';
import { Tool } from './interfaces/tool';
import { Country, NewCountry } from './interfaces/country';
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

  getComments(): Observable<Comment[]> {
    let url = this.apiUrl + 'comments'
    return this.http.get<Comment[]>(url)
      .pipe(
        catchError(this.handleError<Comment[]>('getComments', []))
      );
  }

  postComment(comment: NewComment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl + 'comments', comment)
      .pipe(
        catchError(this.handleError<Comment>('postComment'))
      );
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiUrl + 'countries')
      .pipe(
        catchError(this.handleError<Country[]>('getCountries', []))
      );
  }

  postCountry(country: NewCountry): Observable<Country> {
    return this.http.post<Country>(this.apiUrl + 'countries', country)
      .pipe(
        catchError(this.handleError<Country>('postCountry'))
      );
  }

  getMeshes(): Observable<Mesh[]> {
    return this.http.get<Mesh[]>(this.apiUrl + 'meshes')
      .pipe(
        catchError(this.handleError<Mesh[]>('getMeshes', []))
      );
  }

  getSystem(id: number): Observable<System> {
    return this.http.get<System>(this.apiUrl + 'systems/' + id)
  }

  postSystem(system: NewSystem): Observable<System> {
    return this.http.post<System>(this.apiUrl + 'systems', system)
      .pipe(
        catchError(this.handleError<System>('postSystem'))
      );
  }

  getSystemsComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl + 'systems/comments')
  }

  getSystemComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl + 'systems/' + id + "/comments")
  }

  getSystemGeometries(id: number): Observable<Geometry[]> {
    return this.http.get<Geometry[]>(this.apiUrl + 'systems/' + id + "/geometries")
  }

  getSystems(): Observable<System[]> {
    return this.http.get<System[]>(this.apiUrl + 'systems')
      .pipe(
        catchError(this.handleError<System[]>('getSystems', []))
      );
  }

  deleteSystem(id: number): Observable<null> {
    return this.http.delete<null>(this.apiUrl + 'systems/' + id)
      .pipe(
        catchError(this.handleError<null>('deleteSystems', null))
      );
  }

  getGeometries(): Observable<Geometry[]> {
    return this.http.get<Geometry[]>(this.apiUrl + 'geometries')
      .pipe(
        catchError(this.handleError<Geometry[]>('getGeometries', []))
      );
  }

  deleteGeometry(id: number): Observable<null> {
    return this.http.delete<null>(this.apiUrl + 'geometries/' + id)
      .pipe(
        catchError(this.handleError<null>('deleteGeometries', null))
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
