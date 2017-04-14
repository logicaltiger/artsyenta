import { Headers, BaseRequestOptions, HttpModule, Http, 
          XHRBackend, Response, ResponseOptions } from '@angular/http';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

import { Credential } from './credential';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let mockBackend: MockBackend;
  let cred: Credential = new Credential("josh", "josh", 3);
  let badCred: Credential = new Credential("josh", "josh", -1);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [ MockBackend, BaseRequestOptions ],
          useFactory:
            (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
            }
        }
      ],
      imports: [
        HttpModule
      ]
    });
    mockBackend = getTestBed().get(MockBackend);
  }));

  afterEach(() => {
    mockBackend = null;
  });

  it('returns an id != -1 for successful login',
    async(inject([LoginService], (loginService: LoginService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: { data: [ cred ] }
            })
          ));
        }
      );

      loginService.login(cred)
        .subscribe(
          id => {
            expect(id).toBe(cred.id);
          },
          error => { fail('No error expected') }
        );
    })
  ));

  it('returns an id = -1 for unsuccessful login',
    async(inject([LoginService], (loginService: LoginService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: { data: [ badCred ] }
            })
          ));
        }
      );

      loginService.login(cred)
        .subscribe(
          id => {
            expect(id).toBe(-1);
          },
          error => { fail('No error expected') }
        );
    })
  ));

  it('sees an Error when the server cannot be contacted',
    async(inject([LoginService], (loginService: LoginService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error('Error from mock Http call for login') )
        }
      );

      loginService.login(cred)
        .subscribe(
          id => {
            fail('user ID fetch must not succeed because Error is thrown');
          },
          error => { expect(error).toBe('Error from mock Http call for login') }
        );
    })
  ));

});
