import { ApplicationContext } from './application.context';
import { AuthTokenService } from './services/security/auth.token.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-redirect',
  template: `<p>Loading Wait...</p>`,  
  providers: [  
  ],
})
export class AuthRedirectComponent implements OnInit {

   constructor(private applicationContext:ApplicationContext,private route: ActivatedRoute,private router:Router,private authtokenService:AuthTokenService) {    
   
   }
    
   ngOnInit(){
      this.route.queryParams.subscribe(params=>{
          if(params.tokenKey){
              this.getAuthTokenByKeyToken(params.tokenKey);
          }
      });   
   }

   getAuthTokenByKeyToken(key:string){
       let urlQueryMap = new Map();
       urlQueryMap.set("tokenKey",key);
       this.authtokenService.fetchAuthToken(urlQueryMap).subscribe(data=>{
          this.applicationContext.setAuthToken(data);
          let tokenData = JSON.parse(atob(data.access_token.split('.')[1]));
          this.applicationContext.setTokenData(tokenData);
          console.log(tokenData);
          this.router.navigate(['dashboard']);
       });
   }

}