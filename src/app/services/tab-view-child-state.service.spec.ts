import { TestBed } from "@angular/core/testing";

import { TabViewChildStateService } from "./tab-view-child-state.service";

describe("TabViewChildStateService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TabViewChildStateService = TestBed.get(TabViewChildStateService);
    expect(service).toBeTruthy();
  });
});
