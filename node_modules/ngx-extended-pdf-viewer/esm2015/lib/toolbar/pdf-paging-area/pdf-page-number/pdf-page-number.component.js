/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-paging-area/pdf-page-number/pdf-page-number.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
export class PdfPageNumberComponent {
    constructor() {
        this.showPagingButtons = true;
    }
    /**
     * @return {?}
     */
    ngOnInit() { }
}
PdfPageNumberComponent.decorators = [
    { type: Component, args: [{
                selector: 'pdf-page-number',
                template: "<input\n  [class.invisible]=\"!showPagingButtons\"\n  type=\"number\"\n  id=\"pageNumber\"\n  class=\"toolbarField pageNumber\"\n  title=\"Page\"\n  value=\"1\"\n  size=\"4\"\n  min=\"1\"\n  data-l10n-id=\"page\"\n/>\n<span [class.invisible]=\"!showPagingButtons\" id=\"numPages\" class=\"toolbarLabel hiddenXLView\"></span>\n",
                styles: [""]
            }] }
];
/** @nocollapse */
PdfPageNumberComponent.ctorParameters = () => [];
PdfPageNumberComponent.propDecorators = {
    showPagingButtons: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    PdfPageNumberComponent.prototype.showPagingButtons;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXBhZ2UtbnVtYmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1leHRlbmRlZC1wZGYtdmlld2VyLyIsInNvdXJjZXMiOlsibGliL3Rvb2xiYXIvcGRmLXBhZ2luZy1hcmVhL3BkZi1wYWdlLW51bWJlci9wZGYtcGFnZS1udW1iZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPekQsTUFBTSxPQUFPLHNCQUFzQjtJQUlqQztRQUZPLHNCQUFpQixHQUFHLElBQUksQ0FBQztJQUVqQixDQUFDOzs7O0lBRWhCLFFBQVEsS0FBSSxDQUFDOzs7WUFYZCxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0Isa1ZBQStDOzthQUVoRDs7Ozs7Z0NBRUUsS0FBSzs7OztJQUFOLG1EQUNnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtcGFnZS1udW1iZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLXBhZ2UtbnVtYmVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGRmLXBhZ2UtbnVtYmVyLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBQZGZQYWdlTnVtYmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KClcbiAgcHVibGljIHNob3dQYWdpbmdCdXR0b25zID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgbmdPbkluaXQoKSB7fVxufVxuIl19