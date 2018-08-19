import { Component, OnInit, OnDestroy } from '@angular/core';
import { BankSaveEvent, initialBankFormData } from '../bank.form.component';
import { Bank } from '../../../../../services/bank/domain/bank.models';
import { BankService } from '../../../../../services/bank/service-api/bank.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Subscriber } from 'rxjs';
import { NotificationService, NotificationType } from '../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../common/components/base.component';
import { Observable } from 'rxjs';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import * as mapper from '../bank.mapper';

@Component({
    selector: 'app-create-bank-form',
    templateUrl: './create.bank.form.component.html',
    styleUrls: ['./create.bank.form.component.scss']
})
export class CreateBankFormComponent extends BaseComponent implements OnInit {

    bankFormData: Observable<Bank>;
    command: string;
    isOwnBank: Boolean;
    constructor(private bankService: BankService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService) { super(); }

    ngOnInit() {
        this.command = commandConstants.BANK_CREATE_COMMAND;
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.isOwnBank = params['ownBank'];
            this.bankFormData = new Observable(observer => {
                let bank = initialBankFormData;
                observer.next(bank);
            });
        });

    }

    onSave(event: any) {
        let bank = event.bankForm;
        let urlSearchMap = new Map();
        if (event.verifier != null) urlSearchMap.set(urlSearchParameterConstants.VERIFIER, event.verifier);
        this.subscribers.saveSub = this.bankService.createBank(bank, urlSearchMap).subscribe(
            (data) => {
                this.notificationService.sendSuccessMsg("approval.requst.success");
                this.navigateAway();
            }
        )
    }

    onCancel(): void {
        this.navigateAway();
    }

    navigateAway(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

}
