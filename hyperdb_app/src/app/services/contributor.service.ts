import { Injectable } from '@angular/core';
import { Contributor } from '../interfaces/contributor';


@Injectable({
  providedIn: 'root'
})
export class ContributorService {
  
  contributor: Contributor | null;

  constructor() { }

}
