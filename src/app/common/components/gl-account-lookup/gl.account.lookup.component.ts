import { AccountNature } from './../../domain/gl.enum.model';
import { SelectItem } from 'primeng/api';
import { SimpleChanges } from '@angular/core';
import { Input } from '@angular/core';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { GlAccount } from './../../../services/glaccount/domain/gl.account.model';
import { GlAccountService } from './../../../services/glaccount/service-api/gl.account.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { environment } from "../../../../environments/environment";

@Component({
    selector: 'gl-account-lookup',
    templateUrl: './gl.account.lookup.component.html',
    providers: [GlAccountService]
})
export class GlAccountLookupComponent extends BaseComponent implements OnInit {

    glAccountSearchForm: FormGroup;    
    totalRecords: number;
    totalPages: number;
    glAccountsSearchResults:GlAccount[]=[];
    selectedGlAccount:GlAccount=null;
    accountNatures:SelectItem[]=AccountNature;

    @Input('resultType') resultType:string;
    @Output('onSelect') onSelect = new EventEmitter<any>();
    @Output('onClose') onClose = new EventEmitter<string>();
    @Input('display') display:boolean;   

    constructor(private formBuilder: FormBuilder,
        private glAccountService: GlAccountService) {
        super();
    }

    ngOnInit() {
        this.prepareSearchForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.resultType){
           this.resultType = changes.resultType.currentValue;
        }
        if(changes.display){
           this.display = changes.display.currentValue; 
        }      
    }

    prepareSearchForm() {
        this.glAccountSearchForm = this.formBuilder.group({
            name: ['', Validators.maxLength(32)],
            code: ['', Validators.maxLength(32)],
            parent: [false],
            accountNature: [null]
        });
    }

    resetSearchForm() {
        this.glAccountSearchForm.patchValue({ name: '', code: '', parent: false, accountNature:null});
    }

    searchGlAccounts(page:number) {
        let urlQueryParams =new Map()
        for (let control in this.glAccountSearchForm.controls) {
            if(this.glAccountSearchForm.get(control).value==null) continue;            
            let formControlValue: string = this.glAccountSearchForm.get(control).value.toString().trim();
            if (formControlValue.length !== 0){
                if(control=='accountNature'){
                   urlQueryParams.set("account-nature", this.glAccountSearchForm.get(control).value); 
                }else{
                   urlQueryParams.set(control, this.glAccountSearchForm.get(control).value); 
                }
                

            }
                
        }
        urlQueryParams.set("page", page);
        urlQueryParams.set("aspage",true);

        if(urlQueryParams.size==2) return;

        this.subscribers.searchSub = this.glAccountService.fetchGlAccounts(urlQueryParams).subscribe(
            data => {
                this.glAccountsSearchResults = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            }
        );
    }

    clear(){
        this.resetSearchForm();
        this.glAccountsSearchResults=[];
    }

    handleGlAccountSelect(event){
        if(this.resultType == 'GL_ACCOUNT_PATH'){
           this.glAccountService.fetchGeneralLedgerAccountPath({id:this.selectedGlAccount.id})
           .subscribe(data=>{
              this.onSelect.emit({mode:'GL_ACCOUNT_PATH',data:data});
              this.close(); 
           });
        }else{
           this.onSelect.emit({mode:'GL_ACCOUNT',data:this.selectedGlAccount});
           this.close(); 
        }        
    }

    fetchGlAccountLazily(event:LazyLoadEvent){
        this.searchGlAccounts(event.first/20);
    }

    close(){
        this.glAccountsSearchResults=[];
        this.prepareSearchForm();
        this.display=false;
        this.totalPages=0;
        this.totalRecords=0;
        this.onClose.emit('close');
    }

}