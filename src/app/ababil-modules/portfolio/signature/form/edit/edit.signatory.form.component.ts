import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { NotificationService, NotificationType } from '../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../common/components/base.component';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import { AccountOperatorService } from '../../../../../services/account-operator/service-api/account.operator.service';
import { AccountSignatory } from '../../../../../services/account-operator/domain/account.operator.models';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'edit-signatory-form',
    templateUrl: './edit.signatory.form.component.html',
})


export class EditSignatoryFormComponent extends BaseComponent implements OnInit{
    
    imageApiUrl:any;
    queryParams:any;
    accountId: number;
    operatorId: number;
    signatoryId: number;
    customerId: number;
    selectedIndividualId: number;
    accountSignatoryFormData: Observable<AccountSignatory>; 


    constructor(private route: ActivatedRoute,
        private router: Router,
        private accountOperatorService: AccountOperatorService,
        private notificationService: NotificationService) { super(); }


    ngOnInit() {
        this.imageApiUrl = environment.serviceapiurl;
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.signatoryId = params['signatoryId'];
        });
        this.route.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;
            this.accountId = this.queryParams['accountId'];
            this.operatorId = this.queryParams['operatorId'];
            this.selectedIndividualId = this.queryParams['individualId'];
            this.customerId = this.queryParams['customerId'];
        });
        this.fetchSignatoryDetails(this.signatoryId);
    }

    fetchSignatoryDetails(signatoryId: number) {
        this.subscribers.fetchSub = this.accountOperatorService.fetchAccountSignatoryDetail({ id: this.accountId, operatorId: this.operatorId, signatoryId: signatoryId }).subscribe(signatory => {
            this.accountSignatoryFormData = signatory;
         });
    }

    onSave(event: any) {
        let accountSignatory = event.accountSignatoryForm;
        this.subscribers.saveSub = this.accountOperatorService.updateAccountSignatory({id: this.accountId, operatorId: this.operatorId,signatoryId: this.signatoryId},accountSignatory).subscribe(
            (data) => {
                this.notificationService.sendSuccessMsg("signatory.update.success");
                this.fetchSignatoryDetails(this.signatoryId);
                this.navigateAway();
            }
        );
    }

    onCancel(): void {
        this.navigateAway();
    }

    navigateAway(): void {
        this.router.navigate(['../'], { relativeTo: this.route,queryParams: {
          cus: this.queryParams.cus,
          routeBack: this.queryParams.routeBack,
          accountId: this.queryParams.accountId,
          operatorId: this.queryParams.operatorId,
          signatoryId: this.queryParams.signatoryId,
          customerId: this.queryParams.customerId
        }
         });
    }
}