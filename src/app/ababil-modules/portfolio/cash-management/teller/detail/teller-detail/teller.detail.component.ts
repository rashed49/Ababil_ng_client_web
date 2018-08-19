import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Teller, TellerLimit } from '../../../../../../services/teller/domain/teller.models';
import { TellerService } from '../../../../../../services/teller/service-api/teller.service';
import { Subscriber, Observable } from 'rxjs';
import { PathParameters } from '../../../../../../services/base.service';
import { NotificationService, NotificationType } from '../../../../../../common/notification/notification.service';
import { GlAccountService } from '../../../../../../services/glaccount/service-api/gl.account.service';
import { BankService } from '../../../../../../services/bank/service-api/bank.service';

@Component({
    selector: 'teller-detail',
    templateUrl: './teller.detail.component.html'
})
export class TellerDetailComponent implements OnInit, OnDestroy {

    private selectedId: number;
    private subscribers: any = {};
    teller: Teller = { code: null, title: null, tellerLimits: null };
    tellerLimit: TellerLimit[];
    GLAccountName: string;
    branchName: string;
    constructor(private route: ActivatedRoute, private router: Router, private glAccountService: GlAccountService, private bankService: BankService, private tellerService: TellerService, private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.selectedId = +params['id'];
        });

        this.fetchTellerDetail();
    }

    fetchTellerDetail() {
        this.subscribers.groupmenuDetailSub = this.tellerService.fetchTellerById(
            { "id": this.selectedId + "" }
        ).subscribe(teller => {
            this.teller = teller;
            this.fetchGLDetails(teller.glId);
            this.fetchBranchDetails(teller.branchId);
            this.tellerLimit = this.teller.tellerLimits;
        });
    }

    fetchGLDetails(glId: number) {
        this.glAccountService.fetchGlAccountDetails({ id: glId }).subscribe(
            GLDetail => {
                this.GLAccountName = GLDetail.name + " " +"(" + GLDetail.code +")";
            }
        );
    }
    
    // fetchBranchDetails(branchId: number) {
    //     this.bankService.fetchBranchDetails({ bankId: 1, branchId: branchId }).subscribe(
    //         branchDetail => {
    //             this.branchName = branchDetail.name + " " +"(" + branchDetail.code +")";
    //         }
    //     );
    // }
    fetchBranchDetails(bracnhId: number) {
        this.bankService.fetchOwnBranchDetails({ 'branchId': bracnhId }).subscribe(
            data => {
                this.branchName = data.name + " " +"(" + data.code +")";
            });
    }

    ngOnDestroy(): void {
        for (let subscriberKey in this.subscribers) {
            let subscriber = this.subscribers[subscriberKey];
            if (subscriber instanceof Subscriber) {
                subscriber.unsubscribe();
            }
        }

    }

    cancel() {
        this.navigateAway();
    }

    navigateAway(): void {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

}