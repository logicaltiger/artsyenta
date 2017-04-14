import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { CanDeactivateGuard } from './can-deactivate-guard.service';

/*
  Here and elsewhere:
  This project DELIBERATELY uses a variety of test architectures.
  They serve as a "copy coding" source and an experiment in which
  architecture might be better.
*/
@Injectable()
export class MockComponent {
  constructor() { }

  public canDeactivate() : boolean { return true; }
}

describe('CanDeactivateGuard', () => {
  let guardService: CanDeactivateGuard = null;

  beforeEach(() => {
    guardService = new CanDeactivateGuard();
  });

  it('returns true because component is null', () => {

    let cande: any = guardService.canDeactivate(null);

    if(cande instanceof Observable) {
      fail('must not be Observable because component does not exist');
    } else if(cande instanceof Promise) {
      fail('must not be Promise because component does not exist');
    } else {
      expect(cande).toBeTruthy();
    }

  });

  it('returns true because canDeactivate() does not exist', () => {
    let mock = new MockComponent();
    mock.canDeactivate = null;
    let cande: any = guardService.canDeactivate(mock);

    if(cande instanceof Observable) {
      fail('must not be Observable because canDeactivate() does not exist');
    } else if(cande instanceof Promise) {
      fail('must not be Promise because canDeactivate() does not exist');
    } else {
      expect(cande).toBeTruthy();
    }

  });

  it('returns the value of canDeactivate()', () => {

    let cande: any = guardService.canDeactivate(new MockComponent());

    if(cande instanceof Observable) {
      cande.subscribe((answer: boolean): void => { expect(answer).toBeTruthy(); });
    } else if(cande instanceof Promise) {
      cande.then((answer: boolean): void => { expect(answer).toBeTruthy(); });
    } else {
      expect(cande).toBeTruthy();
    }

  });

});
