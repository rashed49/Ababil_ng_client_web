import { AccountNature } from './../../domain/gl.enum.model';
import { SelectItem } from 'primeng/api';
import { SimpleChanges } from '@angular/core';
import { Input } from '@angular/core';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { GlAccountService } from './../../../services/glaccount/service-api/gl.account.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { environment } from "../../../../environments/environment";
import { SubLedger } from '../../../services/glaccount/domain/sub.ledger.model';

@Component({
    selector: 'sub-ledger-lookup',
    templateUrl: './sub.ledger.lookup.component.html',
    providers: [GlAccountService]
})
export class SubLedgerLookupComponent extends BaseComponent implements OnInit {

    subLedgerSearchForm: FormGroup;    
    totalRecords: number;
    totalPages: number;
    subLedgersSearchResults:SubLedger[]=[];
    selectedSubLedger:SubLedger=null;
    accountNatures:SelectItem[]=AccountNature;

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
        // if(changes.resultType){
        //    this.resultType = changes.resultType.currentValue;
        // }
        // if(changes.display){
        //    this.display = changes.display.currentValue; 
        // }      
    }

    prepareSearchForm() {
        this.subLedgerSearchForm = this.formBuilder.group({
            subGlName: ['', Validators.maxLength(32)],
            subGlCode: ['', Validators.maxLength(32)],
            generalLedgerAccountId: ['', Validators.maxLength(32)]
         
        });
    }

    resetSearchForm() {
        this.subLedgerSearchForm.patchValue({ subGlName: '', subGlCode: '', generalLedgerAccountId: null});

    }

    searchSubLedgers(page:number) {
        let urlQueryParams =new Map()
        for (let control in this.subLedgerSearchForm.controls) {
            if(this.subLedgerSearchForm.get(control).value==null) continue;            
            let formControlValue: string = this.subLedgerSearchForm.get(control).value.toString().trim();
         
            if (formControlValue.length !== 0){
       
                   urlQueryParams.set(control, this.subLedgerSearchForm.get(control).value); 
            }  
        }
        
        console.log(urlQueryParams); 
        urlQueryParams.set("page", page);
        urlQueryParams.set("aspage",true);

        if(urlQueryParams.size==2) return;


        this.subscribers.searchSub = this.glAccountService.fetchSubGls(urlQueryParams).subscribe(
            data => {
                this.subLedgersSearchResults = data.content;
                console.log(this.subLedgersSearchResults);
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            }
        );
    }

    clear(){
        this.resetSearchForm();
        this.subLedgersSearchResults=[];
    }

    handleSubLedgerSelect(event){
           this.onSelect.emit(this.selectedSubLedger);
           this.close();     
    }

    fetchSubLedgerLazily(event:LazyLoadEvent){
        this.searchSubLedgers(event.first/20);
    }

    close(){
        this.subLedgersSearchResults=[];
        this.prepareSearchForm();
        this.display=false;
        this.totalPages=0;
        this.totalRecords=0;
        this.onClose.emit('close');
    }

}