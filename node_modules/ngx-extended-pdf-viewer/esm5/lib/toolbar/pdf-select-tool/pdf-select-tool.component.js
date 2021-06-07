/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-select-tool/pdf-select-tool.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { PdfCursorTools } from './../../options/pdf-cursor-tools';
import { Component, Input } from '@angular/core';
import { PDFNotificationService } from '../../pdf-notification-service';
var PdfSelectToolComponent = /** @class */ (function () {
    function PdfSelectToolComponent(notificationService) {
        var _this = this;
        this.notificationService = notificationService;
        this.showSelectToolButton = true;
        this.isSelected = true;
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
     * @private
     * @return {?}
     */
    PdfSelectToolComponent.prototype.onPdfJsInit = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.on('cursortoolchanged', (/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var tool = _a.tool;
            return (_this.isSelected = tool === PdfCursorTools.SELECT);
        }));
    };
    /**
     * @return {?}
     */
    PdfSelectToolComponent.prototype.onClick = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.dispatch('switchcursortool', { tool: PdfCursorTools.SELECT });
    };
    PdfSelectToolComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pdf-select-tool',
                    template: "<button\n  (click)=\"onClick()\"\n  type=\"button\"\n  [class.invisible]=\"!showSelectToolButton\"\n  [class.toggled]=\"isSelected\"\n  id=\"primaryCursorSelectTool\"\n  class=\"toolbarButton hiddenXXLView\"\n  title=\"Enable text selection tool\"\n  data-l10n-id=\"cursor_text_select_tool\">\n  <svg style=\"width:22px;height:22px\" viewBox=\"0 0 24 24\">\n    <path fill=\"currentColor\" d=\"M2 4C2 2.89 2.9 2 4 2H7V4H4V7H2V4M22 4V7H20V4H17V2H20C21.1 2 22 2.89 22 4M2 20V17H4V20H7V22H4C2.9 22 2 21.11 2 20M10 2H14V4H10V2M10 20H14V22H10V20M2 10H4V14H2V10M18.5 13C20.4 13 22 14.6 22 16.5C22 19.1 18.5 23 18.5 23C18.5 23 15 19.1 15 16.5C15 14.6 16.6 13 18.5 13M18.5 17.8C19.2 17.8 19.8 17.2 19.7 16.6C19.7 16 19.1 15.4 18.5 15.4C17.9 15.4 17.3 15.9 17.3 16.6C17.3 17.2 17.8 17.8 18.5 17.8M20 10H22V12.34C21.42 11.84 20.74 11.45 20 11.23V10Z\" />\n  </svg>\n  <span data-l10n-id=\"cursor_text_select_tool_label\">Text selection tool</span>\n</button>\n",
                    styles: [":host{margin-top:0;margin-right:-3px}:host:focus{outline:0}button:focus,svg:focus{outline:0}.toggled{background-color:#646464;border-color:rgba(0,0,0,.4) rgba(0,0,0,.45) rgba(0,0,0,.5);box-shadow:0 1px 1px rgba(0,0,0,.1) inset,0 0 1px rgba(0,0,0,.2) inset,0 1px 0 rgba(255,255,255,.05)}"]
                }] }
    ];
    /** @nocollapse */
    PdfSelectToolComponent.ctorParameters = function () { return [
        { type: PDFNotificationService }
    ]; };
    PdfSelectToolComponent.propDecorators = {
        showSelectToolButton: [{ type: Input }]
    };
    return PdfSelectToolComponent;
}());
export { PdfSelectToolComponent };
if (false) {
    /** @type {?} */
    PdfSelectToolComponent.prototype.showSelectToolButton;
    /** @type {?} */
    PdfSelectToolComponent.prototype.isSelected;
    /**
     * @type {?}
     * @private
     */
    PdfSelectToolComponent.prototype.notificationService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXNlbGVjdC10b29sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1leHRlbmRlZC1wZGYtdmlld2VyLyIsInNvdXJjZXMiOlsibGliL3Rvb2xiYXIvcGRmLXNlbGVjdC10b29sL3BkZi1zZWxlY3QtdG9vbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFakQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFHeEU7SUFXRSxnQ0FBb0IsbUJBQTJDO1FBQS9ELGlCQUtDO1FBTG1CLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBd0I7UUFKeEQseUJBQW9CLEdBQUcsSUFBSSxDQUFDO1FBRTVCLGVBQVUsR0FBRyxJQUFJLENBQUM7O1lBR2pCLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLFNBQVM7OztRQUFDO1lBQ2xFLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDN0IsQ0FBQyxFQUFDO0lBQ0osQ0FBQzs7Ozs7SUFFTyw0Q0FBVzs7OztJQUFuQjtRQUFBLGlCQUlDOztZQUhPLG9CQUFvQixHQUEwQixDQUFDLG1CQUFBLE1BQU0sRUFBTyxDQUFDLENBQUMsb0JBQW9CO1FBQ3hGLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsbUJBQW1COzs7O1FBQ2xELFVBQUMsRUFBeUI7Z0JBQXZCLGNBQUk7WUFBd0IsT0FBQSxDQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxLQUFLLGNBQWMsQ0FBQyxNQUFNLENBQUM7UUFBbEQsQ0FBa0QsRUFBQyxDQUFDO0lBQ3ZGLENBQUM7Ozs7SUFFTSx3Q0FBTzs7O0lBQWQ7O1lBQ1Esb0JBQW9CLEdBQTBCLENBQUMsbUJBQUEsTUFBTSxFQUFPLENBQUMsQ0FBQyxvQkFBb0I7UUFDeEYsb0JBQW9CLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM5RixDQUFDOztnQkEzQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLGs4QkFBK0M7O2lCQUVoRDs7OztnQkFQUSxzQkFBc0I7Ozt1Q0FTNUIsS0FBSzs7SUFzQlIsNkJBQUM7Q0FBQSxBQTVCRCxJQTRCQztTQXZCWSxzQkFBc0I7OztJQUNqQyxzREFDbUM7O0lBRW5DLDRDQUF5Qjs7Ozs7SUFFYixxREFBbUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZGZDdXJzb3JUb29scyB9IGZyb20gJy4vLi4vLi4vb3B0aW9ucy9wZGYtY3Vyc29yLXRvb2xzJztcbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElQREZWaWV3ZXJBcHBsaWNhdGlvbiB9IGZyb20gJy4uLy4uL29wdGlvbnMvcGRmLXZpZXdlci1hcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBQREZOb3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vcGRmLW5vdGlmaWNhdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEhhbmR0b29sQ2hhbmdlZCB9IGZyb20gJy4uLy4uL2V2ZW50cy9oYW5kdG9vbC1jaGFuZ2VkJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLXNlbGVjdC10b29sJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi1zZWxlY3QtdG9vbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi1zZWxlY3QtdG9vbC5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGRmU2VsZWN0VG9vbENvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93U2VsZWN0VG9vbEJ1dHRvbiA9IHRydWU7XG5cbiAgcHVibGljIGlzU2VsZWN0ZWQgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbm90aWZpY2F0aW9uU2VydmljZTogUERGTm90aWZpY2F0aW9uU2VydmljZSkge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHRoaXMubm90aWZpY2F0aW9uU2VydmljZS5vblBERkpTSW5pdC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5vblBkZkpzSW5pdCgpO1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uUGRmSnNJbml0KCkge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMub24oJ2N1cnNvcnRvb2xjaGFuZ2VkJyxcbiAgICAgICh7IHRvb2wgfTogSGFuZHRvb2xDaGFuZ2VkKSA9PiAodGhpcy5pc1NlbGVjdGVkID0gdG9vbCA9PT0gUGRmQ3Vyc29yVG9vbHMuU0VMRUNUKSk7XG4gIH1cblxuICBwdWJsaWMgb25DbGljaygpOiB2b2lkIHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKHdpbmRvdyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLmRpc3BhdGNoKCdzd2l0Y2hjdXJzb3J0b29sJywgeyB0b29sOiBQZGZDdXJzb3JUb29scy5TRUxFQ1QgfSk7XG4gIH1cbn1cbiJdfQ==