/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-rotate-page/pdf-rotate-page.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { PDFNotificationService } from './../../pdf-notification-service';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
export class PdfRotatePageComponent {
    /**
     * @param {?} notificationService
     */
    constructor(notificationService) {
        this.notificationService = notificationService;
        this.showRotateButton = true;
        this.disableRotate = true;
        this.clockwise = true;
        this.counterClockwise = true;
        /** @type {?} */
        const subscription = this.notificationService.onPDFJSInit.subscribe((/**
         * @return {?}
         */
        () => {
            this.onPdfJsInit();
            subscription.unsubscribe();
        }));
    }
    /**
     * @return {?}
     */
    rotateCW() {
        /** @type {?} */
        const PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.dispatch('rotatecw');
    }
    /**
     * @return {?}
     */
    rotateCCW() {
        /** @type {?} */
        const PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.dispatch('rotateccw');
    }
    /**
     * @return {?}
     */
    onPdfJsInit() {
        /** @type {?} */
        const PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.on('updateuistate', (/**
         * @param {?} event
         * @return {?}
         */
        (event) => this.updateUIState(event)));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateUIState(event) {
        this.disableRotate = event.pagesCount === 0;
        if (this.button1) {
            this.button1.nativeElement.disabled = this.disableRotate;
        }
        if (this.button2) {
            this.button2.nativeElement.disabled = this.disableRotate;
        }
    }
}
PdfRotatePageComponent.decorators = [
    { type: Component, args: [{
                selector: 'pdf-rotate-page',
                template: "<button\n  *ngIf=\"clockwise\"\n  (click)=\"rotateCW()\"\n  type=\"button\"\n  [class.invisible]=\"!showRotateButton\"\n  id=\"primaryPageRotateCw\"\n  class=\"toolbarButton hiddenXLView rotateCw\"\n  title=\"Rotate Clockwise\"\n  data-l10n-id=\"page_rotate_cw\"\n  [disabled]=\"disableRotate\"\n  #button1>\n    <svg style=\"width:23px;height:23px\" viewBox=\"0 0 24 24\">\n      <path fill=\"currentColor\" d=\"M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C14 21 15.92 20.34 17.5 19.14L16.06 17.7C14.87 18.54 13.45 19 12 19C8.13 19 5 15.87 5 12S8.13 5 12 5 19 8.13 19 12H16L20 16L24 12H21C21 7.03 16.97 3 12 3\" />\n    </svg>\n</button>\n<button\n  *ngIf=\"counterClockwise\"\n  (click)=\"rotateCCW()\"\n  type=\"button\"\n  [class.invisible]=\"!showRotateButton\"\n  id=\"primaryPageRotateCcw\"\n  class=\"toolbarButton hiddenXLView rotateCcw\"\n  title=\"Rotate Counterclockwise\"\n  data-l10n-id=\"page_rotate_ccw\"\n  [disabled]=\"disableRotate\"\n  #button2>\n    <svg style=\"width:23px;height:23px\" viewBox=\"0 0 24 24\">\n      <path fill=\"currentColor\" d=\"M12 3C7.03 3 3 7.03 3 12H0L4 16L8 12H5C5 8.13 8.13 5 12 5S19 8.13 19 12 15.87 19 12 19C10.55 19 9.13 18.54 7.94 17.7L6.5 19.14C8.08 20.34 10 21 12 21C16.97 21 21 16.97 21 12S16.97 3 12 3\" />\n    </svg>\n</button>\n",
                styles: [":host{margin-top:-1px}:host:focus{outline:0}button:focus,svg:focus{outline:0}"]
            }] }
];
/** @nocollapse */
PdfRotatePageComponent.ctorParameters = () => [
    { type: PDFNotificationService }
];
PdfRotatePageComponent.propDecorators = {
    showRotateButton: [{ type: Input }],
    clockwise: [{ type: Input }],
    counterClockwise: [{ type: Input }],
    button1: [{ type: ViewChild, args: ['button1',] }],
    button2: [{ type: ViewChild, args: ['button2',] }]
};
if (false) {
    /** @type {?} */
    PdfRotatePageComponent.prototype.showRotateButton;
    /** @type {?} */
    PdfRotatePageComponent.prototype.disableRotate;
    /** @type {?} */
    PdfRotatePageComponent.prototype.clockwise;
    /** @type {?} */
    PdfRotatePageComponent.prototype.counterClockwise;
    /**
     * @type {?}
     * @private
     */
    PdfRotatePageComponent.prototype.button1;
    /**
     * @type {?}
     * @private
     */
    PdfRotatePageComponent.prototype.button2;
    /**
     * @type {?}
     * @private
     */
    PdfRotatePageComponent.prototype.notificationService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXJvdGF0ZS1wYWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1leHRlbmRlZC1wZGYtdmlld2VyLyIsInNvdXJjZXMiOlsibGliL3Rvb2xiYXIvcGRmLXJvdGF0ZS1wYWdlL3BkZi1yb3RhdGUtcGFnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBU3hFLE1BQU0sT0FBTyxzQkFBc0I7Ozs7SUFrQmpDLFlBQW9CLG1CQUEyQztRQUEzQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXdCO1FBaEJ4RCxxQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFFeEIsa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFHckIsY0FBUyxHQUFHLElBQUksQ0FBQztRQUdqQixxQkFBZ0IsR0FBRyxJQUFJLENBQUM7O2NBU3ZCLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRTtZQUN2RSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzdCLENBQUMsRUFBQztJQUNKLENBQUM7Ozs7SUFFTSxRQUFROztjQUNQLG9CQUFvQixHQUEwQixDQUFDLG1CQUFBLE1BQU0sRUFBTyxDQUFDLENBQUMsb0JBQW9CO1FBQ3hGLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckQsQ0FBQzs7OztJQUVNLFNBQVM7O2NBQ1Isb0JBQW9CLEdBQTBCLENBQUMsbUJBQUEsTUFBTSxFQUFPLENBQUMsQ0FBQyxvQkFBb0I7UUFDeEYsb0JBQW9CLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RCxDQUFDOzs7O0lBR00sV0FBVzs7Y0FDVixvQkFBb0IsR0FBMEIsQ0FBQyxtQkFBQSxNQUFNLEVBQU8sQ0FBQyxDQUFDLG9CQUFvQjtRQUN4RixvQkFBb0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGVBQWU7Ozs7UUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDO0lBQzFGLENBQUM7Ozs7O0lBRU0sYUFBYSxDQUFDLEtBQXlCO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1NBQzFEO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1NBQzFEO0lBQ0gsQ0FBQzs7O1lBdERGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQiw2d0NBQStDOzthQUVoRDs7OztZQVRRLHNCQUFzQjs7OytCQVc1QixLQUFLO3dCQUtMLEtBQUs7K0JBR0wsS0FBSztzQkFHTCxTQUFTLFNBQUMsU0FBUztzQkFHbkIsU0FBUyxTQUFDLFNBQVM7Ozs7SUFkcEIsa0RBQytCOztJQUUvQiwrQ0FBNEI7O0lBRTVCLDJDQUN3Qjs7SUFFeEIsa0RBQytCOzs7OztJQUUvQix5Q0FDK0M7Ozs7O0lBRS9DLHlDQUMrQzs7Ozs7SUFFbkMscURBQW1EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUERGTm90aWZpY2F0aW9uU2VydmljZSB9IGZyb20gJy4vLi4vLi4vcGRmLW5vdGlmaWNhdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSVBERlZpZXdlckFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vLi4vb3B0aW9ucy9wZGYtdmlld2VyLWFwcGxpY2F0aW9uJztcbmltcG9ydCB7IFVwZGF0ZVVJU3RhdGVFdmVudCB9IGZyb20gJy4uLy4uL2V2ZW50cy91cGRhdGUtdWktc3RhdGUtZXZlbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtcm90YXRlLXBhZ2UnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLXJvdGF0ZS1wYWdlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGRmLXJvdGF0ZS1wYWdlLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBQZGZSb3RhdGVQYWdlQ29tcG9uZW50ICB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93Um90YXRlQnV0dG9uID0gdHJ1ZTtcblxuICBwdWJsaWMgZGlzYWJsZVJvdGF0ZSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGNsb2Nrd2lzZSA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGNvdW50ZXJDbG9ja3dpc2UgPSB0cnVlO1xuXG4gIEBWaWV3Q2hpbGQoJ2J1dHRvbjEnKVxuICBwcml2YXRlIGJ1dHRvbjE6IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuXG4gIEBWaWV3Q2hpbGQoJ2J1dHRvbjInKVxuICBwcml2YXRlIGJ1dHRvbjI6IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbm90aWZpY2F0aW9uU2VydmljZTogUERGTm90aWZpY2F0aW9uU2VydmljZSkge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHRoaXMubm90aWZpY2F0aW9uU2VydmljZS5vblBERkpTSW5pdC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5vblBkZkpzSW5pdCgpO1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcm90YXRlQ1coKTogdm9pZCB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5kaXNwYXRjaCgncm90YXRlY3cnKTtcbiAgfVxuXG4gIHB1YmxpYyByb3RhdGVDQ1coKTogdm9pZCB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5kaXNwYXRjaCgncm90YXRlY2N3Jyk7XG4gIH1cblxuXG4gIHB1YmxpYyBvblBkZkpzSW5pdCgpOiB2b2lkIHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKHdpbmRvdyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCd1cGRhdGV1aXN0YXRlJywgKGV2ZW50KSA9PiB0aGlzLnVwZGF0ZVVJU3RhdGUoZXZlbnQpKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVVSVN0YXRlKGV2ZW50OiBVcGRhdGVVSVN0YXRlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVSb3RhdGUgPSBldmVudC5wYWdlc0NvdW50ID09PSAwO1xuICAgIGlmICh0aGlzLmJ1dHRvbjEpIHtcbiAgICAgIHRoaXMuYnV0dG9uMS5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gdGhpcy5kaXNhYmxlUm90YXRlO1xuICAgIH1cbiAgICBpZiAodGhpcy5idXR0b24yKSB7XG4gICAgICB0aGlzLmJ1dHRvbjIubmF0aXZlRWxlbWVudC5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZVJvdGF0ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==