import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscriber } from 'rxjs';

import * as $ from 'jquery';
import { AccountService } from '../../services/account/service-api/account.service';

// mostly utility methods
export class BaseComponent implements OnDestroy {
  

  subscribers: any = {};
  hasOwnProperty = Object.prototype.hasOwnProperty;
  key_B = 66;
  
  // one liners
  isFunction(value) { return typeof value === 'function'; }
  isArray(arr) { return Array.isArray(arr) || arr instanceof Array; }
  isString(value) { return typeof value === 'string'; }
  isNumber(value) { return typeof value === 'number'; }
  isWindow(obj) { return obj && obj.window === obj; }
  isBlankObject(value) { return value !== null && typeof value === 'object' && !Object.getPrototypeOf(value); }

  // on destroy unsubscribe form all the subscribers
  ngOnDestroy() {
    for (let subscriberKey in this.subscribers) {
      let subscriber = this.subscribers[subscriberKey];
      if (subscriber instanceof Subscriber) {
        subscriber.unsubscribe();
      }
    }
  }

  // returns the current relative url location  
  currentPath(location: Location, stripParmms: boolean = true) {
    return (stripParmms) ? location.path().split("?")[0] : location.path();
  }

  // unfinished. should initialize the enter base navigation in an ui 
  initEnterNavigation(tagName: string) {
    let tags = "input,select,textarea,p-dropdown,p-calendar,button";
    // $(tagName).find(tags).filter(':enabled').filter().keydown(function (e) {
    //   if (e.which == 13) {
    //     $(tagName).find(tags).filter(':enabled', )[$(tagName).find(tags).filter(':enabled').index(e.target) + 1].focus();
    //     //$(tagName).find(tags)[$(tagName).find().index(document.activeElement) + 1].select();
    //   }
    // });

    $(tagName).find(tags).filter(':enabled').filter($("input[name!='skip']")).filter($("button[name!='skip']")).keydown(function (e) {
      if (e.which == 13) {
        $(tagName).find(tags).filter(':enabled', )[$(tagName).find(tags).filter(':enabled').index(e.target) + 1].focus();
        //$(tagName).find(tags)[$(tagName).find().index(document.activeElement) + 1].select();
      }
    });


  }


  // convert data url to blob 
  makeblob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  //recursively mark form group controls as touched
  protected markFormGroupAsTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsDirty();
      if (control.controls) {
        control.controls.forEach(ctrl => this.markFormGroupAsTouched(ctrl));
      }
    });
  }

  protected markFormGroupAsUnTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsPristine();
      if (control.controls) {
        control.controls.forEach(ctrl => this.markFormGroupAsUnTouched(ctrl));
      }
    });
  }

  protected binaryStringToBlob(binaryString: string) {
    var binaryCharArray = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      binaryCharArray[i] = binaryString.charCodeAt(i);
    }
    return new Blob([binaryCharArray], { type: 'application/octet-stream' });
  }


  public isEmpty(obj: any) {
    let empty = true;
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) {
        empty = false;
        break;
      }
    }

    return empty;
  }
}