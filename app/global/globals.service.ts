import { Injectable } from '@angular/core';

import { Option } from './option';
import { OptionService } from './option.service';

@Injectable()
export class GlobalsService {
  private stateOptions: Option[] = [];
  private eventTypeOptions: Option[] = [];
  error: string = null;

  constructor(private optionService: OptionService) { }

  public getGlobals(): void {
    this.optionService
      .getOptions()
      .subscribe(
        (options: Option[]) => this.fillOptions(options),
        error => this.error = <any>error
      );
  }

  private fillOptions(options: Option[]) {
    this.stateOptions = this.filterOptions(options, Option.TOPIC_STATE);
    this.eventTypeOptions = this.filterOptions(options, Option.TOPIC_EVENT_TYPE);
  }

  private filterOptions(options: Option[], topic: string): Option[] {
    let filteredOptions: Option[] = [];

    for(let option of options) {

      if(option.topic === topic) {
        filteredOptions.push(option);
      }

    }
  
    return filteredOptions;
  }

  public getStateOptions(): Option[] {
    return this.stateOptions;
  }

  public getEventTypeOptions(): Option[] {
    return this.eventTypeOptions;
  }
  
}
