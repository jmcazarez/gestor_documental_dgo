/**
 * @fileoverview added by tsickle
 * Generated from: lib/sidebar/pdf-sidebar/pdf-sidebar.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
export class PdfSidebarComponent {
    /**
     * @param {?} elementRef
     * @param {?} ref
     */
    constructor(elementRef, ref) {
        this.elementRef = elementRef;
        this.ref = ref;
        this.sidebarVisible = true;
        this.showSidebarButton = true;
        this.thumbnailDrawn = new EventEmitter();
        this.hideSidebarToolbar = true;
    }
    /**
     * @return {?}
     */
    showToolbarWhenNecessary() {
        /** @type {?} */
        const element = (/** @type {?} */ (this.elementRef.nativeElement));
        /** @type {?} */
        const buttons = element.querySelectorAll('button');
        /** @type {?} */
        let visible = 0;
        for (let index = 0; index < buttons.length; index++) {
            /** @type {?} */
            const b = buttons.item(index);
            if (!b.hidden) {
                visible++;
            }
        }
        this.hideSidebarToolbar = visible <= 1;
        this.ref.markForCheck();
    }
}
PdfSidebarComponent.decorators = [
    { type: Component, args: [{
                selector: 'pdf-sidebar',
                template: "<div>\n  <ng-content *ngTemplateOutlet=\"customSidebar ? customSidebar : defaultSidebar\"></ng-content>\n</div>\n\n<ng-template #defaultSidebar>\n  <div id=\"sidebarContainer\" [style.top]=\"sidebarPositionTop\">\n    <div id=\"additionalSidebarContainer\" [style.display]=\"hideSidebarToolbar ? 'none' : ''\">\n      <pdf-sidebar-toolbar></pdf-sidebar-toolbar>\n    </div>\n    <pdf-sidebar-content\n      [customThumbnail]=\"customThumbnail\"\n      (thumbnailDrawn)=\"thumbnailDrawn.emit($event)\"\n      [hideSidebarToolbar]=\"hideSidebarToolbar\"\n    ></pdf-sidebar-content>\n    <div id=\"sidebarResizer\" class=\"hidden\"></div>\n  </div>\n</ng-template>\n",
                styles: [""]
            }] }
];
/** @nocollapse */
PdfSidebarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
PdfSidebarComponent.propDecorators = {
    sidebarPositionTop: [{ type: Input }],
    sidebarVisible: [{ type: Input }],
    showSidebarButton: [{ type: Input }],
    customSidebar: [{ type: Input }],
    customThumbnail: [{ type: Input }],
    thumbnailDrawn: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    PdfSidebarComponent.prototype.sidebarPositionTop;
    /** @type {?} */
    PdfSidebarComponent.prototype.sidebarVisible;
    /** @type {?} */
    PdfSidebarComponent.prototype.showSidebarButton;
    /** @type {?} */
    PdfSidebarComponent.prototype.customSidebar;
    /** @type {?} */
    PdfSidebarComponent.prototype.customThumbnail;
    /** @type {?} */
    PdfSidebarComponent.prototype.thumbnailDrawn;
    /** @type {?} */
    PdfSidebarComponent.prototype.hideSidebarToolbar;
    /**
     * @type {?}
     * @private
     */
    PdfSidebarComponent.prototype.elementRef;
    /**
     * @type {?}
     * @private
     */
    PdfSidebarComponent.prototype.ref;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXNpZGViYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvIiwic291cmNlcyI6WyJsaWIvc2lkZWJhci9wZGYtc2lkZWJhci9wZGYtc2lkZWJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQThDLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUE2QixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVExTCxNQUFNLE9BQU8sbUJBQW1COzs7OztJQXFCOUIsWUFBb0IsVUFBc0IsRUFBVSxHQUFzQjtRQUF0RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVUsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFoQm5FLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBR3RCLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQVN6QixtQkFBYyxHQUFHLElBQUksWUFBWSxFQUEwQixDQUFDO1FBRTVELHVCQUFrQixHQUFHLElBQUksQ0FBQztJQUU0QyxDQUFDOzs7O0lBRXZFLHdCQUF3Qjs7Y0FDdkIsT0FBTyxHQUFHLG1CQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFlOztjQUN0RCxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQzs7WUFDOUMsT0FBTyxHQUFHLENBQUM7UUFDZixLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTs7a0JBQzdDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM3QixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQkFDYixPQUFPLEVBQUUsQ0FBQzthQUNYO1NBQ0Y7UUFDRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxJQUFJLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzFCLENBQUM7OztZQXhDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLG9xQkFBMkM7O2FBRTVDOzs7O1lBUG1GLFVBQVU7WUFBbUQsaUJBQWlCOzs7aUNBUy9KLEtBQUs7NkJBR0wsS0FBSztnQ0FHTCxLQUFLOzRCQUdMLEtBQUs7OEJBR0wsS0FBSzs2QkFHTCxNQUFNOzs7O0lBZlAsaURBQ2tDOztJQUVsQyw2Q0FDNkI7O0lBRTdCLGdEQUNnQzs7SUFFaEMsNENBQ3VDOztJQUV2Qyw4Q0FDeUM7O0lBRXpDLDZDQUNtRTs7SUFFbkUsaURBQWlDOzs7OztJQUVyQix5Q0FBOEI7Ozs7O0lBQUUsa0NBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVGVtcGxhdGVSZWYsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdFbmNhcHN1bGF0aW9uLCBOZ1pvbmUsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQZGZUaHVtYm5haWxEcmF3bkV2ZW50IH0gZnJvbSAnLi4vLi4vZXZlbnRzL3BkZi10aHVtYm5haWwtZHJhd24tZXZlbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtc2lkZWJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9wZGYtc2lkZWJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi1zaWRlYmFyLmNvbXBvbmVudC5jc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgUGRmU2lkZWJhckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaWRlYmFyUG9zaXRpb25Ub3A6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2lkZWJhclZpc2libGUgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93U2lkZWJhckJ1dHRvbiA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGN1c3RvbVNpZGViYXI6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KClcbiAgcHVibGljIGN1c3RvbVRodW1ibmFpbDogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHRodW1ibmFpbERyYXduID0gbmV3IEV2ZW50RW1pdHRlcjxQZGZUaHVtYm5haWxEcmF3bkV2ZW50PigpO1xuXG4gIHB1YmxpYyBoaWRlU2lkZWJhclRvb2xiYXIgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSByZWY6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIHB1YmxpYyBzaG93VG9vbGJhcldoZW5OZWNlc3NhcnkoKTogdm9pZCB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IGJ1dHRvbnMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpO1xuICAgIGxldCB2aXNpYmxlID0gMDtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYnV0dG9ucy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IGIgPSBidXR0b25zLml0ZW0oaW5kZXgpO1xuICAgICAgaWYgKCFiLmhpZGRlbikge1xuICAgICAgICB2aXNpYmxlKys7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaGlkZVNpZGViYXJUb29sYmFyID0gdmlzaWJsZSA8PSAxO1xuICAgIHRoaXMucmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iXX0=