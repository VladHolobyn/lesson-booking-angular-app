import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {computed, inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class ResponsiveService {

  breakpointObserver = inject(BreakpointObserver)

  screenSizeSignal = toSignal(this.breakpointObserver.observe([
    Breakpoints.Handset, Breakpoints.Tablet, '(max-width: 1023px)'
  ]))

  isPhoneScreen = computed(() => this.screenSizeSignal()?.breakpoints[Breakpoints.HandsetPortrait]);

  isTabletScreen = computed(() => this.screenSizeSignal()?.breakpoints[Breakpoints.TabletPortrait]);

  isPhoneOrTabletScreen = computed(() => this.isPhoneScreen() || this.isTabletScreen())
}
