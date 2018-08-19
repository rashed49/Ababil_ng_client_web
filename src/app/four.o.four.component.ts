import { environment } from './../environments/environment';
import { ApplicationContext } from './application.context';
import { AuthTokenService } from './services/security/auth.token.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'four-o-four',
  template: ` 
                  <div style="width: 100%;margin-top:100px;">
                      <h1 style="text-align: center;">{{msgHeader}}</h1>
                      <h3 style="text-align: center;">{{msgBody}}</h3>                     
                  </div>
            `,  
  providers: [  
  ],
})
export class FourOFourComponent implements OnInit {
   
   msgHeader:string = '';
   msgBody:string = '';

   constructor(private route: ActivatedRoute,private router:Router) {  
   
   }
    
   ngOnInit(){
       this.delay();   
   }

   
   delay(){
      setTimeout(()=>{
         this.msgHeader = "Unauthorized."
         this.msgBody = "Session will be invalidated if you close your browser, close your tab or refresh page."
      }, 500)
   }

   

}