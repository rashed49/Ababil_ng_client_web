import { OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Component, OnInit, ElementRef, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'ababil-webcam',
    templateUrl: 'webcam.component.html',
    styleUrls: ['webcam.component.scss']
})
export class WebCamComponent implements OnInit, OnChanges,OnDestroy {

    nav = <any>navigator;
    streamTrack: MediaStreamTrack;
    options: SelectItem[];

    @ViewChild('video') video: any;

    @Input('show') set show(show: boolean) {
        if (show) {
            this.initializeCamera();
        }
    }
    public videosrc: any;
    public localMediaStream: any;

   
    constructor(private sanitizer: DomSanitizer, private element: ElementRef) {

    }

    ngOnInit() {

    }

    ngOnDestroy(){
        this.stop();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.show) {
            let showCam: boolean = changes.show.currentValue.value;
            showCam ? this.start() : this.stop();
        }       
    }

    private initializeCamera() {
        this.nav.getUserMedia = this.nav.getUserMedia || this.nav.mozGetUserMedia || this.nav.webkitGetUserMedia;

        this.nav.getUserMedia(
            { video: true },
            (stream) => {
                this.localMediaStream = stream;
                this.streamTrack = (<MediaStream>stream).getTracks()[0];
                let webcamUrl = URL.createObjectURL(stream);
                this.videosrc = this.sanitizer.bypassSecurityTrustUrl(webcamUrl);
                this.element.nativeElement.querySelector('video').autoplay = true;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    stop() {
        if (this.streamTrack) {
            this.streamTrack.stop();
        }
    }

    start() {
        this.initializeCamera();
    }

}