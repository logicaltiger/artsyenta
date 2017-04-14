import { DebugElement, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { DialogService } from '../dialog.service';
import { GlobalsService } from '../global/globals.service';
import { Option } from '../global/option';

import { Org } from './org';
import { OrgDetailComponent } from './org-detail.component';
import { OrgService } from './org.service';

let saveWillSucceed: boolean = true;
let dialogConfirmValue = true;

@Injectable()
export class MockDialogService {
  constructor() { }

  public confirm(message? : string): boolean { return dialogConfirmValue; }
}

@Injectable()
export class MockGlobalsService {
  constructor() { }

  public getStateOptions(): Option[] {
    let options: Option[] = [
      new Option({ id: 'IN', name: 'Indiana', topic: Option.TOPIC_STATE }),
      new Option({ id: 'NJ', name: 'New Jersey', topic: Option.TOPIC_STATE }),
      new Option({ id: 'NY', name: 'New York', topic: Option.TOPIC_STATE })
    ];
    return options;
  }

}

@Injectable()
export class MockOrgService {
  constructor() { }

  public save(org: Org): Observable<Org> {
    let savedOrg: Org = new Org(org);
    savedOrg.address2 = 'Saved with id: ' + org.id;

    if(saveWillSucceed) {
      return Observable.of(savedOrg);
    }

    return Observable.throw('Error: Could not save');
  }

}

@Injectable()
export class MockActivatedRoute {
  constructor() { }

  data: Observable<Org> = null;
}

@Injectable()
export class MockRouter {
  constructor() { }

  navigate: any = () => {};
}

describe('OrgDetailComponent', () => {

  let comp: OrgDetailComponent;
  let fixture: ComponentFixture<OrgDetailComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  
  // Must set (isProviderOrg = true) so all Org fields display for testing.
  let org1: Org = new Org({
                    id: 1,
                    name: 'My Org Name',
                    address1: 'Address 1',
                    address2: 'Address 2',
                    city: 'City',
                    state: 'NJ',
                    zip: 'zip',
                    phone: 'phone',
                    email: 'email',
                    accessibility: 'accessibility',
                    notes: 'notes',
                    may_solicit: true,
                    inactive_date: new Date(),
                    isProviderOrg: true
                  });
  let orgNew = new Org(org1);
  orgNew.id = -1;

  let dialogService: DialogService = null;
  let globalsService: GlobalsService = null;
  let orgService: OrgService = null;
  let router: Router = null;
  let activatedRoute: ActivatedRoute = null;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule ],
      providers : [
        { provide: DialogService, useClass: MockDialogService },
        { provide: GlobalsService, useClass: MockGlobalsService },
        { provide: OrgService, useClass: MockOrgService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }          
      ],
      declarations: [ OrgDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDetailComponent);

  	dialogService = fixture.debugElement.injector.get(DialogService);
  	globalsService = fixture.debugElement.injector.get(GlobalsService);
  	orgService = fixture.debugElement.injector.get(OrgService);
    router = fixture.debugElement.injector.get(Router);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  afterEach(() => {
    saveWillSucceed = true;
    dialogConfirmValue = true;
  });

  /*
    Here and elsewhere:
    The template has nothing displayable until after fixture.detectChanges() runs.
    For example, filling the DebugElement would return null.    
    Filling DebugElement and HTMLElement must be done in each it() test.

    By experiment, when debugging the proper expression is:
    fixture.debugElement.query(platform_browser_1.By.css(searchString)).

    When testing for errors in whenStable() sections the entire test
    must be wrapped in an async().  
    See: http://stackoverflow.com/questions/42800213/angular2-karma-fail-requests-not-failing/42800448
  */

  it('should get states and an Org through ngOnInit()', async(() => { 
    activatedRoute.data = Observable.of( { org: org1 } );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;

      expect(comp.error).toBeNull();
      expect(comp.stateOptions.length).toEqual(globalsService.getStateOptions().length);
      expect(comp.org).toEqual(org1);
      expect(comp.savedOrg).toEqual(org1);
    });    
  }));

  it('should have the Org name in its title', async(() => { 
    activatedRoute.data = Observable.of( { org: org1 } );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;
      de = fixture.debugElement.query(By.css('h2'));
      el = de.nativeElement;

      expect(el.textContent).toEqual('Edit ' + comp.org.name + ' Details');
    });    
  }));

  it('should contain the Org data in its fields', async(() => { 
    activatedRoute.data = Observable.of( { org: org1 } );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;
      de = fixture.debugElement;

      expect(de.query(By.css('#name')).nativeElement.value).toEqual(comp.org.name);
      expect(de.query(By.css('#phone')).nativeElement.value).toEqual(comp.org.phone);
      expect(de.query(By.css('#email')).nativeElement.value).toEqual(comp.org.email);
      expect(de.query(By.css('#address1')).nativeElement.value).toEqual(comp.org.address1);
      expect(de.query(By.css('#address2')).nativeElement.value).toEqual(comp.org.address2);
      expect(de.query(By.css('#city')).nativeElement.value).toEqual(comp.org.city);
      expect(de.query(By.css('#state')).nativeElement.length).toEqual(comp.stateOptions.length);
      expect(de.query(By.css('#state')).nativeElement.value).toEqual(comp.org.state);
      expect(de.query(By.css('#zip')).nativeElement.value).toEqual(comp.org.zip);
      expect(de.query(By.css('#notes')).nativeElement.value).toEqual(comp.org.notes);
      expect(de.query(By.css('#may_solicit')).nativeElement.checked).toEqual(comp.org.may_solicit);
    });    
  }));

  it('responds to the Save click by saving the Org and refilling the component', async(() => {
    activatedRoute.data = Observable.of( { org: org1 } );
    let spy = spyOn(router, 'navigate');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;
      comp.org = new Org(org1);
      comp.org.id = 2;
      comp.org.name = 'Another Org';

      let elButton = fixture.debugElement.query(By.css('#save'));
      // Works the same as elButton.nativeElement.click();
      elButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(comp.error).toBeNull();
        expect(comp.savedOrg.id).toEqual(2);
        expect(comp.savedOrg.name).toEqual('Another Org');
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['../'], { relativeTo: activatedRoute });
      });
    });    

  }));

  it('responds to a failed Save click by showing an error message', async(() => {
    activatedRoute.data = Observable.of( { org: org1 } );
    let spy = spyOn(router, 'navigate');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      saveWillSucceed = false;
      comp = fixture.componentInstance;
      comp.org = new Org(org1);
      comp.org.id = 2;
      comp.org.name = 'Another Org';

      let elButton = fixture.debugElement.query(By.css('#save'));
      // Works the same as elButton.nativeElement.click();
      elButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(comp.error).toBeDefined();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });    

  }));

  /*
    Don't know how to incorporate a call to comp.canDeactivate(),
    so that is tested separately from a Cancel click.
  */
  it('responds to the Cancel click by exiting to the parent', async(() => {
    activatedRoute.data = Observable.of( { org: org1 } );
    let spy = spyOn(router, 'navigate');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;

      let elButton = fixture.debugElement.query(By.css('#cancel'));
      elButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(comp.error).toBeNull();
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['../'], { relativeTo: activatedRoute });
      });
    });    

  }));

  it('returns true from canDeactivate() for no Org change', async(() => {
    activatedRoute.data = Observable.of( { org: org1 } );
    let spy = spyOn(router, 'navigate');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;
      expect(comp.canDeactivate()).toBe(true);
    });    

  }));

  it('returns true/false from canDeactivate() for an Org change, depending on the dialog', async(() => {
    activatedRoute.data = Observable.of( { org: org1 } );
    let spy = spyOn(router, 'navigate');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;
      comp.org.address2 += '.';
      expect(comp.canDeactivate()).toBe(true);
      dialogConfirmValue = false;
      expect(comp.canDeactivate()).toBe(false);
      comp.org = null;
      expect(comp.canDeactivate()).toBe(true);
    });    

  }));

});
