import { Org } from './org';

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

describe('Org', () => {
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
  let jsonBlank: any = {
                    id: -1,
                    name: null,
                    address1: null,
                    address2: null,
                    city: null,
                    state: null,
                    zip: null,
                    phone: null,
                    email: null,
                    accessibility: null,
                    notes: null,
                    may_solicit: true,
                    inactive_date: null,
                    isProviderOrg: false
    };

  it('function equals() must be equal for filled Org', () => {
    let origOrg = new Org(jsonBase);
    origOrg.id = 1;
    let copyOrg = new Org(jsonBase);
    copyOrg.id = 2;

    expect(origOrg.equals(copyOrg)).toBe(true);
  });

  it('function equals() must be equal for null Org', () => {
    let origOrg = new Org(jsonBlank);
    origOrg.id = 3;
    let copyOrg = new Org(jsonBlank);
    copyOrg.id = 4;

    expect(origOrg.equals(copyOrg)).toBe(true);
  });

  it('function hasValidId() must true for (id > -1), false for (id <= -1)', () => {
    let invalidIdOrg = new Org(jsonBase);
    invalidIdOrg.id = -1;
    let validIdOrg = new Org(jsonBase);
    validIdOrg.id = 0;

    expect(invalidIdOrg.hasValidId()).toBe(false);
    expect(validIdOrg.hasValidId()).toBe(true);
  });

});
