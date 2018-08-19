import { environment } from './../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../notification/notification.service';
import { DocumentService } from '../../../services/document/service-api/document.service';
import { Document, DocumentType, Properties, DocumentPropertyType } from '../../../services/document/domain/document.models';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

class DocumentForm {
  name: string;
  detail: string;
  formGroup: FormGroup;
  properties: Properties[];
  doc: Document;
  id: string;
}

@Component({
  selector: 'document-component',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']

})
export class DocumentComponent extends BaseComponent implements OnInit,OnChanges {

  addressForm: FormGroup = new FormGroup({});

  @Input('profileCode') profileCode: string;
  @Input('clientId') clientId: string;
  @Input ('documents') documents : Document[];

  constructor(private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer) {
    super();
  }

  documentTypes: Document[] = [];
  properties: Properties[] = [];
  documentPropertyType = new DocumentPropertyType();
  documentType = new DocumentType();
  formgroupSet: DocumentForm[] = [];
  resultantFormGroupSet: DocumentForm[] = [];
  formgroupMap: Map<string, FormGroup> = new Map();
  docFileUrls: string[];
  showImagePreview: boolean = false;
  showPdfPreview: boolean = false;
  pdfUrl: any;
  serviceUrl:string = environment.serviceapiurl;
  fileIndex:number;
  fromGroupEntryIndex:number;

  @ViewChild('pdfIframe') pdfIframe: any;
  @ViewChild('fileUploader') fileUploader: any;

  previewFile: string = "";
  routeBack: string = "";
  content: any;
  fileType: string = '';
  selectedFile:any=null;

  ngOnInit() {
    this.fetchDocument();
  }

  ngOnChanges(changes:SimpleChanges){
      if(changes.clientId && changes.clientId.currentValue){
          this.fetchDocument();
      }  
  }

  fetchDocument() {
    let urlQueryParamMap = new Map();
     urlQueryParamMap.set("profileCode", this.profileCode);
    if (this.clientId) urlQueryParamMap.set("clientId", this.clientId);

    this.subscribers.fetchSub = this.documentService.fetchDocument(urlQueryParamMap)
      .subscribe(type => {
        this.formgroupSet = [];
        this.documentTypes = type;
        this.documentTypes.forEach(type => {
          this.initForm(type);
        });
        this.resultantFormGroupSet = [...this.formgroupSet];
      });
  }


  initForm(document: Document) {
    let formGroup: FormGroup = this.formBuilder.group({});
    document.properties.forEach(prop => {
      let controlName = prop.documentPropertyType.id + ""; //?? 
      if (prop.documentPropertyType.propertyDataType == 'Text') {
        formGroup.addControl(controlName, new FormControl(prop.propertyValue));
      } else if (prop.documentPropertyType.propertyDataType == 'Date') {
        formGroup.addControl(controlName, new FormControl(prop.propertyValue ? new Date(prop.propertyValue) : null));
      }

      if(prop.documentPropertyType.mandatory){
        formGroup.controls[controlName].setValidators([Validators.required]);
        formGroup.updateValueAndValidity();
      }
    });

    this.formgroupSet.push(
      {
        name: document.documentType.name,
        detail: document.verificationDetails,
        formGroup: formGroup,
        properties: document.properties,
        doc: document,
        id: document.documentType.id + ''
      });
    this.formgroupMap.set(document.documentType.id + "", formGroup);
  }

  public extractFormData() {
    let data = [];
    this.resultantFormGroupSet.forEach(formGroup => {
      let value = (this.formgroupMap.get(formGroup.id)).value;
      for (let key in value) {
        formGroup.doc.properties.map(prop => {
          if (prop.documentPropertyType.id === +key) {
            prop.propertyValue = value[key];
          }
          return prop;
        });
      }
      let documentObject = new Document();
      documentObject = formGroup.doc;
      documentObject.profileCode = this.profileCode;
      data.push(formGroup.doc);
    });
    return data;
  }

  onFileUpload(event,index) {
    let urlQueryParamMap = new Map();
    urlQueryParamMap.set("temporary", true);
    this.fileType = null;
    switch (event.files[0].type) {
      case 'image/png':
        urlQueryParamMap.set("fileType", "PNG");
        this.fileType = "PNG";
        break;
      case 'text/plain':
        urlQueryParamMap.set("fileType", "TXT");
        this.fileType = "TXT";
        break;
      case 'application/pdf':
        urlQueryParamMap.set("fileType", "PDF");
        this.fileType = "PDF";
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        urlQueryParamMap.set("fileType", "DOCX");
        this.fileType = "DOCX";
        break;
      case 'application/msword':
        urlQueryParamMap.set("fileType", "DOC");
        this.fileType = "DOC";
        break;
      case 'text/csv':
        urlQueryParamMap.set("fileType", "CSV");
        this.fileType = "CSV";
        break;
      case 'application/mp4':
        urlQueryParamMap.set("fileType", "MP4");
        this.fileType = "MP4";
        break;
      case 'video/mp4':
        urlQueryParamMap.set("fileType", "MP4");
        this.fileType = "MP4";
        break;
      default:
        urlQueryParamMap.set("fileType", "JPG");
        this.fileType = "JPG";
        break;
    }

    console.log(event.files[0]);
    this.documentService.uploadDocumentFile(event.files[0], urlQueryParamMap).subscribe(
      data => {
        this.notificationService.sendSuccessMsg("doc.upload.success");
        this.resultantFormGroupSet[index].doc.files.push({id: data.content, type:this.fileType});
        this.fileUploader.clear();
      }
    );
  }

  onFileClick(file,fileIndex,index) {
    this.selectedFile = file;
    this.fileIndex = fileIndex;
    this.fromGroupEntryIndex = index;
    if (file.type.includes("PDF")){
      this.showImagePreview = false;
      this.showPdfPreview = true;
      this.pdfIframe.nativeElement.src = this.serviceUrl+'/documents/0/files/'+file.id; 
    }else{
      this.showImagePreview = true;
      this.showPdfPreview = false;
    }
  }

  cancel() {
    this.router.navigate([this.routeBack], {
      queryParamsHandling: 'merge'
    });
  }

  deleteDocument(){   
      this.resultantFormGroupSet[this.fromGroupEntryIndex].doc.files.splice(this.fileIndex,1);
      this.showImagePreview = false;
      this.showPdfPreview = false;    
  }

  public markDocumentFormsAsTouched(){
    this.formgroupMap.forEach(function(value, key) {
      (<any>Object).values(value.controls).forEach(control => {
        control.markAsDirty();
        if (control.controls) {
          control.controls.forEach(ctrl => this.markFormGroupAsTouched(ctrl));
        }
      });
    });
  }

  public isFormInvalid(){
    this.formgroupMap.forEach(function(value, key) {
      if(value.invalid){
        return true;
      }
    });
    return false;
  }


  getFileExtensionByType(type){
    switch (type) {
       case 'PDF':
          return 'pdf';
          
       case 'PNG':
          return 'png';
          
       case 'JPG':
          return 'jpg';
          
       case 'DOCX':
          return 'docx';
          
       case 'DOC':
          return 'doc';
          
       case 'CSV':
          return 'csv';
          
       case 'MP4':
          return 'mp4';
          
       default: 
          return 'txt';   
    }

  }

}

