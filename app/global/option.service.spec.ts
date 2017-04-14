import { Headers, BaseRequestOptions, HttpModule, Http, 
          XHRBackend, Response, ResponseOptions } from '@angular/http';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

import { Option } from './option';
import { OptionService } from './option.service';

describe('OptionService', () => {
  let mockBackend: MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        OptionService,
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

  it('gets Option objects',
    async(inject([OptionService], (optionService: OptionService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: { data: [
                  { id: 'NJ', name: 'New Jersey', topic: Option.TOPIC_STATE }
                ] }
            })
          ));
        }
      );

      optionService.getOptions()
        .subscribe(
          options => {
            expect(options).toBeDefined();
            expect(options.length).toBe(1);
            expect(options[0].id).toBe('NJ');
            expect(options[0].name).toBe('New Jersey');
            expect(options[0].topic).toBe(Option.TOPIC_STATE);
          },
          error => { fail('No error expected') }
        );
    })
  ));

  it('sees an Error when the server cannot be contacted',
    async(inject([OptionService], (optionService: OptionService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error("Error from mock Http call for getOptions") )
        }
      );

      optionService.getOptions()
        .subscribe(
          options => {
            fail('getOptions() must not succeed because Error is thrown');
          },
          error => { expect(error).toBe('Error from mock Http call for getOptions') }
        );
    })
  ));

});
