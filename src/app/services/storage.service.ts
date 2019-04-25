import { Injectable } from "@angular/core";
import { setString, getString, hasKey, remove } from "tns-core-modules/application-settings";

@Injectable({ providedIn: "root" })
export class StorageService {
  deviceStoreString(key: string, value: string) {
    setString(key, value);
  }

  deviceHasKey(key: string) {
    return hasKey(key);
  }

  deviceGetString(key: string) {
    return getString(key);
  }

  deviceRemove(key: string) {
    remove(key);
  }
}
