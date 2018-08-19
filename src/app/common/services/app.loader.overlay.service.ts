import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class LoaderOverlayService{
    
    constructor(){}
    
    private loaderEventSource = new Subject<boolean>();
    
    eventTriggers$ = this.loaderEventSource.asObservable();

    show() {
       this.loaderEventSource.next(false);
    }

    hide() {
       this.loaderEventSource.next(true);
    }

}

