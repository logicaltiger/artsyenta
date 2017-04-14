/*
  Data carrier for HTML Option tag.
  * id: The value reported out of the option tag.
  * name: The name of the value, seen by the user.
  * topic: The purpose of the select tag that should show this option.  
*/
export class Option {
	static TOPIC_STATE: string = "state";
	static TOPIC_EVENT_TYPE: string = "event_type";
  
	id: string;
	name: string;
	topic: string;

  constructor(d: any) {
    this.id = d.id;
    this.name = d.name;
    this.topic = d.topic;
  }

}
