import { Injectable } from '@angular/core';
import { fakeAsync, async, inject, TestBed, tick } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthService } from './auth.service';
import { Credential } from './login/credential';
import { LoginService } from './login/login.service';

import { Org } from './org/org';

import { User } from './user/user';
import { UserService } from './user/user.service';

let msgCallback: string = null;
let msgFailedLoginService: string = 'Error: Could not service a login';
let msgFailedUserService: string = 'Error: Could not fetch a user';

let loginFetchWillSucceed: boolean = true;
let userFetchWillSucceed: boolean = true;
let userFetchReturnsNull: boolean = false;

let jsonUser3 = { id: 3, orgId: 12, orgName: 'Great Actors Theater', defaultOfferId: 3, name: 'Josh', isAdminUser: true, isProviderOrg: true };
let jsonUser5 = { id: 5, orgId: 19, orgName: 'Sunnyside Group Home', defaultOfferId: -1, name: 'Sam', isAdminUser: false, isProviderOrg: false };
let org222 = new Org( { id: 222, name: 'My Org 222 Name', isProviderOrg: true, defaultOfferId: 222 });

function mockLoginCallback(msg: string): void {
  msgCallback = msg;
}

@Injectable()
export class MockLoginService {
  constructor() { }

  public login(cred: Credential): Observable<number> {

    /*
      To simulate bad user credentials pass in (cred.id = -1).
    */
    if(loginFetchWillSucceed) {
      return Observable.of(cred.id);
    }

    return Observable.throw(msgFailedLoginService);
  }

}

@Injectable()
export class MockUserService {
  constructor() { }

  public getUser(id: number): Observable<User> {
    let jsonUser: any = null;

    if(id == jsonUser3.id) {
      jsonUser = jsonUser3;
    } else if(id == jsonUser5.id) {
      jsonUser = jsonUser5;
    } else {
      userFetchWillSucceed = false;
    }

    if(userFetchWillSucceed) {
      let user: User = new User(jsonUser);
      user.id = id;
      return Observable.of(userFetchReturnsNull ? null : user);
    }

    return Observable.throw(msgFailedUserService);
  }

}

describe('AuthService', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      providers : [
        AuthService,
        { provide: LoginService, useClass: MockLoginService },
        { provide: UserService, useClass: MockUserService }
      ]
    });
  }));

  afterEach(() => {
    msgCallback = null;
    loginFetchWillSucceed = true;
    userFetchWillSucceed = true;
    userFetchReturnsNull = false;
  });

  it('has no User object prior to logging in', 
    async(inject([AuthService], (authService: AuthService) => {
      expect(authService.isLoggedIn()).toBeFalsy();
      expect(authService.getUserName()).toEqual("");
    }))
  );

  it('fails login for loginService failure',
    fakeAsync(inject([AuthService], (authService: AuthService) => {
      let cred: Credential = new Credential(jsonUser3.name, jsonUser3.name, jsonUser3.id);
      loginFetchWillSucceed = false;
      authService.setLoginCallback(mockLoginCallback);
      authService.login(cred);
      tick();
      expect(msgCallback).toEqual(msgFailedLoginService);
      expect(authService.isLoggedIn()).toBeFalsy();
      expect(authService.getUserName()).toEqual("");
    }))
  );

  it('fails login for bad user credentials',
    fakeAsync(inject([AuthService], (authService: AuthService) => {
      let cred: Credential = new Credential(jsonUser3.name, jsonUser3.name, -1);
      authService.setLoginCallback(mockLoginCallback);
      authService.login(cred);
      tick();
      expect(msgCallback).toContain('Invalid Name');
      expect(authService.isLoggedIn()).toBeFalsy();
      expect(authService.getUserName()).toEqual("");
    }))
  );

  it('fails login for userService failure',
    fakeAsync(inject([AuthService], (authService: AuthService) => {
      let cred: Credential = new Credential(jsonUser3.name, jsonUser3.name, jsonUser3.id);
      userFetchWillSucceed = false;
      authService.setLoginCallback(mockLoginCallback);
      authService.login(cred);
      tick();
      expect(msgCallback).toEqual(msgFailedUserService);
      expect(authService.isLoggedIn()).toBeFalsy();
      expect(authService.getUserName()).toEqual("");
    }))
  );

  it('fails login for userService returning null User',
    fakeAsync(inject([AuthService], (authService: AuthService) => {
      let cred: Credential = new Credential(jsonUser3.name, jsonUser3.name, jsonUser3.id);
      userFetchReturnsNull = true;
      authService.setLoginCallback(mockLoginCallback);
      authService.login(cred);
      tick();
      expect(msgCallback).toContain('Login Error');
      expect(authService.isLoggedIn()).toBeFalsy();
      expect(authService.getUserName()).toEqual("");
    }))
  );

  it('successfully logs in for a valid ID, admin, provider',
    fakeAsync(inject([AuthService], (authService: AuthService) => {
      let cred: Credential = new Credential(jsonUser3.name, jsonUser3.name, jsonUser3.id);
      authService.setLoginCallback(mockLoginCallback);
      authService.login(cred);
      tick();
      expect(msgCallback).toEqual("");
      expect(authService.isLoggedIn()).toBeTruthy();
      expect(authService.getUserName()).toEqual(jsonUser3.name, 'userName');
      expect(authService.getUserOrgId()).toEqual(jsonUser3.orgId, 'userOrgId');
      expect(authService.getUserOrgName()).toEqual(jsonUser3.orgName, 'userOrgName');
      expect(authService.hasAdminRole()).toEqual(jsonUser3.isAdminUser, 'hasAdminRole');
      expect(authService.hasProviderRole()).toEqual(jsonUser3.isProviderOrg, 'hasProviderRole');
      expect(authService.hasServiceRole()).not.toEqual(jsonUser3.isProviderOrg, 'hasServiceRole');
    }))
  );

  it('successfully logs in for a valid ID, not admin, service',
    fakeAsync(inject([AuthService], (authService: AuthService) => {
      let cred: Credential = new Credential(jsonUser5.name, jsonUser5.name, jsonUser5.id);
      authService.setLoginCallback(mockLoginCallback);
      authService.login(cred);
      tick();
      expect(msgCallback).toEqual("");
      expect(authService.isLoggedIn()).toBeTruthy();
      expect(authService.getUserName()).toEqual(jsonUser5.name, 'userName');
      expect(authService.getUserOrgId()).toEqual(jsonUser5.orgId, 'userOrgId');
      expect(authService.getUserOrgName()).toEqual(jsonUser5.orgName, 'userOrgName');
      expect(authService.hasAdminRole()).toEqual(jsonUser5.isAdminUser, 'hasAdminRole');
      expect(authService.hasProviderRole()).toEqual(jsonUser5.isProviderOrg, 'hasProviderRole');
      expect(authService.hasServiceRole()).not.toEqual(jsonUser5.isProviderOrg, 'hasServiceRole');
    }))
  );

  it('successfully logs in then logs out',
    fakeAsync(inject([AuthService], (authService: AuthService) => {
      let cred: Credential = new Credential(jsonUser5.name, jsonUser5.name, jsonUser5.id);
      authService.setLoginCallback(mockLoginCallback);
      authService.login(cred);
      tick();
      expect(msgCallback).toEqual("");
      expect(authService.isLoggedIn()).toBeTruthy();
      authService.logout();
      expect(authService.isLoggedIn()).toBeFalsy();
    }))
  );

  it('sets the redirectUrl correctly',
    fakeAsync(inject([AuthService], (authService: AuthService) => {
      let cred: Credential = new Credential(jsonUser3.name, jsonUser3.name, jsonUser3.id);
      authService.setLoginCallback(mockLoginCallback);
      authService.login(cred);
      tick();

      expect(msgCallback).toEqual("");
      expect(authService.hasAdminRole()).toBeTruthy();
      expect(authService.getRedirectUrl()).toBeNull();
      expect(authService.getEffectiveRedirectUrl()).toEqual(AuthService.HOME_ADMIN);

      authService.setRedirectUrl('happy');
      expect(authService.getRedirectUrl()).toEqual('happy');
      expect(authService.getEffectiveRedirectUrl()).toEqual('happy');
    }))
  );

  it('sets the helped Org when an admin user',
    fakeAsync(inject([AuthService], (authService: AuthService) => {
      let cred: Credential = new Credential(jsonUser3.name, jsonUser3.name, jsonUser3.id);
      authService.setLoginCallback(mockLoginCallback);
      authService.login(cred);
      tick();
      expect(msgCallback).toEqual("");
      expect(authService.isLoggedIn()).toBeTruthy();
      expect(authService.hasAdminRole()).toEqual(jsonUser3.isAdminUser, 'hasAdminRole');
      authService.setHelpedOrg(org222);
      tick();
      expect(authService.getUserOrgId()).toEqual(org222.id, 'user org ID');
      expect(authService.getUserOrgName()).toEqual(org222.name, 'user org name');
      expect(authService.hasProviderRole()).toEqual(org222.isProviderOrg, 'is provider org');
      expect(authService.getDefaultOfferId()).toEqual(org222.defaultOfferId, 'default offer ID');
    }))
  );

});
