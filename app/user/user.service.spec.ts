import { Headers, BaseRequestOptions, HttpModule, Http, 
          XHRBackend, Response, ResponseOptions } from '@angular/http';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

import { User } from './user';
import { UserService } from './user.service';

function expectUser(testUser: User, referenceData: any): void {
  expect(testUser.id).toBe(referenceData.id);
  expect(testUser.orgId).toBe(referenceData.orgId);
  expect(testUser.orgName).toBe(referenceData.orgName);
  expect(testUser.defaultOfferId).toBe(referenceData.defaultOfferId);
  expect(testUser.name).toBe(referenceData.name);
  expect(testUser.isAdminUser).toBe(referenceData.isAdminUser);
  expect(testUser.isProviderOrg).toBe(referenceData.isProviderOrg);
}

describe('UserService', () => {
  let mockBackend: MockBackend;
  let jsonUser = { id: 3, orgId: 12, orgName: 'Great Actors Theater', defaultOfferId: 3, name: 'Josh', isAdminUser: true, isProviderOrg: true };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
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

  it('gets many User objects',
    async(inject([UserService], (userService: UserService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: { data: [ jsonUser ] }
            })
          ));
        }
      );

      userService.getUsers()
        .subscribe(
          users => {
            expect(users).toBeDefined();
            expect(users.length).toBe(1);
            expectUser(users[0], jsonUser);
          },
          error => { fail('No error expected') }
        );
    })
  ));

  it('sees an Error, instead of fetching many users, when the server cannot be contacted',
    async(inject([UserService], (userService: UserService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error("Error from mock Http call for getUsers") )
        }
      );

      userService.getUsers()
        .subscribe(
          users => {
            fail('fetching many users must not succeed because Error is thrown');
          },
          error => { expect(error).toBe('Error from mock Http call for getUsers') }
        );
    })
  ));

  it('getUser() should get a User object async',
    async(inject([UserService], (userService: UserService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: { data: jsonUser }
            })
          ));
        }
      );

      userService.getUser(jsonUser.id)
        .subscribe(
          user => {
            expect(user).toBeDefined();
            expectUser(user, jsonUser);
          },
          error => { fail('No error expected') }
        );
    })
  ));

  it('sees an Error, instead of fetching one user, when the server cannot be contacted',
    async(inject([UserService], (userService: UserService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error("Error from mock Http call for getUser") )
        }
      );

      userService.getUser(jsonUser.id)
        .subscribe(
          user => {
            fail('user fetch must not succeed because Error is thrown');
          },
          error => { expect(error).toBe('Error from mock Http call for getUser') }
        );
    })
  ));

});
