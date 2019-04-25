import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export type TranslationSource = "english" | "german";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(private _http: HttpClient) {}

  translate(source: TranslationSource, query: string): Observable<Object> {
    const encodedQuery = encodeURIComponent(query).toString();
    const url =
      "https://dict.deepl.com/english-german/search?ajax=1&query=" +
      encodedQuery +
      "&source=" +
      source +
      "&onlyDictEntries=1&translator=dnsof7h3k2lgh3gda";

    return this._http.get(url, { responseType: "text" });
  }
}
