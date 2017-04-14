import { DebugElement, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthService } from '../auth.service';
import { AdminChooseOrgComponent } from './admin-choose-org.component';
import { Org } from '../org/org';
import { OrgService } from '../org/org.service';

let getWillSucceed: boolean = true;

let orgs: Org[] = [ 
  new Org( { id: 1, name: 'My Org 1 Name', isProviderOrg: true }), 
  new Org( { id: 2, name: 'My Org 2 Name', isProviderOrg: true })
];

@Injectable()
export class MockOrgService {
  constructor() { }

  public getOrgs(): Observable<Org[]> {

    if(getWillSucceed) {
      return Observable.of(orgs);
    }

    return Observable.throw('Error: Could not get Orgs');
  }

}

let helpedOrg: Org = null;

@Injectable()
export class MockAuthService {
  constructor() { }

  public setHelpedOrg(org: Org): void {
    helpedOrg = org;
  }

}

@Injectable()
export class MockRouter {
  constructor() { }

  navigate: any = () => {};
}

describe('AdminChooseOrgComponent', () => {
  let comp: AdminChooseOrgComponent;
  let fixture: ComponentFixture<AdminChooseOrgComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  
  let authService: AuthService = null;
  let orgService: OrgService = null;
  let router: Router = null;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule ],
      providers : [
        { provide: AuthService, useClass: MockAuthService },
        { provide: OrgService, useClass: MockOrgService },
        { provide: Router, useClass: MockRouter }
      ],
      declarations: [ AdminChooseOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChooseOrgComponent);

    authService = fixture.debugElement.injector.get(AuthService);
  	orgService = fixture.debugElement.injector.get(OrgService);
    router = fixture.debugElement.injector.get(Router);
  });

  afterEach(() => {
    getWillSucceed = true;
    helpedOrg = null;
  });

  it('should get an Org list through ngOnInit()', async(() => { 
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;
      de = fixture.debugElement;

      expect(comp.error).toBeNull();
      expect(de.query(By.css('#error')).nativeElement.textContent).toEqual('');
      expect(comp.orgs.length).toEqual(orgs.length);
    });    
  }));

  it('should have an error message for an Org fetch failure through ngOnInit()', async(() => { 
    getWillSucceed = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;
      de = fixture.debugElement;

      expect(comp.error).not.toBeNull();
      expect(de.query(By.css('#error')).nativeElement.textContent).not.toEqual('');
      expect(comp.orgs.length).toEqual(0);
    });    
  }));

  it('responds to an Org click by setting the helped Org and then routing', async(() => {
    let spy = spyOn(router, 'navigate');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;

      let elButton = fixture.debugElement.query(By.css('#choose1'));
      elButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(comp.error).toBeNull();
        expect(helpedOrg.id).toEqual(orgs[1].id);
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([AuthService.HOME_ADMIN]);
      });
    });    

  }));

  it('responds to a Cancel click by routing', async(() => {
    let spy = spyOn(router, 'navigate');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp = fixture.componentInstance;

      let elButton = fixture.debugElement.query(By.css('#cancel'));
      elButton.triggerEventHandler('click', null);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(comp.error).toBeNull();
        expect(helpedOrg).toBeNull();
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([AuthService.HOME_ADMIN]);
      });
    });    

  }));

});
