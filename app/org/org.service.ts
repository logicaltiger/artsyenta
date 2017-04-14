import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Org } from './org';

@Injectable()
export class OrgService {
  public static ORG_IS_NULL: string = 'Returned Org is null';
  public static ORG_LIST_IS_NULL: string  = 'Returned Org list is null';
  private orgUrl: string = 'app/org';  // URL to web api

  constructor(private http: Http) { }

  /*
    Here and elsewhere: 
    When running the app against the in-memory-data service the save request works.  
    However, there is no return value (response.json() == null).  The attempt to get
    the data attribute throws an Error which is handled by handleError().  This is 
    acceptable behavior for the in-memory-data service.
  */
  private extractOrgs(response: Response): Org[] {
    let json = response.json();

    if(!json) {
      throw new Error(OrgService.ORG_LIST_IS_NULL);
    }

    let data = json.data

    if(!data) {
      throw new Error(OrgService.ORG_LIST_IS_NULL);
    }

    return data.map((d: any) => new Org(d));
  }

  private extractOrg(response: Response): Org {
    let json = response.json();

    if(!json) {
      throw new Error(OrgService.ORG_IS_NULL);
    }

    let data = json.data;

    if(!data) {
      throw new Error(OrgService.ORG_IS_NULL);
    }

    return new Org(data);
  }

  /*
    When a delete call completes it returns its success.
    The caller must decide if things worked OK.
  */
  private extractDeleteResponse(response: Response): {} {
    let d = response.json();
    return d || { };
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
    The server handles security.  
    * When a non-admin user asks for orgs the list is filtered.
      That user is sent an org only for its own user.  
    * When a non-admin user gets a list of orgs for reporting 
      some vital details of each org are removed from the results.
  */
  public getOrgs(): Observable<Org[]> {
    return this.http
      .get(this.orgUrl)
      .map(this.extractOrgs)
      .catch(this.handleError);
  }

  public getOrg(id: number): Observable<Org> {
    return this.http
      .get(`${this.orgUrl}/${id}`)
      .map(this.extractOrg)
      .catch(this.handleError);
  }

  /*
    Policy is to inactivate orgs, not delete them.
    Keeping this for later disposition. 
   
    Server must ensure that the ID is valid for this user.
  */
  private delete(org: Org): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .delete(`${this.orgUrl}/${org.id}`, options)
      .map(this.extractDeleteResponse)
      .catch(this.handleError);
  }

  public save(org: Org): Observable<Org> {
    return org.hasValidId() ? this.put(org) : this.post(org);
  }

  /*
    Creation of new orgs is reserved for the admin user.

    A successful post returns the entire object.  This ensures
    that, no matter what the server did, the browser has the
    entire server representation of the object.
  */
  private post(org: Org): Observable<Org> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(this.orgUrl, JSON.stringify(org), options)
      .map(this.extractOrg)
      .catch(this.handleError);
  }

  /*
    When updating the server must ensure that the 
    ID is valid for this user.

    A successful put returns the entire object.  This ensures
    that, no matter what the server did, the browser has the
    entire server representation of the object.
  */
  private put(org: Org): Observable<Org> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .put(`${this.orgUrl}/${org.id}`, JSON.stringify(org), options)
      .map(this.extractOrg)
      .catch(this.handleError);
  }

}
