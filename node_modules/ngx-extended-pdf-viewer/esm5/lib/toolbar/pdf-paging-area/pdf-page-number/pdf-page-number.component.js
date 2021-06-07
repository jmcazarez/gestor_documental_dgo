/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-paging-area/pdf-page-number/pdf-page-number.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
var PdfPageNumberComponent = /** @class */ (function () {
    function PdfPageNumberComponent() {
        this.showPagingButtons = true;
    }
    /**
     * @return {?}
     */
    PdfPageNumberComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () { };
    PdfPageNumberComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pdf-page-number',
                    template: "<input\n  [class.invisible]=\"!showPagingButtons\"\n  type=\"number\"\n  id=\"pageNumber\"\n  class=\"toolbarField pageNumber\"\n  title=\"Page\"\n  value=\"1\"\n  size=\"4\"\n  min=\"1\"\n  data-l10n-id=\"page\"\n/>\n<span [class.invisible]=\"!showPagingButtons\" id=\"numPages\" class=\"toolbarLabel hiddenXLView\"></span>\n",
                    styles: [""]
                }] }
    ];
    /** @nocollapse */
    PdfPageNumberComponent.ctorParameters = function () { return []; };
    PdfPageNumberComponent.propDecorators = {
        showPagingButtons: [{ type: Input }]
    };
    return PdfPageNumberComponent;
}());
export { PdfPageNumberComponent };
if (false) {
    /** @type {?} */
    PdfPageNumberComponent.prototype.showPagingButtons;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXBhZ2UtbnVtYmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1leHRlbmRlZC1wZGYtdmlld2VyLyIsInNvdXJjZXMiOlsibGliL3Rvb2xiYXIvcGRmLXBhZ2luZy1hcmVhL3BkZi1wYWdlLW51bWJlci9wZGYtcGFnZS1udW1iZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekQ7SUFTRTtRQUZPLHNCQUFpQixHQUFHLElBQUksQ0FBQztJQUVqQixDQUFDOzs7O0lBRWhCLHlDQUFROzs7SUFBUixjQUFZLENBQUM7O2dCQVhkLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixrVkFBK0M7O2lCQUVoRDs7Ozs7b0NBRUUsS0FBSzs7SUFNUiw2QkFBQztDQUFBLEFBWkQsSUFZQztTQVBZLHNCQUFzQjs7O0lBQ2pDLG1EQUNnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtcGFnZS1udW1iZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLXBhZ2UtbnVtYmVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGRmLXBhZ2UtbnVtYmVyLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBQZGZQYWdlTnVtYmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KClcbiAgcHVibGljIHNob3dQYWdpbmdCdXR0b25zID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgbmdPbkluaXQoKSB7fVxufVxuIl19