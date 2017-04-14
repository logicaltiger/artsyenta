import { Headers, BaseRequestOptions, HttpModule, Http, 
          XHRBackend, Response, ResponseOptions } from '@angular/http';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

import { Org } from './org';
import { OrgService } from './org.service';

/*
  Apply a suffix to the text fields of the passed-in JSON.
  The "id" is not set in the returned object.

  source: A JSON object that can be passed into an Org constructor.
  suffix: What to append to each string attribute of "source".

  Returns a new object modified by "suffix".
*/
function applySuffix(source: Object, suffix: string): Object {
  let target = JSON.parse(JSON.stringify(source));
  let s = " " + suffix;
  target.name += s;
  target.address1 += s; 
  target.address2 += s;
  target.city += s;
  target.state += s;
  target.zip += s;
  target.phone += s;
  target.email += s;
  target.accessibility += s;
  target.notes += s;

  return target;
}

function expectOrg(testOrg: Org, referenceData: any): void {
  expect(testOrg.id).toBe(referenceData.id);
  expect(testOrg.name).toBe(referenceData.name);
  expect(testOrg.address1).toBe(referenceData.address1);
  expect(testOrg.address2).toBe(referenceData.address2);
  expect(testOrg.city).toBe(referenceData.city);
  expect(testOrg.state).toBe(referenceData.state);
  expect(testOrg.zip).toBe(referenceData.zip);
  expect(testOrg.phone).toBe(referenceData.phone);
  expect(testOrg.email).toBe(referenceData.email);
  expect(testOrg.accessibility).toBe(referenceData.accessibility);
  expect(testOrg.notes).toBe(referenceData.notes);
  expect(testOrg.may_solicit).toBe(referenceData.may_solicit);
  expect(testOrg.inactive_date).toBe(referenceData.inactive_date);
  expect(testOrg.isProviderOrg).toBe(referenceData.isProviderOrg);
}

describe('OrgService', () => {
  let mockBackend: MockBackend;
  let jsonBase: any = {
                    id: -1,
                    name: 'Org Name',
                    address1: 'Address 1',
                    address2: 'Address 2',
                    city: 'City',
                    state: 'ST',
                    zip: 'zip',
                    phone: 'phone',
                    email: 'email',
                    accessibility: 'accessibility',
                    notes: 'notes',
                    may_solicit: true,
                    inactive_date: new Date(),
                    isProviderOrg: false
                  };
  let jsonOrg1: any = applySuffix(jsonBase, "1");
  jsonOrg1.id = 1;
  let jsonOrg2: any = applySuffix(jsonBase, "1");
  jsonOrg2.id = 2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        OrgService,
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

  it('gets many Org objects',
    async(inject([OrgService], (orgService: OrgService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: { data: [ jsonOrg1, jsonOrg2 ] }
            })
          ));
        }
      );

      orgService.getOrgs()
        .subscribe(
          orgs => {
            expect(orgs).toBeDefined();
            expect(orgs.length).toBe(2);
            expectOrg(orgs[1], jsonOrg2);
          },
          error => { fail('No error expected') }
        );
    })
  ));

  it('sees an Error, instead of fetching many Orgs, when the server cannot be contacted',
    async(inject([OrgService], (orgService: OrgService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error('Error from mock Http call for getOrgs') )
        }
      );

      orgService.getOrgs()
        .subscribe(
          orgs => {
            fail('getOrgs() must not succeed because Error is thrown');
          },
          error => { expect(error).toBe('Error from mock Http call for getOrgs') }
        );
    })
  ));

  it('gets the single Org object',
    async(inject([OrgService], (orgService: OrgService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: { data: jsonOrg1 }
            })
          ));
        }
      );

      orgService.getOrg(jsonOrg1.id)
        .subscribe(
          org => {
            expect(org).toBeDefined();
            expectOrg(org, jsonOrg1);
          },
          error => { fail('No error expected') }
        );
    })
  ));

  it('sees an Error, instead of fetching an Org, when the server cannot be contacted',
    async(inject([OrgService], (orgService: OrgService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error('Error from mock Http call for getOrg') )
        }
      );

      orgService.getOrg(jsonOrg1.id)
        .subscribe(
          org => {
            fail('getOrg() must not succeed because Error is thrown');
          },
          error => { expect(error).toBe('Error from mock Http call for getOrg') }
        );
    })
  ));

  it('saves the provided existing Org object',
    async(inject([OrgService], (orgService: OrgService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: { data: jsonOrg1 }
            })
          ));
        }
      );

      let saveThisOrg = new Org(jsonOrg1);

      orgService.save(saveThisOrg)
        .subscribe(
          org => {
            expect(org).toBeDefined();
            expectOrg(org, jsonOrg1);
          },
          error => { fail('No error expected') }
        );
    })
  ));

  it('sees an Error, instead of saving an existing Org object, when the server cannot be contacted',
    async(inject([OrgService], (orgService: OrgService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error('Error from mock Http call for save (existing record)') )
        }
      );

      let saveThisOrg = new Org(jsonOrg1);

      orgService.save(saveThisOrg)
        .subscribe(
          org => {
            fail('save() must not succeed because Error is thrown');
          },
          error => { expect(error).toBe('Error from mock Http call for save (existing record)') }
        );
    })
  ));

  it('saves the provided new Org object',
    async(inject([OrgService], (orgService: OrgService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: { data: jsonOrg1 }
            })
          ));
        }
      );

      let saveThisOrg = new Org(jsonOrg1);
      saveThisOrg.id = -1;

      orgService.save(saveThisOrg)
        .subscribe(
          org => {
            expect(org).toBeDefined();
            expectOrg(org, jsonOrg1);
          },
          error => { fail('No error expected') }
        );
    })
  ));

  it('sees an Error, instead of saving a new Org object, when the server cannot be contacted',
    async(inject([OrgService], (orgService: OrgService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error('Error from mock Http call for save (new record)') )
        }
      );

      let saveThisOrg = new Org(jsonOrg1);
      saveThisOrg.id = -1;

      orgService.save(saveThisOrg)
        .subscribe(
          org => {
            fail('save() must not succeed because Error is thrown');
          },
          error => { expect(error).toBe('Error from mock Http call for save (new record)') }
        );
    })
  ));

});
