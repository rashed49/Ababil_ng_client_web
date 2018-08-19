import {Component,OnInit,ElementRef,Renderer2,ViewChild,ErrorHandler} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {getSelectedLanguage} from './common/i18n/translate';
import {Store} from '@ngrx/store';
//import * as fromRoot from './store'; 
import { Response, Http } from '@angular/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [  
  ],
})
export class AppComponent implements OnInit {    
    
    constructor(private translator: TranslateService
      //,private store: Store<fromRoot.AppState>
    ) {
    }

    ngOnInit(): void {
      this.translator.addLangs(['en']);
      this.translator.setDefaultLang('en');
      this.translator.use(getSelectedLanguage(this.translator));
    }
    
    ngOnDestroy(): void {
        
    }

}