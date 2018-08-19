import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../../common/components/base.component";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { FormBuilder, FormGroup,Validators } from "@angular/forms";
import { InlandRemittanceInstrument } from "../../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.models";
import { InlandRemittanceInstrumentService } from "../../../../../services/inland-remittance/instrument/service-api/inland.remittance.instrument.service";
import { InlandRemittanceInstrumentDestroyInfo } from "../../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.destroy.models";




@Component({
    selector: 'destroy-instrument',
    templateUrl: './destroy.inland.remittance.instrument.component.html'
})
export class DestroyInstrumentComponent extends BaseComponent implements OnInit {

    id: number;
    inlandRemittanceInstrument: InlandRemittanceInstrument = new InlandRemittanceInstrument();
    inlandRemittanceInstrumentDestroyInfo:InlandRemittanceInstrumentDestroyInfo=new InlandRemittanceInstrumentDestroyInfo();
    instrumentDestroyForm: FormGroup;
    createIssueForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        private instrumentService: InlandRemittanceInstrumentService,
        private notificationService: NotificationService) {
        super();
    }

    ngOnInit(): void {
        this.prepareInstrumentDestroyForm(this.inlandRemittanceInstrumentDestroyInfo);
    }

    setData(data) {
        this.id = data.id;
        this.inlandRemittanceInstrument = data;
        console.log(data);
    }

    prepareInstrumentDestroyForm(inlandRemittanceInstrumentDestroyInfo: InlandRemittanceInstrumentDestroyInfo) {
        this.instrumentDestroyForm = this.formBuilder.group({
            destroyRemark: [this.inlandRemittanceInstrumentDestroyInfo.destroyRemark,[Validators.required]]
        });
    }

}
