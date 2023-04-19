import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { System, NewSystem } from './interfaces/system';
import { Geometry, NewGeometry } from './interfaces/geometry';
import { Comment, CommentMeta, NewComment } from './interfaces/comment';
import { Mesh } from './interfaces/mesh';
import { Tool } from './interfaces/tool';
import { Country, NewCountry } from './interfaces/country';
import { Contributor } from './interfaces/contributor';
import { MessageService } from './message.service';
import { NewToolGeometryAssociation, ToolGeometryAssociation } from './interfaces/tool_geometry_association';
import { ConfiguredTool } from './interfaces/configured_tool';
import { ToolMeshAssociation } from './interfaces/tool_mesh_association';
import { DeleteResponse } from './interfaces/delete_response';


@Injectable({
  providedIn: 'root'
})
export class HyperdbService {

  private apiUrl = 'api/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  login(form: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'token', form)
    .pipe(
      catchError(this.handleError<null>('login', null))
    );
  }

  me(): Observable<Contributor> {
    return this.http.get<Contributor>(this.apiUrl + 'me/', this.httpOptions)
    .pipe(
      catchError(this.handleError<Contributor>('me'))
    );
  }

  uploadGeometry(form: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'upload-geometry/', form, {
        reportProgress: true,
        observe: 'events'
    })
  }

  getComments(): Observable<Comment[]> {
    let url = this.apiUrl + 'comments'
    return this.http.get<Comment[]>(url)
    .pipe(
      catchError(this.handleError<Comment[]>('getComments', []))
    );
  }

  getCommentsMeta(): Observable<CommentMeta[]> {
    let url = this.apiUrl + 'comments/meta'
    return this.http.get<CommentMeta[]>(url)
    .pipe(
      catchError(this.handleError<CommentMeta[]>('getComments', []))
    );
  }

  postComment(comment: NewComment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl + 'comments', comment)
      .pipe(
        catchError(this.handleError<Comment>('postComment'))
      );
  }

  deleteComment(comment: Comment): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(this.apiUrl + 'comments/' + comment.id)
      .pipe(
        catchError(this.handleError<DeleteResponse>('deleteComment'))
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

  putSystem(system: System): Observable<System> {
    return this.http.put<System>(this.apiUrl + 'systems/' + system.id, system)
      .pipe(
        catchError(this.handleError<System>('putSystem'))
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

  deleteSystem(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(this.apiUrl + 'systems/' + id)
      .pipe(
        catchError(this.handleError<DeleteResponse>('deleteSystems'))
      );
  }

  getGeometries(): Observable<Geometry[]> {
    return this.http.get<Geometry[]>(this.apiUrl + 'geometries')
      .pipe(
        catchError(this.handleError<Geometry[]>('getGeometries', []))
      );
  }

  getGeometry(id: number): Observable<Geometry> {
    return this.http.get<Geometry>(this.apiUrl + 'geometries/' + id)
  }

  postGeometry(geometry: NewGeometry): Observable<Geometry> {
    return this.http.post<Geometry>(this.apiUrl + 'geometries', geometry)
      .pipe(
        catchError(this.handleError<Geometry>('postGeometry'))
      );
  }

  putGeometry(geometry: Geometry): Observable<Geometry> {
    return this.http.put<Geometry>(this.apiUrl + 'geometries/' + geometry.id, geometry)
      .pipe(
        catchError(this.handleError<Geometry>('putGeometry'))
      );
  }

  getGeometryComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl + 'geometries/' + id + "/comments")
  }

  getGeometryTools(id: number): Observable<ToolGeometryAssociation[]> {
    return this.http.get<ToolGeometryAssociation[]>(this.apiUrl + 'geometries/' + id + "/tools")
      .pipe(
        catchError(this.handleError<ToolGeometryAssociation[]>('getGeometryTools'))
      );
  }

  deleteGeometryTools(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(this.apiUrl + 'geometries/' + id + "/tools")
      .pipe(
        catchError(this.handleError<DeleteResponse>('deleteGeometryTools'))
      );
  }
  
  getGeometryMeshes(id: number): Observable<Mesh[]> {
    return this.http.get<Mesh[]>(this.apiUrl + 'geometries/' + id + "/meshes")
  }

  deleteGeometry(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(this.apiUrl + 'geometries/' + id)
      .pipe(
        catchError(this.handleError<DeleteResponse>('deleteGeometry'))
      );
  }

  getContributors(): Observable<Contributor[]> {
    return this.http.get<Contributor[]>(this.apiUrl + 'contributors')
      .pipe(
        catchError(this.handleError<Contributor[]>('getContributors', []))
      );
  }

  getContributor(id: number): Observable<Contributor> {
    return this.http.get<Contributor>(this.apiUrl + 'contributors/' + id)
      .pipe(
        catchError(this.handleError<Contributor>('getContributor'))
      );
  }

  getContributorComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl + 'contributors/' + id + '/comments')
      .pipe(
        catchError(this.handleError<Comment[]>('getContributorComments', []))
      );
  }

  getTools(): Observable<Tool[]> {
    return this.http.get<Tool[]>(this.apiUrl + 'tools')
      .pipe(
        catchError(this.handleError<Tool[]>('getTools', []))
      );
  }

  getConfiguredTools(): Observable<ConfiguredTool[]> {
    return this.http.get<ConfiguredTool[]>(this.apiUrl + 'configured-tools')
      .pipe(
        catchError(this.handleError<ConfiguredTool[]>('getConfiguredTools', []))
      );
  }

  getToolGeometryAssociations(): Observable<ToolGeometryAssociation[]> {
    return this.http.get<ToolGeometryAssociation[]>(this.apiUrl + 'tool-geometry-associations')
      .pipe(
        catchError(this.handleError<ToolGeometryAssociation[]>('getToolGeometryAssociations', []))
      );
  }

  getToolMeshAssociations(): Observable<ToolMeshAssociation[]> {
    return this.http.get<ToolMeshAssociation[]>(this.apiUrl + 'tool-mesh-associations')
      .pipe(
        catchError(this.handleError<ToolMeshAssociation[]>('getToolMeshAssociations', []))
      );
  }

  postToolGeometryAssociations(associations: NewToolGeometryAssociation[]): Observable<ToolGeometryAssociation[]> {
    return this.http.post<ToolGeometryAssociation[]>(this.apiUrl + 'tool-geometry-associations-bulk', associations)
      .pipe(
        catchError(this.handleError<ToolGeometryAssociation[]>('postToolGeometryAssociations'))
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
      console.log(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a message */
  private log(message: string) {
    this.messageService.add(`HyperdbService: ${message}`);
  }
}
