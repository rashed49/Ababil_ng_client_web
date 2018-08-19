import { ApplicationContext } from './../application.context';
import { environment } from './../../environments/environment';
import { filter } from 'rxjs/operators';
import { ComponentCanDeactivate } from './../services/security/refresh-guard.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { OnInit, HostListener } from '@angular/core';
import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from 'angular-spa/auth';
import { LoginSuccessPayload } from '../store/security/security.action';
import { Store } from '@ngrx/store';
//import * as fromRoot from '../store/index';
import * as security from '../store/security/security.action';
import { LoaderOverlayService } from '../common/services/app.loader.overlay.service';


enum MenuOrientation {
    STATIC,
    OVERLAY,
    SLIM,
    HORIZONTAL
};

declare var jQuery: any;

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

    layoutCompact: boolean = true;

    layoutMode: MenuOrientation = MenuOrientation.OVERLAY;

    darkMenu: boolean = false;

    profileMode: string = 'inline';

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    rightPanelActive: boolean;

    rightPanelClick: boolean;

    layoutContainer: HTMLDivElement;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    resetMenu: boolean;

    menuHoverActive: boolean;

    @ViewChild('layoutContainer') layourContainerViewChild: ElementRef;

    @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ElementRef;

    @HostListener('window:beforeunload', ['$event'])
    canDeactivate(event: any) {
        console.log(event);
    }

    @HostListener('contextmenu', ['$event'])
    preventRightClick(event: any) {
        //event.preventDefault();               
    }

    constructor(private applicationContext: ApplicationContext, private location: Location, private route: ActivatedRoute, private loaderOverlayService: LoaderOverlayService, private authService: AuthService, public renderer: Renderer2, private router: Router) {
        router.events.pipe(filter(event => event instanceof NavigationStart)).forEach(e => {
            this.loaderOverlayService.show();
        });

        router.events.pipe(filter(event => event instanceof NavigationEnd)).forEach(e => {
            this.loaderOverlayService.hide();
        });
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.layoutContainer = <HTMLDivElement>this.layourContainerViewChild.nativeElement;
        this.layoutMenuScroller = <HTMLDivElement>this.layoutMenuScrollerViewChild.nativeElement;

        setTimeout(() => {
            jQuery(this.layoutMenuScroller).nanoScroller({ flash: true });
        }, 10);

        if (environment.auth === 'KEYCLOAK') {
            this.loadUserProfile();// consider effects?? not sure            
        } else {
            this.loaderOverlayService.hide();
        }

    }

    loadUserProfile() {
        this.authService.getLoginAccount().subscribe(account => {
            // let logInSuccessPayload: LoginSuccessPayload = {
            //     "userName": account.username,
            //     "authenticated": true
            // };
            //this.store.dispatch({ type: security.LOGIN_SUCCESS, payload: logInSuccessPayload });
            this.applicationContext.setKeyCloakUser(account);
            this.applicationContext.setApplicationContext(
                {
                    userId: account.id,
                    branchId: 7
                }
            )
            this.loaderOverlayService.hide();
        });
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.resetMenu = true;
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        else {
            if (this.isDesktop())
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            else
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if (!this.isHorizontal()) {
            setTimeout(() => {
                jQuery(this.layoutMenuScroller).nanoScroller();
            }, 500);
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item)
            this.activeTopbarItem = null;
        else
            this.activeTopbarItem = item;

        event.preventDefault();
    }

    onRightPanelButtonClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;
        event.preventDefault();
    }

    onRightPanelClick() {
        this.rightPanelClick = true;
    }

    hideOverlayMenu() {
        this.rotateMenuButton = false;
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    isTablet() {
        let width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }

    isSlim() {
        return this.layoutMode === MenuOrientation.SLIM;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }

    changeToSlimMenu() {
        this.layoutMode = MenuOrientation.SLIM;
    }

    ngOnDestroy() {
        jQuery(this.layoutMenuScroller).nanoScroller({ flash: true });
    }

}
