import {Directive, ElementRef, HostListener, Output, EventEmitter} from '@angular/core';
import * as $ from 'jquery';
import { Renderer2 } from '@angular/core';

@Directive({
 selector: '[enter]'
 })
export class EnterNavigationDirective {
  
   constructor(private el: ElementRef,private renderer2:Renderer2) { 
   }
   
  @HostListener('keyup', ['$event']) onKeyEvent(e: KeyboardEvent) {
    if ((e.which == 13 || e.keyCode == 13)) {
      e.preventDefault();
      let control:any;
      control = e.srcElement.nextElementSibling;
      while (true){                
          if (control) {
            if ((!control.hidden) && 
               (control.nodeName == 'INPUT' || 
                control.nodeName == 'SELECT' || 
                control.nodeName == 'BUTTON' || 
                control.nodeName == 'TEXTAREA'))
               {
                      control.focus();
                      return;
                  }else{
                      control = control.nextElementSibling || control.nextSibling;
                  }                         
          }
          else {
              console.log('close keyboard');
              return;
          }            
      }
  }
  }
  
 
}