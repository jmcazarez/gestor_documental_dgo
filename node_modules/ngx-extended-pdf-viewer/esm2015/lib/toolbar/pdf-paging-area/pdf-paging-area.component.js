/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-paging-area/pdf-paging-area.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
export class PdfPagingAreaComponent {
    constructor() {
        this.showPagingButtons = true;
    }
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
if (false) {
    /** @type {?} */
    PdfPagingAreaComponent.prototype.showPagingButtons;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXBhZ2luZy1hcmVhLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1leHRlbmRlZC1wZGYtdmlld2VyLyIsInNvdXJjZXMiOlsibGliL3Rvb2xiYXIvcGRmLXBhZ2luZy1hcmVhL3BkZi1wYWdpbmctYXJlYS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU9qRCxNQUFNLE9BQU8sc0JBQXNCO0lBTG5DO1FBUVMsc0JBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLENBQUM7OztZQVRBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixvakJBQStDOzthQUVoRDs7O2dDQUdFLEtBQUs7Ozs7SUFBTixtREFDZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi1wYWdpbmctYXJlYScsXG4gIHRlbXBsYXRlVXJsOiAnLi9wZGYtcGFnaW5nLWFyZWEuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wZGYtcGFnaW5nLWFyZWEuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFBkZlBhZ2luZ0FyZWFDb21wb25lbnQge1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93UGFnaW5nQnV0dG9ucyA9IHRydWU7XG59XG4iXX0=