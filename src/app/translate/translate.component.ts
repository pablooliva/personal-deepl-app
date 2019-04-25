import { Component, OnDestroy, OnInit } from "@angular/core";
import { EventData, Page } from "tns-core-modules/ui/page";
import { TextView } from "tns-core-modules/ui/text-view";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { HttpService, TranslationSource } from "~/app/services/http.service";
import { StorageService } from "~/app/services/storage.service";
import { TabViewChildStateService } from "~/app/services/tab-view-child-state.service";

export interface TranslationHistoryItems {
  date: Date;
  translationQuery: string;
  fromTo: TranslateConfig;
}

export const transStorageKey = "translation-history";

export interface TranslateConfig {
  fromLan: string;
  toLan: string;
}

@Component({
  selector: "dl-translate",
  templateUrl: "./translate.component.html",
  styleUrls: ["./translate.component.scss"]
})
export class TranslateComponent implements OnInit, OnDestroy {
  public translateConfig: TranslateConfig[];
  public inputVal: string;
  public outputVal: string;
  public textViewElem: TextView;

  private _destroyed: Subject<boolean> = new Subject();

  constructor(
    private _page: Page,
    private _http: HttpService,
    private _storage: StorageService,
    private _tvChildState: TabViewChildStateService
  ) {}

  ngOnInit() {
    this._page.actionBarHidden = true;

    if (!this._storage.hasKey(transStorageKey)) {
      const storeInit: TranslationHistoryItems[] = [];
      this._storage.storeString(transStorageKey, JSON.stringify(storeInit));
    }

    this.translateConfig = [
      { fromLan: "german", toLan: "english" },
      { fromLan: "english", toLan: "german" }
    ];

    this.inputVal = "";
    this.outputVal = "";

    this._tvChildState.tabViewIndexState.pipe(takeUntil(this._destroyed)).subscribe(state => {
      this.inputVal = state.query;
      this._translate(state.fromTo);
    });
  }

  onTap(e: EventData, cfg: TranslateConfig) {
    this._translate(cfg, true);
    this.textViewElem.dismissSoftInput();
  }

  private _translate(cfg: TranslateConfig, tapped: boolean = false): void {
    this._http.translate(cfg.fromLan as TranslationSource, this.inputVal).subscribe(
      result => {
        this.outputVal = result.toString();

        if (tapped) {
          const storage: TranslationHistoryItems[] = JSON.parse(
            this._storage.getString(transStorageKey)
          );

          const now = new Date();
          storage.push({
            date: now,
            translationQuery: this.inputVal,
            fromTo: {
              fromLan: cfg.fromLan,
              toLan: cfg.toLan
            }
          });

          this._storage.remove(transStorageKey);
          this._storage.storeString(transStorageKey, JSON.stringify(storage));
        }
      },
      error => console.error("error", error)
    );
  }

  onValChange(e: EventData): void {
    if (this.outputVal) {
      this.outputVal = "";
    }
  }

  onFocus(e: EventData): void {
    this.textViewElem = <TextView>e.object;
  }

  ngOnDestroy(): void {
    this._destroyed.next(true);
    this._destroyed.complete();
  }
}
