import { LoaderOverlayService } from './../common/services/app.loader.overlay.service';
import {Injectable, ErrorHandler} from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

   constructor(private overlayService:LoaderOverlayService) {
   }

   handleError(error: Error) {
       this.overlayService.hide();  
       //throw error;           
   }
}
