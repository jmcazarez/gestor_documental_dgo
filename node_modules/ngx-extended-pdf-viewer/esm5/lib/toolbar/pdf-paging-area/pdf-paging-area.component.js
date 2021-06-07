/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-paging-area/pdf-paging-area.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
var PdfPagingAreaComponent = /** @class */ (function () {
    function PdfPagingAreaComponent() {
        this.showPagingButtons = true;
    }
    PdfPagingAreaComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pdf-paging-area',
                    template: "<div\n[class.invisible]=\"!showPagingButtons\"\nclass=\"paging-left hiddenTinyView\"\n>\n<pdf-first-page style=\"margin-right: -3px;\"></pdf-first-page>\n<pdf-previous-page style=\"margin-left: -3px;\"></pdf-previous-page>\n</div>\n<pdf-page-number [showPagingButtons]=\"showPagingButtons\"></pdf-page-number>\n<div\n[class.invisible]=\"!showPagingButtons\"\nclass=\"paging-right hiddenTinyView\"\n>\n<pdf-next-page style=\"margin-right: -3px;margin-left: -3px;\"></pdf-next-page>\n<pdf-last-page style=\"margin-left: -3px;\"></pdf-last-page>\n</div>\n",
                    styles: [".paging-right{float:right;display:block;margin-top:-2px}.paging-left{float:left;display:block;margin-top:-2px}"]
                }] }
    ];
    PdfPagingAreaComponent.propDecorators = {
        showPagingButtons: [{ type: Input }]
    };
    return PdfPagingAreaComponent;
}());
export { PdfPagingAreaComponent };
if (false) {
    /** @type {?} */
    PdfPagingAreaComponent.prototype.showPagingButtons;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXBhZ2luZy1hcmVhLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1leHRlbmRlZC1wZGYtdmlld2VyLyIsInNvdXJjZXMiOlsibGliL3Rvb2xiYXIvcGRmLXBhZ2luZy1hcmVhL3BkZi1wYWdpbmctYXJlYS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqRDtJQUFBO1FBUVMsc0JBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLENBQUM7O2dCQVRBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixvakJBQStDOztpQkFFaEQ7OztvQ0FHRSxLQUFLOztJQUVSLDZCQUFDO0NBQUEsQUFURCxJQVNDO1NBSlksc0JBQXNCOzs7SUFFakMsbURBQ2dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZGYtcGFnaW5nLWFyZWEnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLXBhZ2luZy1hcmVhLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGRmLXBhZ2luZy1hcmVhLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBQZGZQYWdpbmdBcmVhQ29tcG9uZW50IHtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2hvd1BhZ2luZ0J1dHRvbnMgPSB0cnVlO1xufVxuIl19