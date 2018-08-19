import {Component,OnInit} from '@angular/core';
import {MainComponent} from '../app-main/main.component';
import {SelectItem} from 'primeng/primeng';
import {TRANSLATE_STORAGE_KEY} from '../common/i18n/translate';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBar implements OnInit{

    languages: SelectItem[];
    selectedLang: string=sessionStorage.getItem(TRANSLATE_STORAGE_KEY);

    constructor(public app: MainComponent) {}

    ngOnInit(): void{
        this.selectedLang=sessionStorage.getItem(TRANSLATE_STORAGE_KEY);
        this.languages = [];
        this.languages.push({label:'Select Languages', value:""});
        this.languages.push({label:'English', value:"en"});
        // this.languages.push({label:'Bangla', value:"bg"});        
    } 

    selectLanguage(value: string): void {
        if(value.trim()!=""){
          sessionStorage.setItem(TRANSLATE_STORAGE_KEY, value);
          location.reload();
        }       
    }
    


}