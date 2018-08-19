import { Component, SimpleChanges, OnChanges, Output, EventEmitter, ViewChild } from "@angular/core";
import { NotificationService } from './../../notification/notification.service';
import { MatTabChangeEvent } from "@angular/material/tabs";


@Component({
    selector: 'ababil-image-upload',
    templateUrl: 'image.upload.component.html',
    styleUrls: ['./image.upload.component.scss']
})
export class ImageUploadComponent implements OnChanges {

    show: boolean = false;
    hideTabGroup: boolean = false;
    showCropper: boolean = false;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    imageBase64: string = '';
    optionWebcam: boolean = false;
    imageUrl: string;

    @Output('onDone') onDone = new EventEmitter<string>();
    @ViewChild('webcam') webcam: any;
    @ViewChild('canvas') canvas: any;
    @ViewChild('tabGroup') tabGroup;

    constructor(private notificationService: NotificationService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.show) {
            this.show = changes.show.currentValue.value;
        }
    }

    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        if (tabChangeEvent.index != 1 && this.optionWebcam) {
            this.webcam.stop();
            this.optionWebcam = false;
        }
    }

    hideModal() {
        this.show = false;
        this.hideTabGroup = false;
        this.croppedImage = '';
        this.imageChangedEvent = null;
        this.showCropper = false;
        this.optionWebcam = false;
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(image: string) {
        this.croppedImage = image;
    }

    imageLoaded() {
        this.hideTabGroup = true;
        this.showCropper = true;
    }

    loadImageFailed() {
        this.notificationService.sendErrorMsg("invalid.image.format");
    }

    done() {
        this.onDone.emit(this.croppedImage);
        this.hideModal();
    }

    runWebcam() {
        this.optionWebcam = true;
    }

    capture() {
        let video = this.webcam.video;
        this.canvas.nativeElement.getContext("2d").drawImage(video.nativeElement, 0, 0, video.nativeElement.offsetWidth, video.nativeElement.offsetHeight);
        let imgUrl = this.canvas.nativeElement.toDataURL("image/jpeg");
        this.webcam.stop();
        this.imageUrl = imgUrl;
    }
}