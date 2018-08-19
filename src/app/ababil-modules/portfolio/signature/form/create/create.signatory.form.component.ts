import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Subscriber } from 'rxjs';
import { NotificationService, NotificationType } from '../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../common/components/base.component';
import { Observable } from 'rxjs';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import { AccountOperatorService } from '../../../../../services/account-operator/service-api/account.operator.service';
import { AccountSignatory } from '../../../../../services/account-operator/domain/account.operator.models';
import { initialAccountSignatoryFormData } from '../signatory.form.component';

@Component({
    selector: 'create-signatory-form',
    templateUrl: './create.signatory.form.component.html',
})

export class CreateSignatoryFormComponent extends BaseComponent implements OnInit {
    accountSignatoryFormData: Observable<AccountSignatory>;
    queryParams:any;
    accountId:number;
    operatorId:number;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private accountOperatorService: AccountOperatorService,
        private notificationService: NotificationService) { super(); }

    ngOnInit() {

        this.route.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;
            this.accountId = this.queryParams['accountId'];
            this.operatorId = this.queryParams['operatorId'];
        });
        this.accountSignatoryFormData = new Observable(observer => {
            let accountSignatory = initialAccountSignatoryFormData;
            observer.next(accountSignatory);
        });
    }

    onSave(event: any) {
        let accountSignatory = event.accountSignatoryForm;
        this.subscribers.saveSub = this.accountOperatorService.addAccountSignatory({id:this.accountId, operatorId: this.operatorId},accountSignatory).subscribe(
            (data) => {
                this.notificationService.sendSuccessMsg("signatory.save.success");
              this.navigateAway();
            }
        )
    }

    onCancel(): void {
        this.navigateAway();
    }

    navigateAway(): void {
        this.router.navigate(['../../'], {
            relativeTo: this.route, queryParams: {
                cus: this.queryParams.cus,
                routeBack: this.queryParams.routeBack,
                accountId: this.queryParams.accountId,
                customerId: this.queryParams.customerId
                },
        });
    }

}