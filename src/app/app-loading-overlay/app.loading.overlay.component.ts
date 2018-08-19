import {Component,OnInit,OnDestroy} from '@angular/core';
import {Subscription,Observable, of} from 'rxjs';
import {tap, delay} from 'rxjs/operators';
import {LoaderOverlayService} from '../common/services/app.loader.overlay.service';

@Component({
   selector:'app-loading',
   templateUrl:'./app.loading.overlay.component.html'
})
export class AppLoadingOverlayComponent implements OnInit,OnDestroy{

    visible:Observable<boolean>=of(false); 
    private loaderEventSubscription:Subscription; 
    
    constructor(private loaderOverlayService:LoaderOverlayService){
        this.visible=of(false); 
    }

    ngOnInit(){
       this.loaderEventSubscription = this.loaderOverlayService.eventTriggers$
            .pipe(
                delay(0),
                tap(event => {
                    this.visible = of(event);
                })
            )
            .subscribe();
    }

    ngOnDestroy(){
       this.loaderEventSubscription.unsubscribe();
    }

    

    

}