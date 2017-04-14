import { Headers, BaseRequestOptions, RequestMethod, 
          HttpModule, Http, XHRBackend, 
          Response, ResponseOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { TestBed, getTestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Option } from './option';
import { OptionService } from './option.service';
import { GlobalsService } from './globals.service';

@Injectable()
export class MockOptionService {
  constructor() { }

  getOptions(): Observable<Option[]> {
    let options: Option[] = [
      { id: 'IN', name: 'Indiana', topic: Option.TOPIC_STATE },
      { id: 'NJ', name: 'New Jersey', topic: Option.TOPIC_STATE },
      { id: 'CONCERT', name: "Concert", topic: Option.TOPIC_EVENT_TYPE },
      { id: 'NY', name: 'New York', topic: Option.TOPIC_STATE }
    ];
    return Observable.of(options);
  }

}

@Injectable()
export class MockErrorOptionService {
  constructor() { }

  getOptions(): Observable<Option[]> {
    return Observable.throw("Error thrown from mock OptionService.getOptions");
  }

}

describe('GlobalsService with successful OptionService fetch', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        { provide: OptionService, useClass: MockOptionService },
        { provide: GlobalsService, useClass: GlobalsService }
      ]
    });

  });

  it('gets state and eventType options',
    fakeAsync(inject([GlobalsService, OptionService], (globalsService: GlobalsService,  optionService: OptionService) => {
      globalsService.getGlobals();
      tick();
      expect(globalsService.error).toBeNull();
      expect(globalsService.getStateOptions().length).toBe(3);
      expect(globalsService.getEventTypeOptions().length).toBe(1);
    })));

});

describe('GlobalsService with failed OptionService fetch', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        { provide: OptionService, useClass: MockErrorOptionService },
        { provide: GlobalsService, useClass: GlobalsService }
      ]
    });

  });

  it('sees a filled GlobalsService.error when the OptionService request fails',
    fakeAsync(inject([GlobalsService, OptionService], (globalsService: GlobalsService,  optionService: OptionService) => {
      globalsService.getGlobals();
      tick();
      expect(globalsService.error).toBeDefined();
    })));

});
