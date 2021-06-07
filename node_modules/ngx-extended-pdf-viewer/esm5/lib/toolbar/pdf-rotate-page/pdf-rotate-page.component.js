/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-rotate-page/pdf-rotate-page.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { PDFNotificationService } from './../../pdf-notification-service';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
var PdfRotatePageComponent = /** @class */ (function () {
    function PdfRotatePageComponent(notificationService) {
        var _this = this;
        this.notificationService = notificationService;
        this.showRotateButton = true;
        this.disableRotate = true;
        this.clockwise = true;
        this.counterClockwise = true;
        /** @type {?} */
        var subscription = this.notificationService.onPDFJSInit.subscribe((/**
         * @return {?}
         */
        function () {
            _this.onPdfJsInit();
            subscription.unsubscribe();
        }));
    }
    /**
     * @return {?}
     */
    PdfRotatePageComponent.prototype.rotateCW = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.dispatch('rotatecw');
    };
    /**
     * @return {?}
     */
    PdfRotatePageComponent.prototype.rotateCCW = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.dispatch('rotateccw');
    };
    /**
     * @return {?}
     */
    PdfRotatePageComponent.prototype.onPdfJsInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.on('updateuistate', (/**
         * @param {?} event
         * @return {?}
         */
        function (event) { return _this.updateUIState(event); }));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    PdfRotatePageComponent.prototype.updateUIState = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.disableRotate = event.pagesCount === 0;
        if (this.button1) {
            this.button1.nativeElement.disabled = this.disableRotate;
        }
        if (this.button2) {
            this.button2.nativeElement.disabled = this.disableRotate;
        }
    };
    PdfRotatePageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pdf-rotate-page',
                    template: "<button\n  *ngIf=\"clockwise\"\n  (click)=\"rotateCW()\"\n  type=\"button\"\n  [class.invisible]=\"!showRotateButton\"\n  id=\"primaryPageRotateCw\"\n  class=\"toolbarButton hiddenXLView rotateCw\"\n  title=\"Rotate Clockwise\"\n  data-l10n-id=\"page_rotate_cw\"\n  [disabled]=\"disableRotate\"\n  #button1>\n    <svg style=\"width:23px;height:23px\" viewBox=\"0 0 24 24\">\n      <path fill=\"currentColor\" d=\"M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C14 21 15.92 20.34 17.5 19.14L16.06 17.7C14.87 18.54 13.45 19 12 19C8.13 19 5 15.87 5 12S8.13 5 12 5 19 8.13 19 12H16L20 16L24 12H21C21 7.03 16.97 3 12 3\" />\n    </svg>\n</button>\n<button\n  *ngIf=\"counterClockwise\"\n  (click)=\"rotateCCW()\"\n  type=\"button\"\n  [class.invisible]=\"!showRotateButton\"\n  id=\"primaryPageRotateCcw\"\n  class=\"toolbarButton hiddenXLView rotateCcw\"\n  title=\"Rotate Counterclockwise\"\n  data-l10n-id=\"page_rotate_ccw\"\n  [disabled]=\"disableRotate\"\n  #button2>\n    <svg style=\"width:23px;height:23px\" viewBox=\"0 0 24 24\">\n      <path fill=\"currentColor\" d=\"M12 3C7.03 3 3 7.03 3 12H0L4 16L8 12H5C5 8.13 8.13 5 12 5S19 8.13 19 12 15.87 19 12 19C10.55 19 9.13 18.54 7.94 17.7L6.5 19.14C8.08 20.34 10 21 12 21C16.97 21 21 16.97 21 12S16.97 3 12 3\" />\n    </svg>\n</button>\n",
                    styles: [":host{margin-top:-1px}:host:focus{outline:0}button:focus,svg:focus{outline:0}"]
                }] }
    ];
    /** @nocollapse */
    PdfRotatePageComponent.ctorParameters = function () { return [
        { type: PDFNotificationService }
    ]; };
    PdfRotatePageComponent.propDecorators = {
        showRotateButton: [{ type: Input }],
        clockwise: [{ type: Input }],
        counterClockwise: [{ type: Input }],
        button1: [{ type: ViewChild, args: ['button1',] }],
        button2: [{ type: ViewChild, args: ['button2',] }]
    };
    return PdfRotatePageComponent;
}());
export { PdfRotatePageComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXJvdGF0ZS1wYWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1leHRlbmRlZC1wZGYtdmlld2VyLyIsInNvdXJjZXMiOlsibGliL3Rvb2xiYXIvcGRmLXJvdGF0ZS1wYWdlL3BkZi1yb3RhdGUtcGFnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXhFO0lBdUJFLGdDQUFvQixtQkFBMkM7UUFBL0QsaUJBS0M7UUFMbUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUF3QjtRQWhCeEQscUJBQWdCLEdBQUcsSUFBSSxDQUFDO1FBRXhCLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBR3JCLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFHakIscUJBQWdCLEdBQUcsSUFBSSxDQUFDOztZQVN2QixZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxTQUFTOzs7UUFBQztZQUNsRSxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzdCLENBQUMsRUFBQztJQUNKLENBQUM7Ozs7SUFFTSx5Q0FBUTs7O0lBQWY7O1lBQ1Esb0JBQW9CLEdBQTBCLENBQUMsbUJBQUEsTUFBTSxFQUFPLENBQUMsQ0FBQyxvQkFBb0I7UUFDeEYsb0JBQW9CLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRCxDQUFDOzs7O0lBRU0sMENBQVM7OztJQUFoQjs7WUFDUSxvQkFBb0IsR0FBMEIsQ0FBQyxtQkFBQSxNQUFNLEVBQU8sQ0FBQyxDQUFDLG9CQUFvQjtRQUN4RixvQkFBb0IsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Ozs7SUFHTSw0Q0FBVzs7O0lBQWxCO1FBQUEsaUJBR0M7O1lBRk8sb0JBQW9CLEdBQTBCLENBQUMsbUJBQUEsTUFBTSxFQUFPLENBQUMsQ0FBQyxvQkFBb0I7UUFDeEYsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxlQUFlOzs7O1FBQUUsVUFBQyxLQUFLLElBQUssT0FBQSxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUF6QixDQUF5QixFQUFDLENBQUM7SUFDMUYsQ0FBQzs7Ozs7SUFFTSw4Q0FBYTs7OztJQUFwQixVQUFxQixLQUF5QjtRQUM1QyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDO1FBQzVDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztTQUMxRDtRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztTQUMxRDtJQUNILENBQUM7O2dCQXRERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsNndDQUErQzs7aUJBRWhEOzs7O2dCQVRRLHNCQUFzQjs7O21DQVc1QixLQUFLOzRCQUtMLEtBQUs7bUNBR0wsS0FBSzswQkFHTCxTQUFTLFNBQUMsU0FBUzswQkFHbkIsU0FBUyxTQUFDLFNBQVM7O0lBbUN0Qiw2QkFBQztDQUFBLEFBdkRELElBdURDO1NBbERZLHNCQUFzQjs7O0lBQ2pDLGtEQUMrQjs7SUFFL0IsK0NBQTRCOztJQUU1QiwyQ0FDd0I7O0lBRXhCLGtEQUMrQjs7Ozs7SUFFL0IseUNBQytDOzs7OztJQUUvQyx5Q0FDK0M7Ozs7O0lBRW5DLHFEQUFtRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBERk5vdGlmaWNhdGlvblNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3BkZi1ub3RpZmljYXRpb24tc2VydmljZSc7XG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElQREZWaWV3ZXJBcHBsaWNhdGlvbiB9IGZyb20gJy4uLy4uL29wdGlvbnMvcGRmLXZpZXdlci1hcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBVcGRhdGVVSVN0YXRlRXZlbnQgfSBmcm9tICcuLi8uLi9ldmVudHMvdXBkYXRlLXVpLXN0YXRlLWV2ZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLXJvdGF0ZS1wYWdlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi1yb3RhdGUtcGFnZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi1yb3RhdGUtcGFnZS5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGRmUm90YXRlUGFnZUNvbXBvbmVudCAge1xuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1JvdGF0ZUJ1dHRvbiA9IHRydWU7XG5cbiAgcHVibGljIGRpc2FibGVSb3RhdGUgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjbG9ja3dpc2UgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjb3VudGVyQ2xvY2t3aXNlID0gdHJ1ZTtcblxuICBAVmlld0NoaWxkKCdidXR0b24xJylcbiAgcHJpdmF0ZSBidXR0b24xOiBFbGVtZW50UmVmPEhUTUxCdXR0b25FbGVtZW50PjtcblxuICBAVmlld0NoaWxkKCdidXR0b24yJylcbiAgcHJpdmF0ZSBidXR0b24yOiBFbGVtZW50UmVmPEhUTUxCdXR0b25FbGVtZW50PjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5vdGlmaWNhdGlvblNlcnZpY2U6IFBERk5vdGlmaWNhdGlvblNlcnZpY2UpIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2Uub25QREZKU0luaXQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMub25QZGZKc0luaXQoKTtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZUNXKCk6IHZvaWQge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMuZGlzcGF0Y2goJ3JvdGF0ZWN3Jyk7XG4gIH1cblxuICBwdWJsaWMgcm90YXRlQ0NXKCk6IHZvaWQge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMuZGlzcGF0Y2goJ3JvdGF0ZWNjdycpO1xuICB9XG5cblxuICBwdWJsaWMgb25QZGZKc0luaXQoKTogdm9pZCB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbigndXBkYXRldWlzdGF0ZScsIChldmVudCkgPT4gdGhpcy51cGRhdGVVSVN0YXRlKGV2ZW50KSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlVUlTdGF0ZShldmVudDogVXBkYXRlVUlTdGF0ZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlUm90YXRlID0gZXZlbnQucGFnZXNDb3VudCA9PT0gMDtcbiAgICBpZiAodGhpcy5idXR0b24xKSB7XG4gICAgICB0aGlzLmJ1dHRvbjEubmF0aXZlRWxlbWVudC5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZVJvdGF0ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYnV0dG9uMikge1xuICAgICAgdGhpcy5idXR0b24yLm5hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVSb3RhdGU7XG4gICAgfVxuICB9XG59XG4iXX0=