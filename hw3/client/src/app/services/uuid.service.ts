import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UuidService {
  private storageKey = 'user_uuid';

  constructor() { }

  getUUID(): string {
    let uuid = localStorage.getItem(this.storageKey);
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem(this.storageKey, uuid);
    }
    return uuid;
  }
}
