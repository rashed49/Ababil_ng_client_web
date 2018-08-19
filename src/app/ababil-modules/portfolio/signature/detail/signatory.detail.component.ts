import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '../../../../common/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "../../../../common/components/base.component";
import { AccountOperatorService } from '../../../../services/account-operator/service-api/account.operator.service';
import { AccountSignatory } from '../../../../services/account-operator/domain/account.operator.models';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'signatory-detail',
    templateUrl: './signatory.detail.component.html'
})
export class SignatoryDetailComponent extends BaseComponent implements OnInit {

    accountId: number;
    operatorId: number;
    signatoryId: number;
    queryParams: any;
    imageApiUrl: any;
    isOwnerSignature: boolean;
    accountSignatory: AccountSignatory = new AccountSignatory();

    @ViewChild("signatorySignature") signatorySignature: any;
    @ViewChild("individualImage") individualImage: any;


    constructor(private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private router: Router,
        private accountOperatorService: AccountOperatorService,
        private notificationService: NotificationService,
    ) {
        super();
    }

    ngOnInit() {
        this.imageApiUrl = environment.serviceapiurl;
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.signatoryId = params['signatoryId'];
        });
        this.route.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;
            this.accountId = this.queryParams['accountId'];
            this.operatorId = this.queryParams['operatorId'];
        });
        this.fetchSignatoryDetails(this.signatoryId);
    }

    fetchSignatoryDetails(signatoryId: number) {
        this.subscribers.fetchSub = this.accountOperatorService.fetchAccountSignatoryDetail(
            { id: this.accountId, operatorId: this.operatorId, signatoryId: signatoryId }).subscribe(
                signatory => {
                    this.accountSignatory = signatory;
                    // this.accountSignatory.signature = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + signatory.signature);
                    this.individualImage.nativeElement.src = this.imageApiUrl + "/individuals/" + this.accountSignatory.individualId + "/image";
                    this.accountSignatory.signature = this.sanitizer.bypassSecurityTrustUrl(this.imageApiUrl + "/accounts/" + this.accountId + "/operator-information/" + this.operatorId + "/signatories/" + this.signatoryId + "/signature?t=" + new Date().getTime());
                    this.isOwnerSignature = (this.accountSignatory.signatoryType === "OWNER") ? true : false;
                });
    }

    deleteAccountSignatory() {
        this.subscribers.delSub = this.accountOperatorService.removeAccountSignatory({ id: this.accountId, operatorId: this.operatorId, signatoryId: this.signatoryId }).subscribe(
            (data) => {
                this.notificationService.sendSuccessMsg("signatory.delete.success");
                this.navigateAway();
            }
        )
    }

    cancel() {
        this.navigateAway();
    }


    navigateAway() {
        this.router.navigate(['/account-operator'], {
            queryParams: { 
                routeBack: this.queryParams.routeBack,
                 cus: this.queryParams.cus,
                  accountId: this.queryParams.accountId,
                customerId: this.queryParams.customerId }
        }
        );
    }

    editSignatory() {
        this.router.navigate(['edit'], {
            relativeTo: this.route,
            queryParams: {
                signatoryType: this.accountSignatory.signatoryType,
                individualId: this.accountSignatory.individualId
            },
            queryParamsHandling: 'merge'
        });
    }
}