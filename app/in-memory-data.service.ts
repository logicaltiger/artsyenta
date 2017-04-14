import { Option } from './global/option';
import { Org } from "./org/org";

export class InMemoryDataService {
  
  createDb() {
    let org = [
      { id: 12, name: 'Great Actors Theater', address1: '123 St Charles Rd', address2: 'Apt 123', city: 'Villa Park', state: 'IL', zip: '60181', phone: '6303831414', email: 'john@gatheater.com', accessibility: 'Depends on where we play.', notes: 'We bring Shakespeare to you!', may_solicit: true, inactive_date: new Date(), defaultOfferId: 12, isProviderOrg: true },
      { id: 19, name: 'Sunnyside Group Home', address1: '359 Pine St', address2: null, city: 'Lombard', state: 'IL', zip: '60155', phone: '6303901234', email: 'sunnysidegh@sbcglobal.net', accessibility: null, notes: null, may_solicit: false, inactive_date: new Date(), defaultOfferId: 19, isProviderOrg: false },
      { id: 21, name: 'Klassic Kazoo Band', address1: '1319 S 18th St', address2: 'POB 19', city: 'Milwaukee', state: 'WI', zip: '53204', phone: '4145551212', email: 'kkb@gmail.com', accessibility: 'Depends on where we play.', notes: 'We prefer marching or gyms, we bring our audiences to their feet!', may_solicit: true, inactive_date: new Date(), defaultOfferId: 21, isProviderOrg: true }
    ];

    let options = [
      { id: 'IA', name: 'Iowa', topic: Option.TOPIC_STATE },
      { id: 'IL', name: 'Illinois', topic: Option.TOPIC_STATE },
      { id: 'IN', name: 'Indiana', topic: Option.TOPIC_STATE },
      { id: 'NJ', name: 'New Jersey', topic: Option.TOPIC_STATE },
      { id: 'CONCERT', name: "Concert", topic: Option.TOPIC_EVENT_TYPE },
      { id: 'NY', name: 'New York', topic: Option.TOPIC_STATE },
      { id: 'NV', name: 'Nevada', topic: Option.TOPIC_STATE },
      { id: 'WI', name: 'Wisconsin', topic: Option.TOPIC_STATE },
      { id: 'WV', name: 'West Virginia', topic: Option.TOPIC_STATE },
      { id: 'WY', name: 'Wyoming', topic: Option.TOPIC_STATE }
    ];

    let user = [
      { id: 3, orgId: 12, orgName: 'Great Actors Theater', defaultOfferId: 3, name: 'Josh', isAdminUser: true, isProviderOrg: true },
      { id: 4, orgId: 12, orgName: 'Great Actors Theater', defaultOfferId: 3, name: 'Peter', isAdminUser: false, isProviderOrg: true },
      { id: 5, orgId: 19, orgName: 'Sunnyside Group Home', defaultOfferId: -1, name: 'Sam', isAdminUser: false, isProviderOrg: false }
    ];

    let credential = [
      { id: 3, name: "josh", password: "josh" },
      { id: 4, name: "peter", password: "peter" },
      { id: 5, name: "sam", password: "sam" }
    ];

    return { org, options, user, credential };
  }

}
