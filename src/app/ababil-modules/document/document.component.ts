import { Document ,Properties, DocumentPropertyType,DocumentType} from './../../services/document/domain/document.models';
import { NotificationService } from './../../common/notification/notification.service';
import { BaseComponent } from './../../common/components/base.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DocumentService } from '../../services/document/service-api/document.service';
import { Response } from '@angular/http';

  class DocumentForm {
    name: string;
    detail: string;
    formGroup: FormGroup;
    properties: Properties[];
    doc: Document
  }
  
  @Component({
    selector: 'doc-component',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss']
  
  })
  export class DocumentComponent extends BaseComponent {
  
    document: Document;
 
    addressForm: FormGroup;
    
    @Input('document') set setdocument(document: Document) {
          this.initForm(document);
    };
 
  
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
    documentType=new DocumentType();
    formgroupSet: DocumentForm[] = [];
    resultantFormGroupSet: DocumentForm[] = [];
    formgroupMap: Map<string, FormGroup> = new Map();
    docFileUrls: string[];
    showImagePreview: boolean = false;
    showPdfPreview: boolean = false;
    pdfUrl: any;
  
    @ViewChild('pdfIframe') pdfIframe: any;
    @ViewChild('fileUploader') fileUploader: any;
  
    profileCode: number;
    clientId: number;
    previewFile: string = "";
    routeBack:string = "";
  
    ngOnInit() {
  
      this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(params => {
          this.profileCode =  params['profileCode'];
          this.clientId = params['clientId'];
          this.routeBack = params['docRouteBack'];
          this.fetchDocument();
      });
      //this.profileCode = 101; // profile code like customer or signatory etc
      //this.clientId = 1;    //client id is customer id
      
    }
  
    fetchDocument() {
      let urlQueryParamMap = new Map();
      urlQueryParamMap.set("profileCode", "101");
      this.subscribers.fetchSub = this.documentService.fetchDocument(urlQueryParamMap)
        .subscribe(type => {
          this.formgroupSet = [];
          this.documentTypes = type;
          this.documentTypes.forEach(type => {
            this.initForm(type);
          });
          this.resultantFormGroupSet = [...this.formgroupSet];
          //this.fetchDocumentFileUrls();
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
          doc: document
        });
      this.formgroupMap.set(document.documentType.name, formGroup);
    }
  
  
    extractFormData(entryKey) {
      let element: DocumentForm = this.resultantFormGroupSet.filter(elm => {
        return elm.name == entryKey
      })[0];
      let docWithValue = element.doc;
      docWithValue.properties.forEach(prop => {
        for (let key in element.formGroup.controls) {
          if (prop.documentPropertyType.id  == +key) {
            prop.propertyValue = element.formGroup.controls[key].value;
          }
        }
      });
  
      // let urlQueryParamMap = new Map();
      // urlQueryParamMap.set("clientId", this.clientId);
      // this.documentService.saveDocument( element.doc, urlQueryParamMap).subscribe(
      //   data => {
      //     this.notificationService.sendSuccessMsg("document.createtion.success");
      //     this.fetchDocumentTypes();
      //   }
      // );
    }
  
    // onFileUpload(event, id) {
    //   let urlQueryParamMap = new Map();
  
    //   switch (event.files[0].type) {
    //     case 'image/png':
    //       urlQueryParamMap.set("fileType", "PNG");
    //       break;
    //     case 'text/plain':
    //       urlQueryParamMap.set("fileType", "TXT");
    //       break;
    //     case 'application/pdf':
    //       urlQueryParamMap.set("fileType", "PDF");
    //       break;
    //     case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    //       urlQueryParamMap.set("fileType", "DOCX");
    //       break;
    //     case 'application/msword':
    //       urlQueryParamMap.set("fileType", "DOC");
    //       break;
    //     case 'text/csv':
    //       urlQueryParamMap.set("fileType", "CSV");
    //       break;
    //     case 'application/mp4':
    //       urlQueryParamMap.set("fileType", "MP4");
    //       break;
    //     case 'video/mp4':
    //       urlQueryParamMap.set("fileType", "MP4");
    //       break;
    //     default:
    //       urlQueryParamMap.set("fileType", "JPG");
    //       break;
    //   }
  
  
    //   console.log(event.files[0]);
    //   this.documentService.uploadDocumentFile(event.files[0], { documentId: id }, urlQueryParamMap).subscribe(
    //     data => {
    //       this.notificationService.sendSuccessMsg("image.upload.success");
    //       this.fetchDocumentTypes();
    //       this.fileUploader.clear();
    //     }
    //   );
    // }
  
    // fetchDocumentFileUrls() {
    //   this.documentService.fetchDocumentFileUrls({ documentId: this.clientId }).subscribe(
    //     data => {
    //       this.docFileUrls = data;
    //       console.log(data);
    //     }
    //   );
    // }
  
    // onFileClick(fileName) {
    //   if (fileName.includes("JPG") || fileName.includes("PNG")) {
    //     this.showImagePreview = true;
    //     this.showPdfPreview = false;
    //   } else if (fileName.includes("PDF")) {
    //     this.showImagePreview = false;
    //     this.showPdfPreview = true;
    //     this.pdfIframe.nativeElement.src = 'http://172.16.215.22:8081/document/url?url=' + fileName;
    //   }
  
    //   this.previewFile = fileName;
    //   console.log(fileName);
    // }
  
    // deleteDocumentUrl() {
    //   let urlQueryParamMap = new Map();
    //   urlQueryParamMap.set("url", this.previewFile);
    //   this.subscribers.deleteDocumentSub = this.documentService.deleteDocumentFileUrl(urlQueryParamMap)
    //     .subscribe(data => {
    //       this.showImagePreview = false;
    //       this.showPdfPreview = false;
    //       this.fetchDocumentTypes();
    //       this.notificationService.sendSuccessMsg("document.delete.success");
    //     });
    // }
  
    cancel(){
        this.router.navigate([this.routeBack],{
             queryParamsHandling: 'merge'
        }); 
    }
  

}








