import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../common/components/base.component';
import { Bank } from '../../../../services/bank/domain/bank.models';
import { Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { AbabilLocationService } from './../../../../services/location/service-api/location.service';
import { Address } from '../../../../services/cis/domain/address.model';
import * as mapper from './bank.mapper';


export interface BankSaveEvent {
    bankForm: Bank;
    verifier: string;
}
export let initialBankFormData : Bank = new Bank();
initialBankFormData.ownBank = false;



@Component({
    selector: 'app-bank-form',
    templateUrl: './bank.form.component.html',
    styleUrls: ['./bank.form.component.scss']
})
export class BankFormComponent extends BaseComponent implements OnInit {
    
    bankForm: FormGroup;
    id: number;
    address: Address =new Address();

    @Input('formData') set formData(formData: Bank) {
        this.prepareBankForm( formData );
    }    
    @Input('command')  command:string;     
    @Output('onSave') onSave = new EventEmitter<BankSaveEvent>();
    @Output('onCancel') onCancel = new EventEmitter<void>(); 
    @ViewChild('addressComponent') addressComponent:any;

    verifierSelectionModalVisible:Observable<boolean>;
    
    constructor (private formBuilder: FormBuilder,private ababilLocationService: AbabilLocationService) {
        super();
    }

    ngOnInit() {
        this.verifierSelectionModalVisible=of(false);
        
    }
   
    prepareBankForm(formData: Bank) {
        formData=(formData==null? initialBankFormData :formData);
        this.id = formData.id;
        this.address=formData.address?formData.address:new Address();

        this.bankForm = this.formBuilder.group({
            code: [formData.code, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
            name: [formData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
            centralBankCode: [formData.centralBankCode],
            swiftCode: [formData.swiftCode],
            ownBank: [formData.ownBank]
        });
    }

    submit() {
        this.verifierSelectionModalVisible=of(true); 
      }
  
      onVerifierSelect(selectEvent: VerifierSelectionEvent){
         this.emitSaveEvent(selectEvent.verifier);
      }
  
      emitSaveEvent(verfier: string) {
          let bank = this.extractData();
          this.onSave.emit({
              bankForm : bank,
              verifier: verfier
          });
      } 


    cancel(): void {
        this.onCancel.emit();
    }

    formsInvalid(): boolean {
         return (this.bankForm.invalid);
    }

    extractData(): Bank {        
        let bank : Bank = mapper.mapBank(this.bankForm.value);
        bank.address =  this.addressComponent.extractData();
        bank.id = this.id;
        return bank;
    }
}
