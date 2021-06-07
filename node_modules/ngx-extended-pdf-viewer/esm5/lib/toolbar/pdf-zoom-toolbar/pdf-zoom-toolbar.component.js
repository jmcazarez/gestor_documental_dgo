/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-zoom-toolbar/pdf-zoom-toolbar.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
var PdfZoomToolbarComponent = /** @class */ (function () {
    function PdfZoomToolbarComponent() {
        this.showZoomButtons = true;
        this.zoomLevels = ['auto', 'page-actual', 'page-fit', 'page-width', 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
    }
    PdfZoomToolbarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pdf-zoom-toolbar',
                    template: "<div [class.invisible]=\"!showZoomButtons\" id=\"toolbarViewerMiddle\">\n  <pdf-zoom-out></pdf-zoom-out>\n  <pdf-zoom-in></pdf-zoom-in>\n  <pdf-zoom-dropdown\n      style=\"width: unset; max-width: unset;padding-top:3px\" [zoomLevels]=\"zoomLevels\">\n  </pdf-zoom-dropdown>\n</div>\n",
                    styles: [""]
                }] }
    ];
    PdfZoomToolbarComponent.propDecorators = {
        showZoomButtons: [{ type: Input }],
        zoomLevels: [{ type: Input }]
    };
    return PdfZoomToolbarComponent;
}());
export { PdfZoomToolbarComponent };
if (false) {
    /** @type {?} */
    PdfZoomToolbarComponent.prototype.showZoomButtons;
    /** @type {?} */
    PdfZoomToolbarComponent.prototype.zoomLevels;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXpvb20tdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci8iLCJzb3VyY2VzIjpbImxpYi90b29sYmFyL3BkZi16b29tLXRvb2xiYXIvcGRmLXpvb20tdG9vbGJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBd0IsTUFBTSxlQUFlLENBQUM7QUFFL0U7SUFBQTtRQVFTLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBR3ZCLGVBQVUsR0FBRyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUcsQ0FBQzs7Z0JBWkEsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLHdTQUFnRDs7aUJBRWpEOzs7a0NBR0UsS0FBSzs2QkFHTCxLQUFLOztJQUVSLDhCQUFDO0NBQUEsQUFaRCxJQVlDO1NBUFksdUJBQXVCOzs7SUFFbEMsa0RBQzhCOztJQUU5Qiw2Q0FDd0ciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi16b29tLXRvb2xiYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLXpvb20tdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi16b29tLXRvb2xiYXIuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFBkZlpvb21Ub29sYmFyQ29tcG9uZW50IHtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1pvb21CdXR0b25zID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgem9vbUxldmVscyA9IFsnYXV0bycsICdwYWdlLWFjdHVhbCcsICdwYWdlLWZpdCcsICdwYWdlLXdpZHRoJywgMC41LCAwLjc1LCAxLCAxLjI1LCAxLjUsIDIsIDMsIDRdO1xufVxuIl19