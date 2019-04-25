import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { ActivatedRoute } from "@angular/router";
import { TabView } from "tns-core-modules/ui/tab-view";
import { Page } from "tns-core-modules/ui/page";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { AppStateService } from "~/app/services/app-state.service";

@Component({
  selector: "dl-nav-tabs",
  templateUrl: "./nav-tabs.component.html",
  styleUrls: ["./nav-tabs.component.scss"]
})
export class NavTabsComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectedIndex: number;

  private _tabView: TabView;
  private _destroyed: Subject<boolean> = new Subject();

  constructor(
    private _router: RouterExtensions,
    private _route: ActivatedRoute,
    private _page: Page,
    private _appState: AppStateService
  ) {}

  ngOnInit() {
    this.selectedIndex = 0;
    this._router.navigate(
      [
        "./",
        {
          outlets: {
            translate: ["translate"],
            history: ["history"]
          }
        }
      ],
      {
        relativeTo: this._route,
        transition: { name: "slideLeft" }
      }
    );

    this._appState.tabViewIndexState.pipe(takeUntil(this._destroyed)).subscribe(state => {
      this.tabViewIndexChange(state.tabViewIndex);
    });
  }

  ngAfterViewInit(): void {
    this._tabView = <TabView>this._page.getViewById("tabView");
    this._tabView.selectedIndex = 0;
  }

  tabViewIndexChange(idx: number) {
    this._tabView.selectedIndex = idx;
  }

  ngOnDestroy(): void {
    this._destroyed.next(true);
    this._destroyed.complete();
  }
}
