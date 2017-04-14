import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { User } from './user';

@Injectable()
export class UserService {
  private userUrl = 'app/user';  // URL to web api for multiple users

  constructor(private http: Http) { }

  private extractUsers(response: Response): User[] {
    return response.json().data.map((d: any) => new User(d));
  }

  private extractUser(response: Response): User {
    let d = response.json().data;
    return (d == null ? null : new User(d));
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
     The server restricts a non-admin user to just the users he/she is authorized to see.
  */
  public getUsers(): Observable<User[]> {
    return this.http
      .get(this.userUrl)
      .map(this.extractUsers)
      .catch(this.handleError);
  }

  public getUser(id: number): Observable<User> {
    return this.http
      .get(this.userUrl + '/' + id)
      .map(this.extractUser)
      .catch(this.handleError);
  }

}
