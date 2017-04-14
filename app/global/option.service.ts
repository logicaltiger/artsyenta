import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Option } from './option';

@Injectable()
export class OptionService {
  private optionsUrl = 'app/options';

  constructor(private http: Http) { }

  private extractData(response: Response): Option[] {
    return response.json().data.map((d: any) => new Option(d));
  }

  private handleError(error: Response | any): Observable<any> {
    let errorMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errorMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errorMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errorMsg);
  }

  getOptions(): Observable<Option[]> {
    return this.http
      .get(this.optionsUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
