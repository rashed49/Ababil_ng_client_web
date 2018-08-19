import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { element } from 'protractor';
import { Response } from '@angular/http';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Document, DocumentType,Properties, DocumentPropertyType } from '../../../../services/document/domain/document.models';
import { BaseComponent } from '../../../../common/components/base.component';
import { DocumentService } from '../../../../services/document/service-api/document.service';
import { NotificationService } from '../../../../common/notification/notification.service';
import { environment } from '../../../../index';

class DocumentForm {
  name: string;
  detail: string;
  formGroup: FormGroup;
  properties: Properties[];
  doc: Document;
  id: string;
}

@Component({
  selector: 'document-view-component',
  templateUrl: './document.view.component.html',
  styleUrls: ['./document.view.component.scss']

})
export class DocumentViewComponent extends BaseComponent implements OnInit,OnChanges {

  @Input('profileCode') profileCode: string;
  @Input('clientId') clientId: string;


  constructor(private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder) {
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

  fetchDocument(urlQueryParamMap1?: Map<string, string>) {
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
        // this.fetchDocumentFileUrls();
        console.log(this.resultantFormGroupSet);
      });
  }


  initForm(document: Document) {
    let formGroup: FormGroup = this.formBuilder.group({});
    document.properties.forEach(prop => {
      if (prop.documentPropertyType.propertyDataType == 'Text') {
        formGroup.addControl(prop.documentPropertyType.id + "", new FormControl(prop.propertyValue));
      } else if (prop.documentPropertyType.propertyDataType == 'Date') {
        formGroup.addControl(prop.documentPropertyType.id + "", new FormControl(prop.propertyValue ? new Date(prop.propertyValue) : null));
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

  // onFileUpload(event,fromGroupEntry, index) {
  //   let urlQueryParamMap = new Map();
  //   urlQueryParamMap.set("temporary", true);
  //   this.fileType = null;
  //   switch (event.files[0].type) {
  //     case 'image/png':
  //       urlQueryParamMap.set("fileType", "PNG");
  //       this.fileType = "PNG";
  //       break;
  //     case 'text/plain':
  //       urlQueryParamMap.set("fileType", "TXT");
  //       this.fileType = "TXT";
  //       break;
  //     case 'application/pdf':
  //       urlQueryParamMap.set("fileType", "PDF");
  //       this.fileType = "PDF";
  //       break;
  //     case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
  //       urlQueryParamMap.set("fileType", "DOCX");
  //       this.fileType = "DOCX";
  //       break;
  //     case 'application/msword':
  //       urlQueryParamMap.set("fileType", "DOC");
  //       this.fileType = "DOC";
  //       break;
  //     case 'text/csv':
  //       urlQueryParamMap.set("fileType", "CSV");
  //       this.fileType = "CSV";
  //       break;
  //     case 'application/mp4':
  //       urlQueryParamMap.set("fileType", "MP4");
  //       this.fileType = "MP4";
  //       break;
  //     case 'video/mp4':
  //       urlQueryParamMap.set("fileType", "MP4");
  //       this.fileType = "MP4";
  //       break;
  //     default:
  //       urlQueryParamMap.set("fileType", "JPG");
  //       this.fileType = "JPG";
  //       break;
  //   }

  //   console.log(event.files[0]);
  //   this.documentService.uploadDocumentFile(event.files[0], urlQueryParamMap).subscribe(
  //     data => {
  //       this.notificationService.sendSuccessMsg("doc.upload.success");
  //       this.resultantFormGroupSet[index].doc.files.push({id: data.content, type:this.fileType});
  //       this.fileUploader.clear();
  //     }
  //   );
  // }

  onFileClick(file) {
    this.selectedFile=file;
    if (file.type.includes("JPG") || file.type.includes("PNG")) {
      this.showImagePreview = true;
      this.showPdfPreview = false;
    } else if (file.type.includes("PDF")){
      this.showImagePreview = false;
      this.showPdfPreview = true;
      this.pdfIframe.nativeElement.src = this.serviceUrl+'/api/documents/0/files/'+file.id; 
    }
  }

  cancel() {
    this.router.navigate([this.routeBack], {
      queryParamsHandling: 'merge'
    });
  }

}

