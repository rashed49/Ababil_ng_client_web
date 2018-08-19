import { ReportConfiguartionService } from './../../../services/report-configuration/service-api/report.configuration.service';
import { environment } from './../../../../environments/environment';
import { HttpInterceptor } from './../../../services/http.interceptor';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../common/components/base.component';
import * as reportConfigurations from '../reports.json';
import get from 'lodash/get';
import { map } from 'rxjs/operators';

@Component({
    selector: 'report-viewer',
    templateUrl: './reports.viewer.component.html'
})
export class ReportViewerComponent extends BaseComponent implements OnInit {

    reportId: number;    
    reportConfiguration: any = { reportFormControls: [] };
    reportForm: FormGroup;
    dropDownValues: Map<string, any[]> = new Map();
    reportUrl: string = environment.reportServiceUrl;
    showParameterForm: boolean = true;
    @ViewChild('pdfIframe') pdfIframe: any;
    reportFileName: string;
    formControlToParameterMap: Map<string, string> = new Map();

    monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];



    constructor(private http: HttpInterceptor,
                private formBuilder: FormBuilder, 
                private renderer: Renderer2, 
                private route: ActivatedRoute, 
                private router: Router,
                private reportConfigurationService:ReportConfiguartionService) {
        super();
    }

    ngOnInit() {
        this.reportForm = this.formBuilder.group({});
        this.subscribers.routeParamSub = this.route.params.subscribe(params => {
            this.reportId = +params['id'];           
            this.fetchReportConfiguration(this.reportId);
        });
    }

    fetchReportConfiguration(id:number){
        this.reportConfigurationService.fetchReportConfiguration({id:id})
          .subscribe(data=>{
              this.reportConfiguration = JSON.parse(data.configuration);
              this.initializeReportForm();
          });
    }


    initializeReportForm() {
        this.reportFileName = this.reportConfiguration.reportFileName;
        this.reportForm = this.formBuilder.group({});
        this.reportConfiguration.reportFormControls.forEach(ctrl => {
            if (ctrl.inputValues.type === 'service') {
                this.dropDownValues.set(ctrl.name, []);
                this.getValuesFromService(ctrl.inputValues.serviceEndpoint).subscribe(data => {
                    let result = ctrl.inputValues.mapper.contentProperty === 'data' ? data : get(data, ctrl.inputValues.mapper.contentProperty);
                    this.dropDownValues.set(ctrl.name, [{ label: "Select ".concat(ctrl.label), value: null }, ...result.map(val => {
                        return { label: this.evaluateLabel(ctrl.inputValues.mapper.label, val), value: get(val, ctrl.inputValues.mapper.value) };
                    })]);
                });
            } else if (ctrl.inputValues.type === 'enum') {
                this.dropDownValues.set(ctrl.name, ctrl.inputValues.values);
            }

            this.reportForm.addControl(ctrl.name, new FormControl(null));
            this.formControlToParameterMap.set(ctrl.name, ctrl.parameterName);
            this.setFormControlValidators(ctrl);

        });

        // this.reportConfiguration.reportFormControls.forEach(ctrl => {
        //     this.setFormControlConditionalValidators(ctrl);
        // });

        this.initializeValueChangeSubscribers();

    }

    evaluateLabel(label: string, val: any) {
        let tokens = label.split("+");
        let resultantLabel = '';
        tokens.forEach(token => {
            if (token.includes("'")) {
                resultantLabel = resultantLabel.concat(token.split("'").join(''));
            } else {
                resultantLabel = resultantLabel.concat(get(val, token));
            }
        });
        return resultantLabel;
    }


    setFormControlValidators(ctrl) {
        if (ctrl.validators.length > 0) {
            let ctrlValidators = [];
            ctrl.validators.forEach(validator => {
                switch (validator.type) {
                    case 'required':
                        ctrlValidators.push(Validators.required);
                        break;
                    case 'pattern':
                        ctrlValidators.push(Validators.pattern(validator.typeValue));
                        break;
                    case 'max':
                        ctrlValidators.push(Validators.max(validator.typeValue));
                        break;
                    case 'min':
                        ctrlValidators.push(Validators.min(validator.typeValue));
                        break;
                    case 'maxlength':
                        ctrlValidators.push(Validators.maxLength(validator.typeValue));
                        break;
                    case 'minlength':
                        ctrlValidators.push(Validators.minLength(validator.typeValue));
                        break;

                }
            });
            this.reportForm.controls[ctrl.name].setValidators(ctrlValidators);
            this.reportForm.updateValueAndValidity();
        }
    }

    setFormControlConditionalValidators(ctrl) {
        //this is too much
        ctrl.conditionalValidators.forEach(validator => {
            this.reportForm.controls[validator.onChange].valueChanges.subscribe(
                value => {
                    let conditionResult = null;
                    let evalFunction = new Function(validator.expression);
                    if (evalFunction.call(this)) {
                        conditionResult = validator.true;
                        console.log(ctrl.name + ": True");
                    } else {
                        conditionResult = validator.false;
                        console.log(ctrl.name + ": False");
                    }
                    conditionResult.enabled ? this.reportForm.controls[ctrl.name].enable() : this.reportForm.controls[ctrl.name].disable();
                    this.reportForm.controls[ctrl.name].enable();
                    this.reportForm.controls[ctrl.name].clearValidators();
                    this.reportForm.controls[ctrl.name].updateValueAndValidity();

                    let conditionalValidators = [];
                    conditionResult.validators.forEach(conditionalValidator => {
                        switch (conditionalValidator.type) {
                            case 'required':
                                conditionalValidators.push(Validators.required);
                                break;
                            case 'pattern':
                                conditionalValidators.push(Validators.pattern(validator.typeValue));
                                break;
                            case 'max':
                                conditionalValidators.push(Validators.max(validator.typeValue));
                                break;
                            case 'min':
                                conditionalValidators.push(Validators.min(validator.typeValue));
                                break;
                            case 'maxlength':
                                conditionalValidators.push(Validators.maxLength(validator.typeValue));
                                break;
                            case 'minlength':
                                conditionalValidators.push(Validators.minLength(validator.typeValue));
                                break;

                        }
                    });
                    this.reportForm.controls[ctrl.name].setValidators(conditionalValidators);
                    this.reportForm.controls[ctrl.name].updateValueAndValidity();

                }
            );
        });
    }


    initializeValueChangeSubscribers() {
        this.reportConfiguration.valueChangeSubscribers.forEach(subscriber => {
            this.reportForm.controls[subscriber.onChange].valueChanges.subscribe(
                value => {
                    subscriber.workers.forEach(worker => {
                        
                        let evalFunction = new Function(worker.expression);
                        let conditionResult = evalFunction.call(this)?worker.true:worker.false;          

                        conditionResult.controlModifiers.forEach(controlModifier => {                            
                            this.reportForm.controls[controlModifier.controlName].clearValidators();
                            this.reportForm.controls[controlModifier.controlName].updateValueAndValidity();

                            let conditionalValidators = [];
                            controlModifier.validators.forEach(conditionalValidator => {
                                switch (conditionalValidator.type) {
                                    case 'required':
                                        conditionalValidators.push(Validators.required);
                                        break;
                                    case 'pattern':
                                        conditionalValidators.push(Validators.pattern(conditionalValidator.typeValue));
                                        break;
                                    case 'max':
                                        conditionalValidators.push(Validators.max(conditionalValidator.typeValue));
                                        break;
                                    case 'min':
                                        conditionalValidators.push(Validators.min(conditionalValidator.typeValue));
                                        break;
                                    case 'maxlength':
                                        conditionalValidators.push(Validators.maxLength(conditionalValidator.typeValue));
                                        break;
                                    case 'minlength':
                                        conditionalValidators.push(Validators.minLength(conditionalValidator.typeValue));
                                        break;
                                }
                            });
                            this.reportForm.controls[controlModifier.controlName].setValidators(conditionalValidators);
                            this.reportForm.controls[controlModifier.controlName].updateValueAndValidity();
                        });
                    });
                }
            );
        });
    }

    showReport() {

        this.markFormGroupAsTouched(this.reportForm);
        if (this.reportForm.invalid) return;

        let url = this.reportUrl + this.reportFileName;
        this.reportConfiguration.reportFormControls.forEach(ctrl => {
            if (this.reportForm.controls[ctrl.name].value != null) {
                url = url.concat("+").concat(this.formControlToParameterMap.get(ctrl.name)).concat("=");
                if (ctrl.inputType === 'date') {
                    if (this.reportForm.controls[ctrl.name].value) {
                        url = url.concat(this.getDateFormattedString(new Date(this.reportForm.controls[ctrl.name].value)));
                    }
                } else {
                    url = url.concat(this.reportForm.controls[ctrl.name].value);
                }
            }

        });
        //window.open(url);
        this.pdfIframe.nativeElement.src = url;
        this.showParameterForm = !this.showParameterForm
    }

    getValuesFromService(endPoint: string) {
        return this.http.get(endPoint)
            .pipe(map(res => {
                return res.text() === '' ? res.status : res.json();
            }));
    }


    getDateFormattedString(date: Date) {
        return date.getDate() + "-" + this.monthNames[date.getMonth()] + "-" + date.getFullYear();
    }

    back() {
        this.router.navigate(['report']);
    }



}
