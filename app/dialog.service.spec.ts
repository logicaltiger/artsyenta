import { DialogService } from './dialog.service';

describe('DialogService', () => {

  it('tests windows.dialog for yes response', () => {
    spyOn(window, "confirm").and.returnValue(true);
    let dialogService = new DialogService();
    dialogService.confirm("message").then(confirmed => expect(confirmed).toBe(true));
  });

  it('tests windows.dialog for no response', () => {
    spyOn(window, "confirm").and.returnValue(false);
    let dialogService = new DialogService();
    dialogService.confirm("message").then(confirmed => expect(confirmed).toBe(false));
  });

});
