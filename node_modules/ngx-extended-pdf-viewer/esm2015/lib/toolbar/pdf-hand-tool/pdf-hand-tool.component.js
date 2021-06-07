/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-hand-tool/pdf-hand-tool.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { PdfCursorTools } from './../../options/pdf-cursor-tools';
import { Component, Input } from '@angular/core';
import { PDFNotificationService } from '../../pdf-notification-service';
export class PdfHandToolComponent {
    /**
     * @param {?} notificationService
     */
    constructor(notificationService) {
        this.notificationService = notificationService;
        this.showHandToolButton = true;
        this.isSelected = false;
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
     * @private
     * @return {?}
     */
    onPdfJsInit() {
        /** @type {?} */
        const PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.on('cursortoolchanged', (/**
         * @param {?} __0
         * @return {?}
         */
        ({ tool }) => (this.isSelected = tool === PdfCursorTools.HAND)));
    }
    /**
     * @return {?}
     */
    onClick() {
        /** @type {?} */
        const PDFViewerApplication = ((/** @type {?} */ (window))).PDFViewerApplication;
        PDFViewerApplication.eventBus.dispatch('switchcursortool', { tool: PdfCursorTools.HAND });
    }
}
PdfHandToolComponent.decorators = [
    { type: Component, args: [{
                selector: 'pdf-hand-tool',
                template: "<button\n  (click)=\"onClick()\"\n  type=\"button\"\n  [class.invisible]=\"!showHandToolButton\"\n  [class.toggled]=\"isSelected\"\n  id=\"primaryCursorHandTool\"\n  class=\"toolbarButton hiddenXXLView\"\n  title=\"Enable hand tool\"\n  data-l10n-id=\"cursor_hand_tool\">\n  <svg style=\"width:22px;height:22px\" viewBox=\"0 0 24 24\">\n    <path fill=\"currentColor\" d=\"M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z\" />\n  </svg>\n  <span data-l10n-id=\"cursor_hand_tool_label\">Hand Tool</span>\n</button>\n",
                styles: [":host{margin-top:0}:host:focus{outline:0}button:focus,svg:focus{outline:0}.toggled{background-color:#646464;border-color:rgba(0,0,0,.4) rgba(0,0,0,.45) rgba(0,0,0,.5);box-shadow:0 1px 1px rgba(0,0,0,.1) inset,0 0 1px rgba(0,0,0,.2) inset,0 1px 0 rgba(255,255,255,.05)}"]
            }] }
];
/** @nocollapse */
PdfHandToolComponent.ctorParameters = () => [
    { type: PDFNotificationService }
];
PdfHandToolComponent.propDecorators = {
    showHandToolButton: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    PdfHandToolComponent.prototype.showHandToolButton;
    /** @type {?} */
    PdfHandToolComponent.prototype.isSelected;
    /**
     * @type {?}
     * @private
     */
    PdfHandToolComponent.prototype.notificationService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWhhbmQtdG9vbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci8iLCJzb3VyY2VzIjpbImxpYi90b29sYmFyL3BkZi1oYW5kLXRvb2wvcGRmLWhhbmQtdG9vbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFakQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFReEUsTUFBTSxPQUFPLG9CQUFvQjs7OztJQU0vQixZQUFvQixtQkFBMkM7UUFBM0Msd0JBQW1CLEdBQW5CLG1CQUFtQixDQUF3QjtRQUp4RCx1QkFBa0IsR0FBRyxJQUFJLENBQUM7UUFFMUIsZUFBVSxHQUFHLEtBQUssQ0FBQzs7Y0FHbEIsWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFO1lBQ3ZFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDN0IsQ0FBQyxFQUFDO0lBQ0osQ0FBQzs7Ozs7SUFFTyxXQUFXOztjQUNYLG9CQUFvQixHQUEwQixDQUFDLG1CQUFBLE1BQU0sRUFBTyxDQUFDLENBQUMsb0JBQW9CO1FBQ3hGLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsbUJBQW1COzs7O1FBQ2xELENBQUMsRUFBRSxJQUFJLEVBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEtBQUssY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUM7SUFDckYsQ0FBQzs7OztJQUVNLE9BQU87O2NBQ04sb0JBQW9CLEdBQTBCLENBQUMsbUJBQUEsTUFBTSxFQUFPLENBQUMsQ0FBQyxvQkFBb0I7UUFDeEYsb0JBQW9CLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1RixDQUFDOzs7WUEzQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QiwrbEJBQTZDOzthQUU5Qzs7OztZQVBRLHNCQUFzQjs7O2lDQVM1QixLQUFLOzs7O0lBQU4sa0RBQ2lDOztJQUVqQywwQ0FBMEI7Ozs7O0lBRWQsbURBQW1EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGRmQ3Vyc29yVG9vbHMgfSBmcm9tICcuLy4uLy4uL29wdGlvbnMvcGRmLWN1cnNvci10b29scyc7XG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJUERGVmlld2VyQXBwbGljYXRpb24gfSBmcm9tICcuLi8uLi9vcHRpb25zL3BkZi12aWV3ZXItYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgUERGTm90aWZpY2F0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3BkZi1ub3RpZmljYXRpb24tc2VydmljZSc7XG5pbXBvcnQgeyBIYW5kdG9vbENoYW5nZWQgfSBmcm9tICcuLi8uLi9ldmVudHMvaGFuZHRvb2wtY2hhbmdlZCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi1oYW5kLXRvb2wnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLWhhbmQtdG9vbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi1oYW5kLXRvb2wuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFBkZkhhbmRUb29sQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgcHVibGljIHNob3dIYW5kVG9vbEJ1dHRvbiA9IHRydWU7XG5cbiAgcHVibGljIGlzU2VsZWN0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5vdGlmaWNhdGlvblNlcnZpY2U6IFBERk5vdGlmaWNhdGlvblNlcnZpY2UpIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2Uub25QREZKU0luaXQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMub25QZGZKc0luaXQoKTtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvblBkZkpzSW5pdCgpIHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKHdpbmRvdyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdjdXJzb3J0b29sY2hhbmdlZCcsXG4gICAgICAoeyB0b29sIH06IEhhbmR0b29sQ2hhbmdlZCkgPT4gKHRoaXMuaXNTZWxlY3RlZCA9IHRvb2wgPT09IFBkZkN1cnNvclRvb2xzLkhBTkQpKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMuZGlzcGF0Y2goJ3N3aXRjaGN1cnNvcnRvb2wnLCB7IHRvb2w6IFBkZkN1cnNvclRvb2xzLkhBTkQgfSk7XG4gIH1cbn1cbiJdfQ==