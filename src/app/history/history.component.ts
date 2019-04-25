import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { ActivatedRoute } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";

import { StorageService } from "~/app/services/storage.service";
import { TranslationHistoryItems, transStorageKey } from "~/app/translate/translate.component";
import { TabViewChildStateService } from "~/app/services/tab-view-child-state.service";

@Component({
  selector: "dl-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  public storage: TranslationHistoryItems[];

  constructor(
    private _page: Page,
    private _storage: StorageService,
    private _router: RouterExtensions,
    private _route: ActivatedRoute,
    private _tvChildState: TabViewChildStateService
  ) {}

  ngOnInit() {
    this._page.actionBarHidden = true;

    if (this._storage.hasKey(transStorageKey)) {
      this.storage = JSON.parse(this._storage.getString(transStorageKey));
    }
  }

  onItemTap(item: TranslationHistoryItems): void {
    const translateTabViewIndex = 0;
    this._tvChildState.goToTranslate({
      tabViewIndex: translateTabViewIndex,
      query: item.translationQuery,
      fromTo: item.fromTo
    });

    this._router.navigate(["../tabs", { outlets: { translate: ["translate"] } }], {
      skipLocationChange: true,
      relativeTo: this._route.parent
    });
  }

  remove(idx: number): void {
    console.log("idx", idx, { storage: this.storage });
    this.storage.splice(idx, 1);
    this._storage.storeString(transStorageKey, JSON.stringify(this.storage));
    console.log(
      "after",
      { storage: this.storage },
      { storageDev: this._storage.getString(transStorageKey) }
    );
  }
}
