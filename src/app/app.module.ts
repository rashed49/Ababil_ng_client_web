import { RefreshGuard } from './services/security/refresh-guard.service';
import { AuthTokenService } from './services/security/auth.token.service';
import { AuthGuard } from './services/security/auth-guard.service';
import { FourOFourComponent } from './four.o.four.component';
import { AuthRedirectComponent } from './auth.redirect.component';
import { ApplicationContext } from './application.context';
import { LOCALE_ID, NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { Http, HttpModule, XHRBackend } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, Location } from '@angular/common';
import { appRoutes } from './app.routes';
import 'rxjs/add/operator/toPromise';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { getSelectedLanguage } from './common/i18n/translate';
//import { reducer } from './store';
import { StoreModule, Store } from '@ngrx/store';
import { MainModule } from './app-main/main.module';
import { EffectsModule } from '@ngrx/effects';
//import { SecurityApiEffects } from './store/security/effects/service.effects';
//import { SecurityRouteEffects } from './store/security/effects/route.effects';
import { AuthModule, InitOptions } from "angular-spa/auth";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ApiXHRBackend } from './services/api.xhr.backend';
import { GlobalErrorHandler } from './services/global.error.handler';
import { NotificationService } from './common/notification/notification.service';
import { HttpInterceptor } from './services/http.interceptor';
import { PreviousRouteRecorder } from './services/util/previous.route.recorder';
import { environment } from '../environments/environment';
import { CommentsService } from './services/comments/service-api/comments.service';
import { DraftService } from './services/draft/service-api/draft.service';
import { AmountInWordsService } from './common/services/amount.in.words.service';
import { LoaderOverlayService } from './common/services/app.loader.overlay.service';
import { GlAccountDashboardService } from './services/glaccount/service-api/gl.account.dashboard.service';
import { NgSsoGuard, NgSsoService } from './services/security/ngoauth/ngsso.service';
import { ApiPrefixInterceptor } from './services/core/interceptor/api.prefix.interceptor';
import { HttpService } from './services/core/service-api/http.service';
import { ErrorHandlerInterceptor } from './services/core/interceptor/error.handler.interceptor';
import { AuthenticationService } from './services/security/authentication.service';
import { EnvironmentService } from './services/environment/service-api/environment.service';

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        appRoutes,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        }),
        //StoreModule.provideStore(reducer),
        ///StoreDevtoolsModule.instrumentOnlyWithExtension(),
        AuthModule,
        //EffectsModule.run(SecurityApiEffects),
        //EffectsModule.run(SecurityRouteEffects),
    ],
    declarations: [
        AppComponent,
        AuthRedirectComponent,
        FourOFourComponent
    ],
    providers: [
        //{ provide: ErrorHandler, useClass: GlobalErrorHandler, deps: [LoaderOverlayService] },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {
            provide: LOCALE_ID, useFactory: getSelectedLanguage, deps: [TranslateService],
        },
        ApiXHRBackend,
        {
            provide: InitOptions,
            useValue: {
                url: environment.keycloakurl,
                realm: environment.realm,
                clientId: environment.clientId,
            }
        },
        HttpInterceptor,
        ApiPrefixInterceptor,
        {
            provide: HttpClient,
            useClass: HttpService
        },
        ErrorHandlerInterceptor,
        AuthenticationService,
        HttpService,
        NotificationService,
        EnvironmentService,
        PreviousRouteRecorder,
        CommentsService,
        DraftService,
        AmountInWordsService,
        LoaderOverlayService,
        ApplicationContext,
        AuthTokenService,
        AuthGuard,
        RefreshGuard,
        GlAccountDashboardService,
        NgSsoService,
        NgSsoGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
