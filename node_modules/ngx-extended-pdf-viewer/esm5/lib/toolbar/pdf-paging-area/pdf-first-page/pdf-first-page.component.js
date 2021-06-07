/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-paging-area/pdf-first-page/pdf-first-page.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { PDFNotificationService } from './../../../pdf-notification-service';
import { Component, ViewChild, ElementRef } from '@angular/core';
var PdfFirstPageComponent = /** @class */ (function () {
    function PdfFirstPageComponent(notificationService) {
        var _this = this;
        this.notificationService = notificationService;
        this.disableFirstPage = true;
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
    PdfFirstPageComponent.prototype.firstPage = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.dispatch('firstpage');
    };
    /**
     * @return {?}
     */
    PdfFirstPageComponent.prototype.onPdfJsInit = /**
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
    PdfFirstPageComponent.prototype.updateUIState = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.disableFirstPage = event.pageNumber <= 1;
        this.button.nativeElement.disabled = this.disableFirstPage;
    };
    PdfFirstPageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pdf-first-page',
                    template: "<button type=\"button\"\n  class=\"toolbarButton hiddenLargeView\"\n  title=\"First page\"\n  id=\"primaryFirstPage\"\n  data-l10n-id=\"first_page\"\n  (click)=\"firstPage()\"\n  [disabled]=\"disableFirstPage\"\n  #button\n  >\n  <svg style=\"width:24px;height:24px\" viewBox=\"0 0 24 24\">\n    <path fill=\"currentColor\" d=\"M18.41,16.59L13.82,12L18.41,7.41L17,6L11,12L17,18L18.41,16.59M6,6H8V18H6V6Z\" />\n  </svg>\n  <span data-l10n-id=\"first_page_label\">First page</span>\n</button>\n",
                    styles: [""]
                }] }
    ];
    /** @nocollapse */
    PdfFirstPageComponent.ctorParameters = function () { return [
        { type: PDFNotificationService }
    ]; };
    PdfFirstPageComponent.propDecorators = {
        button: [{ type: ViewChild, args: ['button',] }]
    };
    return PdfFirstPageComponent;
}());
export { PdfFirstPageComponent };
if (false) {
    /** @type {?} */
    PdfFirstPageComponent.prototype.disableFirstPage;
    /**
     * @type {?}
     * @private
     */
    PdfFirstPageComponent.prototype.button;
    /**
     * @type {?}
     * @private
     */
    PdfFirstPageComponent.prototype.notificationService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWZpcnN0LXBhZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvIiwic291cmNlcyI6WyJsaWIvdG9vbGJhci9wZGYtcGFnaW5nLWFyZWEvcGRmLWZpcnN0LXBhZ2UvcGRmLWZpcnN0LXBhZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDN0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSWhFO0lBV0UsK0JBQW9CLG1CQUEyQztRQUEvRCxpQkFLQztRQUxtQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXdCO1FBTHhELHFCQUFnQixHQUFHLElBQUksQ0FBQzs7WUFNdkIsWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsU0FBUzs7O1FBQUM7WUFDbEUsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM3QixDQUFDLEVBQUM7SUFDSixDQUFDOzs7O0lBRU0seUNBQVM7OztJQUFoQjs7WUFDUSxvQkFBb0IsR0FBMEIsQ0FBQyxtQkFBQSxNQUFNLEVBQU8sQ0FBQyxDQUFDLG9CQUFvQjtRQUN4RixvQkFBb0IsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Ozs7SUFFTSwyQ0FBVzs7O0lBQWxCO1FBQUEsaUJBR0M7O1lBRk8sb0JBQW9CLEdBQTBCLENBQUMsbUJBQUEsTUFBTSxFQUFPLENBQUMsQ0FBQyxvQkFBb0I7UUFDeEYsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxlQUFlOzs7O1FBQUUsVUFBQyxLQUFLLElBQUssT0FBQSxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUF6QixDQUF5QixFQUFDLENBQUM7SUFDMUYsQ0FBQzs7Ozs7SUFFTSw2Q0FBYTs7OztJQUFwQixVQUFxQixLQUF5QjtRQUM1QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUM3RCxDQUFDOztnQkEvQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLHdmQUE4Qzs7aUJBRS9DOzs7O2dCQVRRLHNCQUFzQjs7O3lCQWE1QixTQUFTLFNBQUMsUUFBUTs7SUF3QnJCLDRCQUFDO0NBQUEsQUFoQ0QsSUFnQ0M7U0EzQlkscUJBQXFCOzs7SUFDaEMsaURBQStCOzs7OztJQUUvQix1Q0FDOEM7Ozs7O0lBRWxDLG9EQUFtRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBERk5vdGlmaWNhdGlvblNlcnZpY2UgfSBmcm9tICcuLy4uLy4uLy4uL3BkZi1ub3RpZmljYXRpb24tc2VydmljZSc7XG5pbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJUERGVmlld2VyQXBwbGljYXRpb24gfSBmcm9tICcuLi8uLi8uLi9vcHRpb25zL3BkZi12aWV3ZXItYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgVXBkYXRlVUlTdGF0ZUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vZXZlbnRzL3VwZGF0ZS11aS1zdGF0ZS1ldmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi1maXJzdC1wYWdlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi1maXJzdC1wYWdlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGRmLWZpcnN0LXBhZ2UuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFBkZkZpcnN0UGFnZUNvbXBvbmVudCB7XG4gIHB1YmxpYyBkaXNhYmxlRmlyc3RQYWdlID0gdHJ1ZTtcblxuICBAVmlld0NoaWxkKCdidXR0b24nKVxuICBwcml2YXRlIGJ1dHRvbjogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBub3RpZmljYXRpb25TZXJ2aWNlOiBQREZOb3RpZmljYXRpb25TZXJ2aWNlKSB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gdGhpcy5ub3RpZmljYXRpb25TZXJ2aWNlLm9uUERGSlNJbml0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLm9uUGRmSnNJbml0KCk7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBmaXJzdFBhZ2UoKTogdm9pZCB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5kaXNwYXRjaCgnZmlyc3RwYWdlJyk7XG4gIH1cblxuICBwdWJsaWMgb25QZGZKc0luaXQoKTogdm9pZCB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5ldmVudEJ1cy5vbigndXBkYXRldWlzdGF0ZScsIChldmVudCkgPT4gdGhpcy51cGRhdGVVSVN0YXRlKGV2ZW50KSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlVUlTdGF0ZShldmVudDogVXBkYXRlVUlTdGF0ZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlRmlyc3RQYWdlID0gZXZlbnQucGFnZU51bWJlciA8PSAxO1xuICAgIHRoaXMuYnV0dG9uLm5hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVGaXJzdFBhZ2U7XG4gIH1cbn1cbiJdfQ==