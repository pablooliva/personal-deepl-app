import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { TranslateConfig } from "~/app/translate/translate.component";

export interface AppState {
  tabViewIndex: number;
  query: string;
  fromTo: TranslateConfig;
}

@Injectable({
  providedIn: "root"
})
export class TabViewChildStateService {
  public tabViewIndexState: Subject<AppState> = new Subject();

  constructor() {}

  public goToTranslate(state: AppState): void {
    this.tabViewIndexState.next(state);
  }
}
