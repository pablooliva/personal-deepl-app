import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TranslateComponent } from "./translate/translate.component";
import { NavTabsComponent } from "./nav-tabs/nav-tabs.component";
import { HistoryComponent } from "./history/history.component";

@NgModule({
  declarations: [AppComponent, TranslateComponent, NavTabsComponent, HistoryComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
