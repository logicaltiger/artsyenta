export class User {

  /*
    The id value is associated with the login.  It never changes, even for 
    when an admin user tries to help an organization.

    For the non-admin user he/she is always associated with one certain 
    organization.  These are of types "provider organization" and "service
    organization".  In the browser the (orgId, defaultOfferId, 
    isProviderOrg) combo never changes.  The user can update the orgName,
    so care must be taken to update the in-browser User as well as the
    server's Org record.  

    For the admin user (isAdminUser is true) he/she doesn't initially help 
    an organization, and the (orgId, orgName, defaultOfferId, isProviderOrg) 
    combo is initially unfilled.  Each time an organization is selected the 
    combo is refilled.

    The browser pages that can be displayed depend on (isAdminUser, 
    isProviderOrg).  For example, an admin user helping a provider org 
    can't see the service org pages.  The admin must first switch to helping
    some service org.

    To designate that an admin isn't helping any organization set (orgId = -1).
  */
  id: number;
  isAdminUser: boolean;
  orgId: number;
  orgName: string;
  defaultOfferId: number;
  isProviderOrg: boolean;
  name: string;

  constructor(d: any) {
    this.id = d.id;
    this.isAdminUser = d.isAdminUser;
    this.orgId = d.orgId;
    this.orgName = d.orgName;
    this.defaultOfferId = d.defaultOfferId;
    this.isProviderOrg = d.isProviderOrg;
    this.name = d.name;
  }

}
