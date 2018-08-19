import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Message } from "primeng/primeng";
import { Subscriber, Observable } from "rxjs";
import { BankFormComponent } from "../bank.form.component";
import { BankSaveEvent } from "../bank.form.component";
import { BankService } from "../../../../../services/bank/service-api/bank.service";
import { Bank } from "../../../../../services/bank/domain/bank.models";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { BaseComponent } from '../../../../../common/components/base.component';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import * as mapper from '../bank.mapper';



@Component({
    selector: 'app-bank-edit-form',
    templateUrl: './edit.bank.form.component.html',
})
export class EditBankFormComponent extends BaseComponent implements OnInit{
    bankFormData: Observable<Bank>;
    selectedId: number;
    command:string;
    

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private bankService: BankService,
                 private notificationService: NotificationService ) { super(); }
    ngOnInit() {
        this.command = commandConstants.BANK_UPDATE_COMMAND;        
        this.subscribers.routeSub = this.route.params.subscribe(
            params => {
                this.selectedId = +params['id'];
            });
        this.fetchBankDetail();   
    }

    fetchBankDetail() {
        this.subscribers.fetchSub = this.bankService.fetchBankDetail({ id: this.selectedId }).subscribe(
          bank => {
            this.bankFormData = bank;
          });
      }
    
    onSave(event: any): void {
        let bank = event.bankForm;
        let urlSearchParams= new Map<any,any>();
        if(event.verifier!=null) urlSearchParams.set(urlSearchParameterConstants.VERIFIER,event.verifier);
        this.subscribers.updateSub = this.bankService.updateBank( bank,{ 'id': this.selectedId + ''},urlSearchParams).subscribe(
          (data) => {
            this.notificationService.sendSuccessMsg("approval.requst.success");
            this.navigateAway();
          }
        )
      }
    
    onCancel(): void{
        this.navigateAway();
    }

    navigateAway(): void{
        this.router.navigate( ['../'], { relativeTo: this.route } );
    }

}