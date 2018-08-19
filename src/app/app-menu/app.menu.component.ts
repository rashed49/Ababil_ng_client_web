import { deploymentBranchMenus, developmentBranchMenus } from './app.menu.models';
import { environment } from './../../environments/environment';
import { Component, Input, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { MainComponent } from '../app-main/main.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];
    favorites: any[];

    constructor(public app: MainComponent, private translate: TranslateService) { }

    ngOnInit() {
        
        this.model = (environment.auth==='LEGACY-ABABIL')?deploymentBranchMenus:developmentBranchMenus;
        
        this.favorites = [
            { label: 'Dashboard', icon: 'dashboard', routerLink: ['/'] },
            {
                label: 'Themes', icon: 'palette', badge: '6',
                items: [
                    { label: 'Indigo - Pink', icon: 'brush', command: (event) => { this.changeTheme('indigo') } },
                    { label: 'Brown - Green', icon: 'brush', command: (event) => { this.changeTheme('brown') } },
                    { label: 'Blue - Amber', icon: 'brush', command: (event) => { this.changeTheme('blue') } },
                    { label: 'Blue Grey - Green', icon: 'brush', command: (event) => { this.changeTheme('blue-grey') } },
                    { label: 'Dark - Blue', icon: 'brush', command: (event) => { this.changeTheme('dark-blue') } },
                    { label: 'Dark - Green', icon: 'brush', command: (event) => { this.changeTheme('dark-green') } },
                    { label: 'Green - Yellow', icon: 'brush', command: (event) => { this.changeTheme('green') } },
                    { label: 'Purple - Cyan', icon: 'brush', command: (event) => { this.changeTheme('purple-cyan') } },
                    { label: 'Purple - Amber', icon: 'brush', command: (event) => { this.changeTheme('purple-amber') } },
                    { label: 'Teal - Lime', icon: 'brush', command: (event) => { this.changeTheme('teal') } },
                    { label: 'Cyan - Amber', icon: 'brush', command: (event) => { this.changeTheme('cyan') } },
                    { label: 'Grey - Deep Orange', icon: 'brush', command: (event) => { this.changeTheme('grey') } }
                ]
            }
        ];
    }

    changeTheme(theme) {
        let themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        let layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');

        themeLink.href = 'assets/theme/theme-' + theme + '.css';
        layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
    }
}

@Component({
    selector: '[app-submenu]',
    templateUrl: './app.sub.menu.component.html',
    animations: [
        trigger('children', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*'
            })),
            state('hidden', style({
                height: '0px'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenu {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    _reset: boolean;

    activeIndex: number;

    constructor(public app: MainComponent, private translate: TranslateService) { }

    itemClick(event: Event, item: MenuItem, index: number) {
        if (this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }

        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        //activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        //prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }

        //hide menu
        if (!item.items) {
            this.app.overlayMenuActive = false;
            this.app.staticMenuMobileActive = false;
            this.app.menuHoverActive = !this.app.menuHoverActive;
            if (this.app.isHorizontal() || this.app.isSlim())
                this.app.resetMenu = true;
            else
                this.app.resetMenu = false;



        }
    }

    onMouseEnter(index: number) {
        if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = index;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;

        if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = null;
        }
    }
}