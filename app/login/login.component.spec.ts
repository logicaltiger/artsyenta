import { DebugElement, Injectable } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthService } from '../auth.service';

import { Credential } from './credential';
import { LoginComponent } from './login.component';

import { User } from '../user/user';

let userFetchWillSucceed: boolean = true;
let defaultRedirectUrl = "defaultRedirectUrl";
let msgFailedLogin = "Failed Login";

let jsonUser3 = { id: 3, orgId: 12, orgName: 'Great Actors Theater', defaultOfferId: 3, name: 'Josh', isAdminUser: true, isProviderOrg: true };
let jsonUser5 = { id: 5, orgId: 19, orgName: 'Sunnyside Group Home', defaultOfferId: -1, name: 'Sam', isAdminUser: false, isProviderOrg: false };

@Injectable()
export class MockAuthService {
  constructor() { }

  user: User = null;
  loginCallback: Function = this.defaultCallback;

  public login(cred: Credential) {
    let jsonUser: any = null;

    if(cred.name == jsonUser3.name) {
      jsonUser = jsonUser3;
    } else if(cred.name == jsonUser5.name) {
      jsonUser = jsonUser5;
    } else {
      userFetchWillSucceed = false;
    }

    if(userFetchWillSucceed) {
      this.user = new User(jsonUser);
      this.loginCallback("");
    } else {
      this.loginCallback(msgFailedLogin);
    }

  }

  public logout() { this.user = null; }

  public setLoginCallback(callback: Function) { this.loginCallback = callback; }

  public getEffectiveRedirectUrl(): string { return defaultRedirectUrl; }

  public isLoggedIn(): boolean { return this.user !== null; }

  public getUserName(): string { return this.isLoggedIn() ? this.user.name : ""; }

  private defaultCallback(message: string): void {
    console.info("From mock auth.service defaultCallback: " + message);
  }

}

@Injectable()
export class MockActivatedRoute {
  constructor() { }

  data: any = null; //Observable<Org> = null;
}

@Injectable()
export class MockRouter {
  constructor() { }

  navigate: any = () => {};
}

describe('LoginComponent', () => {
  let comp: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  
  let authService: AuthService = null;
  let router: Router = null;
  let activatedRoute: ActivatedRoute = null;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule ],
      providers : [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }          
      ],
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);

  	authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  afterEach(() => {
    userFetchWillSucceed = true;
    comp.name = '';
    comp.password = '';
  });

  it('fails to login for both credential fields blank', fakeAsync(() => {
      comp = fixture.componentInstance;
      de = fixture.debugElement;
      fixture.detectChanges();
      let elLoginButton = de.query(By.css('#login'));

      // Test when both fields are missing.
      comp.name = '';
      comp.password = '';
      elLoginButton.triggerEventHandler('click', null);
      tick();

      // No field change, error message.
      expect(comp.name).toEqual('', 'name of (blank, blank) test');
      expect(comp.password).toEqual('', 'password of (blank, blank) test');
      expect(comp.message).not.toEqual('');

      // User not filled.
      expect(authService.isLoggedIn()).toBeFalsy('isLoggedIn');

      // Test when name is missing.
      comp.name = '';
      comp.password = jsonUser3.name;
      elLoginButton.triggerEventHandler('click', null);
      tick();

      // No field change, error message.
      expect(comp.name).toEqual('', 'name of (blank, filled) test');
      expect(comp.password).toEqual(jsonUser3.name, 'password of (blank, filled) test');
      expect(comp.message).not.toEqual('');

      // User not filled.
      expect(authService.isLoggedIn()).toBeFalsy('isLoggedIn');

      // Test when password is missing.
      comp.name = jsonUser3.name;
      comp.password = '';
      elLoginButton.triggerEventHandler('click', null);
      tick();

      // No field change, error message.
      expect(comp.name).toEqual(jsonUser3.name, 'name of (filled, blank) test');
      expect(comp.password).toEqual('', 'password of (filled, blank) test');
      expect(comp.message).not.toEqual('');

      // User not filled.
      expect(authService.isLoggedIn()).toBeFalsy('isLoggedIn');
  }));

  it('fails to login for an authService issue', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;
      de = fixture.debugElement;

      // Password doesn't matter, the remote validation isn't being tested.
      comp.name = jsonUser3.name;
      comp.password = jsonUser3.name;

      userFetchWillSucceed = false;
      let elLoginButton = de.query(By.css('#login'));
      elLoginButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      fixture.whenStable().then(() => {

        // No field change, error message.
        expect(comp.name).toEqual(jsonUser3.name);
        expect(comp.password).toEqual(jsonUser3.name);
        expect(comp.message).not.toEqual('');

        // User not filled.
        expect(authService.isLoggedIn()).toBeFalsy('isLoggedIn');
      });
    });    

  }));

  it('succeeds in logging in', async(() => {
    let spy = spyOn(router, 'navigate');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;
      de = fixture.debugElement;

      // Password doesn't matter, the remote validation isn't being tested.
      comp.name = jsonUser3.name;
      comp.password = jsonUser3.name;

      let elLoginButton = de.query(By.css('#login'));
      elLoginButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      fixture.whenStable().then(() => {

        // Blanked fields, default message.  
        expect(comp.name).toEqual('');
        expect(comp.password).toEqual('');
        expect(comp.message).toMatch(/Please login*/);

        // User properly filled.  
        expect(authService.isLoggedIn()).toBeTruthy('isLoggedIn');
        expect(authService.getEffectiveRedirectUrl()).toEqual(defaultRedirectUrl, 'redirectUrl');

        // Route to "default route".
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([defaultRedirectUrl], { preserveQueryParams: true, preserveFragment: true });
      });
    });    

  }));

  it('succeeds in logging out', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {

      /*
        Without the real component manager turning buttons on and off
        the logout button is still unrendered.  Instead of clicking on
        it just call the component logout() function.
      */
      comp = fixture.componentInstance;
      comp.logout();
      fixture.detectChanges();
      fixture.whenStable().then(() => {

        // Blanked fields, default message.  
        expect(comp.name).toEqual('');
        expect(comp.password).toEqual('');
        expect(authService.isLoggedIn()).toBeFalsy('isLoggedIn');
      });
    });    

  }));

});
