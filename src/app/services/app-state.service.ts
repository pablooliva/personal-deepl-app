import { Injectable, OnDestroy } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";

import { StorageService } from "~/app/services/storage.service";

export interface TranslateConfig {
  fromLan: string;
  toLan: string;
}

export interface TranslationHistoryItem {
  date: Date;
  translationQuery: string;
  fromTo: TranslateConfig;
}

export interface TranslateViewState {
  tabViewIndex: number;
  item: TranslationHistoryItem;
}

@Injectable({
  providedIn: "root"
})
export class AppStateService implements OnDestroy {
  public tabViewIndexState: Subject<TranslateViewState> = new Subject();
  public transHistoryState: ReplaySubject<TranslationHistoryItem[]> = new ReplaySubject<
    TranslationHistoryItem[]
  >(1);

  private _transStorageKey = "translation-history";
  private _parsedTransHistory: TranslationHistoryItem[];
  private _destroyed: Subject<boolean> = new Subject();

  constructor(private _storageService: StorageService) {
    this._parsedTransHistory = this._storageService.deviceHasKey(this._transStorageKey)
      ? JSON.parse(this._storageService.deviceGetString(this._transStorageKey))
      : [];

    this.transHistoryState.next(this._parsedTransHistory);
  }

  public goToTranslate(state: TranslateViewState): void {
    this.tabViewIndexState.next(state);
  }

  public addToTransHistory(item: TranslationHistoryItem): void {
    this._removeDups(item);
    this._parsedTransHistory.push(item);
    this._updateStateAndStorage();
  }

  public removeFromTransHistory(idx: number): void {
    this._parsedTransHistory.splice(idx, 1);
    this._updateStateAndStorage();
  }

  private _updateStateAndStorage(): void {
    this.transHistoryState.next(this._parsedTransHistory);
    this._storageService.deviceStoreString(
      this._transStorageKey,
      JSON.stringify(this._parsedTransHistory)
    );
  }

  private _removeDups(item: TranslationHistoryItem): void {
    this._parsedTransHistory = this._parsedTransHistory.filter(
      curr => curr.translationQuery !== item.translationQuery
    );
  }

  public ngOnDestroy(): void {
    this._destroyed.next(true);
    this._destroyed.complete();
  }
}
