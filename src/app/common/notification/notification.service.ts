import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


export enum NotificationType {
    SUCCESS, INFO, ALERT, WARN
}

export interface NotificationEvent {
    type: NotificationType,
    title?: string,
    message: string
}

@Injectable()
export class NotificationService {

    constructor(private translate: TranslateService) { }

    private notificationSource = new Subject<NotificationEvent>();

    notifications$ = this.notificationSource.asObservable();

    send(notification: NotificationEvent) {
        this.notificationSource.next(notification);
    }

    sendSuccessMsg(msgKey: string, params?: any) {
        this.translate.get(msgKey).subscribe((msg) => {
            if (params) {
                msg = msg.replace(/{([^{}]*)}/g,
                    function (a, b) {
                        var r = params[b];
                        return typeof r === 'string' || typeof r === 'number' ? r : a;
                    }
                );
            }
            this.send({
                type: NotificationType.SUCCESS,
                title: "Success!",
                message: msg
            })
        });
    }

    sendErrorMsg(msgKey: string, params?: any) {
        this.translate.get(msgKey).subscribe((msg) => {
            if (params) {
                msg = msg.replace(/{([^{}]*)}/g,
                    function (a, b) {
                        var r = params[b];
                        return typeof r === 'string' || typeof r === 'number' ? r : a;
                    }
                );
            }
            this.send({
                type: NotificationType.ALERT,
                title: "Error!",
                message: msg
            })
        });
    }

    //jj init!!hotash.......
    sendSuperErrorMessage(msgKey: string, defaultMsg: string) {
        if (!msgKey) {
            this.send({
                type: NotificationType.ALERT,
                title: "Error!",
                message: "Error code not given."
            });
        } else {
            this.translate.get(msgKey).subscribe((msg) => {
                let msgToShow = "!!!!";
                if (msg == msgKey) {
                    msgToShow = defaultMsg;
                } else {
                    msgToShow = msg;
                }
                this.send({
                    type: NotificationType.ALERT,
                    title: "Error!",
                    message: msgToShow
                });
            });
        }
    }

    sendInfoMsg(msgKey: string, params?: any[]) {
        this.translate.get(msgKey).subscribe((msg) => {
            this.send({
                type: NotificationType.INFO,
                title: "Info!",
                message: msg
            })
        });
    }

    showValidationErrorMessage(errors:any){
        let errorMsg = '';
        errors.forEach(element => {
            errorMsg = errorMsg.concat('*'.concat(element.defaultMessage).concat('\n'));
        }); 

        this.send({
            type: NotificationType.ALERT,
            title: "Validation Error!",
            message: errorMsg
        });
    }

    showDebugMessage(msg:string){
       this.send({
            type: NotificationType.INFO,
            title: "Debug",
            message: msg
       });
    }

    showNetErrorMessage(errors:any){
        this.send({
            type: NotificationType.WARN,
            title: "Warning!",
            message: errors
        });
    }

}

