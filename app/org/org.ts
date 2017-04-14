export class Org {
  id: number = -1;  // -1 is an invalid ID, can double as "not yet saved".
  name: string = "";
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  accessibility: string;
  notes: string;
  may_solicit: boolean;
  inactive_date: Date;
  isProviderOrg: boolean;
  defaultOfferId: number = -1;

  constructor(d: any) {
    this.id = d.id;
    this.name = d.name;
    this.address1 = d.address1;
    this.address2 = d.address2;
    this.city = d.city;
    this.state = d.state;
    this.zip = d.zip;
    this.phone = d.phone;
    this.email = d.email;
    this.accessibility = d.accessibility;
    this.notes = d.notes;
    this.may_solicit = d.may_solicit;
    this.inactive_date = d.inactive_date;
    this.isProviderOrg = d.isProviderOrg;
    this.defaultOfferId = d.defaultOfferId;
  }

  /*
    Only compares the common editable fields.
    For example, org1 can equal org2 even though
    their ID values differ.
  */
  public equals(other: Org): boolean {
    return other.name == this.name
      && other.phone == this.phone
      && other.email == this.email
      && other.address1 == this.address1
      && other.address2 == this.address2
      && other.city == this.city
      && other.state == this.state
      && other.zip == this.zip
      && other.notes == this.notes
      && other.may_solicit == this.may_solicit;
  }

  public hasValidId(): boolean { return this.validateId(this.id); }

  private validateId(id: any): boolean { return id !== null && !isNaN(id + 0) && id > -1; }

}
