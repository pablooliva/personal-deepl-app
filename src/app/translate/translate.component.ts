import { Component, OnDestroy, OnInit } from "@angular/core";
import { EventData, Page } from "tns-core-modules/ui/page";
import { TextView } from "tns-core-modules/ui/text-view";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { HttpService, TranslationSource } from "~/app/services/http.service";
import { AppStateService, TranslateConfig } from "~/app/services/app-state.service";

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
    private _appStateService: AppStateService
  ) {}

  ngOnInit() {
    this._page.actionBarHidden = true;
    this.translateConfig = [
      { fromLan: "german", toLan: "english" },
      { fromLan: "english", toLan: "german" }
    ];

    this.inputVal = "";
    this.outputVal = "";

    this._appStateService.tabViewIndexState.pipe(takeUntil(this._destroyed)).subscribe(state => {
      this.inputVal = state.item.translationQuery;
      this._translate(state.item.fromTo);
    });
  }

  onTap(e: EventData, cfg: TranslateConfig) {
    const isNewEntry = true;
    this.inputVal = this.inputVal.trim();
    this._translate(cfg, isNewEntry);
    this.textViewElem.dismissSoftInput();
  }

  private _translate(cfg: TranslateConfig, newEntry: boolean = false): void {
    this._http.translate(cfg.fromLan as TranslationSource, this.inputVal).subscribe(
      result => {
        this.outputVal = result.toString();

        if (newEntry) {
          this._pushToTransHistory(cfg);
        }
      },
      error => console.error("error", error)
    );
  }

  private _pushToTransHistory(cfg: TranslateConfig): void {
    const now = new Date();
    this._appStateService.addToTransHistory({
      date: now,
      translationQuery: this.inputVal,
      fromTo: {
        fromLan: cfg.fromLan,
        toLan: cfg.toLan
      }
    });
  }

  onValChange(e: EventData): void {
    if (this.outputVal) {
      this.outputVal = "";
    }
  }

  onFocus(e: EventData): void {
    this.textViewElem = <TextView>e.object;
    this.textViewElem.editable = true;
  }

  ngOnDestroy(): void {
    this._destroyed.next(true);
    this._destroyed.complete();
  }
}
