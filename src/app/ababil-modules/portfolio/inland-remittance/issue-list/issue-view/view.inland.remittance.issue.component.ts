import { Component } from "@angular/core";
import { BaseComponent } from "../../../../../common/components/base.component";
import { InlandRemittanceInstrument } from "../../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.models";
import { InlandRemittanceIssueService } from "../../../../../services/inland-remittance/issue/service-api/inland.remittance.issue.service";

@Component({
    selector: 'view-issue',
    templateUrl: './view.inland.remittance.issue.component.html',
    styleUrls: ['./view.inland.remittance.issue.component.scss']
})
export class ViewIssueComponent extends BaseComponent {

    inlandRemittanceInstrument: InlandRemittanceInstrument = new InlandRemittanceInstrument();
    id: number;

    constructor(
        private inlandRemittanceIssueService: InlandRemittanceIssueService) {
        super();
    }
    setData(data) {
        this.id = data.id;
        this.inlandRemittanceInstrument = data;
        console.log(data);
    }
}