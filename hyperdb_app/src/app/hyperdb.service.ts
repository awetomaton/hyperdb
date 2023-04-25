import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { System, NewSystem } from './interfaces/system';
import { Geometry, NewGeometry } from './interfaces/geometry';
import { Comment, CommentMeta, NewComment } from './interfaces/comment';
import { Mesh, NewMesh } from './interfaces/mesh';
import { NewTool, Tool } from './interfaces/tool';
import { Country, NewCountry } from './interfaces/country';
import { Contributor } from './interfaces/contributor';
import { MessageService } from './message.service';
import { NewToolGeometryAssociation, ToolGeometryAssociation } from './interfaces/tool_geometry_association';
import { ConfiguredTool, NewConfiguredTool } from './interfaces/configured_tool';
import { ToolMeshAssociation } from './interfaces/tool_mesh_association';
import { DeleteResponse } from './interfaces/delete_response';
import { NewToolSetting, ToolSetting } from './interfaces/tool_setting';
import { CBAeroSetting, NewCBAeroSetting } from './interfaces/cbaero_setting';
import { Cart3DSetting, NewCart3DSetting } from './interfaces/cart3d_setting';
import { AeroResult } from './interfaces/aero_result';


@Injectable({
  providedIn: 'root'
})
export class HyperdbService {

  public apiUrl = 'api/';  // URL to web api

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

  uploadMesh(form: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'upload-mesh/', form, {
        reportProgress: true,
        observe: 'events'
    }).pipe(
      catchError(this.handleError<{}>())
    );
  }

  uploadToolSetting(form: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'upload-tool-setting/', form, {
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

  getMesh(id: number): Observable<Mesh> {
    return this.http.get<Mesh>(this.apiUrl + 'meshes/' + id)
      .pipe(
        catchError(this.handleError<Mesh>('getMesh'))
      );
  }

  postMesh(newMesh: NewMesh): Observable<Mesh> {
    return this.http.post<Mesh>(this.apiUrl + 'meshes/', newMesh, this.httpOptions)
      .pipe(
        catchError(this.handleError<Mesh>('postMesh'))
      );
  }

  getMeshComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl + 'meshes/' + id + '/comments')
      .pipe(
        catchError(this.handleError<Comment[]>('getMeshComments', []))
      );
  }

  getMeshConfiguredTools(id: number): Observable<ConfiguredTool[]> {
    return this.http.get<ConfiguredTool[]>(this.apiUrl + 'meshes/' + id + '/configured-tools')
      .pipe(
        catchError(this.handleError<ConfiguredTool[]>('getMeshConfiguredTools', []))
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

  getContributorGeometries(id: number): Observable<Geometry[]> {
    return this.http.get<Geometry[]>(this.apiUrl + 'contributors/' + id + '/geometries')
      .pipe(
        catchError(this.handleError<Geometry[]>('getContributorGeometries', []))
      );
  }

  getContributorToolGeometryAssociations(id: number): Observable<ToolGeometryAssociation[]> {
    return this.http.get<ToolGeometryAssociation[]>(this.apiUrl + 'contributors/' + id + '/tool-geometry-associations')
      .pipe(
        catchError(this.handleError<ToolGeometryAssociation[]>('getContributorToolGeometryAssociations', []))
      );
  }

  getContributorMeshes(id: number): Observable<Mesh[]> {
    return this.http.get<Mesh[]>(this.apiUrl + 'contributors/' + id + '/meshes')
      .pipe(
        catchError(this.handleError<Mesh[]>('getContributorMeshes', []))
      );
  }

  getContributorToolMeshAssociations(id: number): Observable<ToolMeshAssociation[]> {
    return this.http.get<ToolMeshAssociation[]>(this.apiUrl + 'contributors/' + id + '/tool-mesh-associations')
      .pipe(
        catchError(this.handleError<ToolMeshAssociation[]>('getContributorToolMeshAssociations', []))
      );
  }

  getTools(name?: string, version?: string): Observable<Tool[]> {
    let url = this.apiUrl + 'tools';
    if (name) {
      url += "?name=" + name;
    }
    if (version) {
      url += "&version=" + version;
    }
    return this.http.get<Tool[]>(url)
      .pipe(
        catchError(this.handleError<Tool[]>('getTools', []))
      );
  }

  getTool(id: number): Observable<Tool> {
    return this.http.get<Tool>(this.apiUrl + 'tools/' + id)
      .pipe(
        catchError(this.handleError<Tool>('getTool'))
      );
  }

  getToolConfigurations(toolId: number): Observable<ConfiguredTool[]> {
    return this.http.get<ConfiguredTool[]>(this.apiUrl + 'tools/' + toolId + '/configurations')
      .pipe(
        catchError(this.handleError<ConfiguredTool[]>('getToolConfigurations'))
      );
  }

  getAeroResultsUrl(meshId: number, configuredToolId: number): string {
    return this.apiUrl + 'aero-results?mesh_id=' + meshId + '&configured_tool_id=' + configuredToolId;
  }

  getAeroResults(meshId: number, configuredToolId: number): Observable<AeroResult[]> {
    return this.http.get<AeroResult[]>(this.getAeroResultsUrl(meshId, configuredToolId))
      .pipe(
        catchError(this.handleError<AeroResult[]>('getAeroResults', []))
      );
  }

  deleteTool(toolId: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(this.apiUrl + 'tools/' + toolId)
      .pipe(
        catchError(this.handleError<DeleteResponse>('deleteTool'))
      );
  }

  postTool(tool: NewTool): Observable<Tool> {
    return this.http.post<Tool>(this.apiUrl + 'tools/', tool, this.httpOptions)
      .pipe(
        catchError(this.handleError<Tool>('postTool'))
      );
  }

  getConfiguredTools(): Observable<ConfiguredTool[]> {
    return this.http.get<ConfiguredTool[]>(this.apiUrl + 'configured-tools')
      .pipe(
        catchError(this.handleError<ConfiguredTool[]>('getConfiguredTools', []))
      );
  }

  postConfiguredTool(configuredTool: NewConfiguredTool): Observable<ConfiguredTool> {
    return this.http.post<ConfiguredTool>(this.apiUrl + 'configured-tools', configuredTool, this.httpOptions)
      .pipe(
        catchError(this.handleError<ConfiguredTool>('postConfiguredTool'))
      );
  }

  getConfiguredTool(id: number): Observable<ConfiguredTool> {
    return this.http.get<ConfiguredTool>(this.apiUrl + 'configured-tools/' + id)
      .pipe(
        catchError(this.handleError<ConfiguredTool>('getConfiguredTool'))
      );
  }

  getConfiguredToolAeroResults(id: number): Observable<AeroResult[]> {
    return this.http.get<AeroResult[]>(this.apiUrl + 'configured-tools/' + id + '/aero-results')
      .pipe(
        catchError(this.handleError<AeroResult[]>('getConfiguredToolAeroResults', []))
      );
  }


  getConfiguredToolMeshes(id: number): Observable<Mesh[]> {
    return this.http.get<Mesh[]>(this.apiUrl + 'configured-tools/' + id + '/meshes')
      .pipe(
        catchError(this.handleError<Mesh[]>('getConfiguredToolMeshes', []))
      );
  }


  getConfiguredToolComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl + 'configured-tools/' + id + '/comments')
      .pipe(
        catchError(this.handleError<Comment[]>('getConfiguredTool', []))
      );
  }

  getToolSetting(id: number): Observable<ToolSetting> {
    return this.http.get<ToolSetting>(this.apiUrl + 'tool-settings/' + id)
      .pipe(
        catchError(this.handleError<ToolSetting>('getToolSetting'))
      );
  }


  postToolSetting(setting: NewToolSetting): Observable<ToolSetting> {
    return this.http.post<ToolSetting>(this.apiUrl + 'tool-settings/', setting, this.httpOptions)
      .pipe(
        catchError(this.handleError<ToolSetting>('postToolSetting'))
      );
  }


  getCBAeroSetting(id: number): Observable<CBAeroSetting> {
    return this.http.get<CBAeroSetting>(this.apiUrl + 'cbaero-settings/' + id)
      .pipe(
        catchError(this.handleError<CBAeroSetting>('getCBAeroSetting'))
      );
  }

  postCBAeroSetting(newCBAeroSetting: NewCBAeroSetting): Observable<CBAeroSetting> {
    return this.http.post<CBAeroSetting>(this.apiUrl + 'cbaero-settings/', newCBAeroSetting, this.httpOptions)
      .pipe(
        catchError(this.handleError<CBAeroSetting>('postCBAeroSetting'))
      );
  }

  getCart3DSetting(id: number): Observable<Cart3DSetting> {
    return this.http.get<Cart3DSetting>(this.apiUrl + 'cart3d-settings/' + id)
      .pipe(
        catchError(this.handleError<Cart3DSetting>('getCart3DSetting'))
      );
  }

  postCart3DSetting(newCart3DSetting: NewCart3DSetting): Observable<Cart3DSetting> {
    return this.http.post<Cart3DSetting>(this.apiUrl + 'cart3d-settings/', newCart3DSetting, this.httpOptions)
      .pipe(
        catchError(this.handleError<Cart3DSetting>('postCart3DSetting'))
      );
  }

  deleteConfiguredTool(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(this.apiUrl + 'configured-tools/' + id, this.httpOptions)
      .pipe(
        catchError(this.handleError<DeleteResponse>('deleteConfiguredTool'))
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
    return this.http.post<ToolGeometryAssociation[]>(this.apiUrl + 'tool-geometry-associations-bulk', associations, this.httpOptions)
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
      let msg = `${operation} failed: ${error.message}`;
      if (error.error != undefined && error.error.detail) {
        msg += ` - Details: ${error.error.detail}`
      }
      this.log(msg);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a message */
  private log(message: string) {
    this.messageService.add(`HyperdbService: ${message}`);
  }
}
