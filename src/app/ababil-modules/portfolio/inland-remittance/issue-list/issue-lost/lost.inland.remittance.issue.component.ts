import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../../common/components/base.component";
import { InlandRemittanceInstrument } from "../../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.models";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { InlandRemittanceIssueService } from "../../../../../services/inland-remittance/issue/service-api/inland.remittance.issue.service";
import { InlandRemittanceInstrumentLostInfo } from "../../../../../services/inland-remittance/issue/domain/inland.remittance.issue.lost.models";

@Component({
    selector: 'lost-issue',
    templateUrl: './lost.inland.remittance.issue.component.html'
})
export class LostInlandRemittanceIssueComponent extends BaseComponent implements OnInit {



    id: number;
    inlandRemittanceInstrument: InlandRemittanceInstrument = new InlandRemittanceInstrument();
    inlandRemittanceInstrumentLostInfo: InlandRemittanceInstrumentLostInfo = new InlandRemittanceInstrumentLostInfo();
    lostIssueForm: FormGroup;
    constructor(private formBuilder: FormBuilder,
        private inlandRemittanceIssueService: InlandRemittanceIssueService,
        private notificationService: NotificationService) {
        super();
    }

    ngOnInit(): void {
        this.prepareLostIssueForm(this.inlandRemittanceInstrumentLostInfo);
    }

    setData(data) {
        this.id = data.id;
        this.inlandRemittanceInstrument = data;
        console.log(data);
    }

    prepareLostIssueForm(inlandRemittanceInstrumentLostInfo: InlandRemittanceInstrumentLostInfo) {
        this.lostIssueForm = this.formBuilder.group({
            lostRemark: [inlandRemittanceInstrumentLostInfo.lostRemark, [Validators.required]]
        });
    }
}