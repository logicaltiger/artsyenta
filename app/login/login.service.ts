import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Credential } from './credential';

@Injectable()
export class LoginService {
  private loginUrl = 'app/credential';

  constructor(private http: Http) { }

  /*
    The browser-only temporary login service (InMemoryWebApiModule)
    returns the entire Credential object in an array.
    It succeeds only if a single-element array has an "id" attribute that has a > -1 value.
  */
  private extractId(response: Response): number {
    let d = response.json().data;
    return (d && d.length == 1 && d[0].id && d[0].id >= 0) ? d[0].id : -1;
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

  /*
    A real login would pass both the login name and password
    in a secure manner, perhaps using third party authentication.
    Expect that the server returns (id < 0) for failure and otherwise success.
  */
  public login(cred: Credential): Observable<number> {
    return this.http
      .get(`${this.loginUrl}/?name=${cred.name}`)
      .map(this.extractId)
      .catch(this.handleError);
  }

}
