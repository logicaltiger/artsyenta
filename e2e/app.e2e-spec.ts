import { browser, element, by } from 'protractor';

describe('Arts Yenta E2E Tests', function () {

  let expectedMsg = 'Hello Angular';

  beforeEach(function () {
    browser.get('');
  });

  it('should display: ' + expectedMsg, function () {
    expect<any>(element(by.css('h1')).getText()).toEqual(expectedMsg);
  });

});
