import { NotificationService } from './../../../../../../../common/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notice } from './../../../../../../../services/bank-notice/domain/notice.models';
import { BankNoticeService } from './../../../../../../../services/bank-notice/service-api/bank.notice.service';
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { BaseComponent } from "../../../../../../../common/components/base.component";

@Component({
selector:'bank-notice-detail',
templateUrl:'./bank.notice.detail.component.html'
})
export class BankNoticeDetailComponent extends BaseComponent  implements OnInit {
    
    routeBack: string;
    accountUrl: string;
    customerUrl: string;
    notice:Notice = new Notice();
    accountId:number;
    bankNoticeId: number;
    

    constructor(private route: ActivatedRoute,
        private router: Router, 
        private bankNoticeService:BankNoticeService,
        private notificationService:NotificationService,
        private formBuilder:FormBuilder){
        super();    
    }
    
    ngOnInit(): void {
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(
            queryParams => {
                this.routeBack = queryParams['bankNotice'];
                this.accountUrl = queryParams['demandDeposit'];
                this.customerUrl = queryParams['cus'];
            }
        );        
        this.subscribers.routeParamSub = this.route.params.subscribe(
            params => {
                this.accountId= +params['id'];
                this.bankNoticeId = +params['bankNoticeId'];
                this.fetchBankNoticeDetails();
            }
        );
    }

    edit(){
         this.router.navigate(['../../form'], {
            relativeTo: this.route,
            queryParams: { 
                noticeId: this.bankNoticeId
            },
            queryParamsHandling: "merge"
        });
    }

    delete(){
        this.subscribers.deleteBankNoticeSub = this.bankNoticeService.deleteBankNotice({
            id:this.accountId,accountNoticeId:this.bankNoticeId
        }).subscribe(data=>{
            this.notificationService.sendSuccessMsg('bank.notice.delete.success');
        });
    }

    fetchBankNoticeDetails(){
        this.subscribers.fetchNoticeDetailSub = this.bankNoticeService.fetchNoticeDetail({id:this.accountId,accountNoticeId:this.bankNoticeId})
        .subscribe(data=>{
            this.notice = data; 
        });
    }

    navigateAway(){
       this.router.navigate([this.routeBack], { 
        relativeTo: this.route,
        queryParams: {
            demandDeposit: this.accountUrl,
            bankNotice: this.routeBack,
            cus: this.customerUrl
        }});
    }

    cancel(){
       this.navigateAway();
    }
}