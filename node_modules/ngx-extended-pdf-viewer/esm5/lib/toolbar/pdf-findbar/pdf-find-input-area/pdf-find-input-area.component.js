/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-findbar/pdf-find-input-area/pdf-find-input-area.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef } from '@angular/core';
var PdfFindInputAreaComponent = /** @class */ (function () {
    function PdfFindInputAreaComponent() {
    }
    PdfFindInputAreaComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pdf-find-input-area',
                    template: "<div id=\"findbarInputContainer\" *ngIf=\"!customFindbarInputArea\">\n  <pdf-search-input-field></pdf-search-input-field>\n  <pdf-find-previous></pdf-find-previous>\n  <pdf-find-next></pdf-find-next>\n</div>\n\n<ng-container [ngTemplateOutlet]=\"customFindbarInputArea\"> </ng-container>\n",
                    styles: [""]
                }] }
    ];
    /** @nocollapse */
    PdfFindInputAreaComponent.ctorParameters = function () { return []; };
    PdfFindInputAreaComponent.propDecorators = {
        customFindbarInputArea: [{ type: Input }]
    };
    return PdfFindInputAreaComponent;
}());
export { PdfFindInputAreaComponent };
if (false) {
    /** @type {?} */
    PdfFindInputAreaComponent.prototype.customFindbarInputArea;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWZpbmQtaW5wdXQtYXJlYS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci8iLCJzb3VyY2VzIjpbImxpYi90b29sYmFyL3BkZi1maW5kYmFyL3BkZi1maW5kLWlucHV0LWFyZWEvcGRmLWZpbmQtaW5wdXQtYXJlYS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQ7SUFTRTtJQUFlLENBQUM7O2dCQVRqQixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsNlNBQW1EOztpQkFFcEQ7Ozs7O3lDQUVFLEtBQUs7O0lBSVIsZ0NBQUM7Q0FBQSxBQVZELElBVUM7U0FMWSx5QkFBeUI7OztJQUNwQywyREFDZ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtZmluZC1pbnB1dC1hcmVhJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi1maW5kLWlucHV0LWFyZWEuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wZGYtZmluZC1pbnB1dC1hcmVhLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBQZGZGaW5kSW5wdXRBcmVhQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgcHVibGljIGN1c3RvbUZpbmRiYXJJbnB1dEFyZWE6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IoKSB7fVxufVxuIl19