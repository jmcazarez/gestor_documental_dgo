/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-find-button/pdf-find-button.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
export class PdfFindButtonComponent {
    constructor() {
        this.showFindButton = undefined;
        this.textLayer = undefined;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
PdfFindButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'pdf-find-button',
                template: "<button\n  type=\"button\"\n  [class.invisible]=\"!showFindButton || !textLayer\"\n  id=\"viewFind\"\n  class=\"toolbarButton\"\n  title=\"Find in Document\"\n  data-l10n-id=\"findbar\"\n>\n  <svg style=\"width:24px;height:24px\" viewBox=\"0 0 24 24\">\n    <path fill=\"currentColor\" d=\"M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z\" />\n  </svg>\n  <span data-l10n-id=\"findbar_label\">Find</span>\n</button>\n",
                styles: ["button svg{margin-top:-2px}:host:focus{outline:0}button:focus,svg:focus{outline:0}"]
            }] }
];
/** @nocollapse */
PdfFindButtonComponent.ctorParameters = () => [];
PdfFindButtonComponent.propDecorators = {
    showFindButton: [{ type: Input }],
    textLayer: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    PdfFindButtonComponent.prototype.showFindButton;
    /** @type {?} */
    PdfFindButtonComponent.prototype.textLayer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWZpbmQtYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1leHRlbmRlZC1wZGYtdmlld2VyLyIsInNvdXJjZXMiOlsibGliL3Rvb2xiYXIvcGRmLWZpbmQtYnV0dG9uL3BkZi1maW5kLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU96RCxNQUFNLE9BQU8sc0JBQXNCO0lBT2pDO1FBTE8sbUJBQWMsR0FBd0IsU0FBUyxDQUFDO1FBR2hELGNBQVMsR0FBd0IsU0FBUyxDQUFDO0lBRWxDLENBQUM7Ozs7SUFFakIsUUFBUTtJQUNSLENBQUM7OztZQWZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQiwrbkJBQStDOzthQUVoRDs7Ozs7NkJBRUUsS0FBSzt3QkFHTCxLQUFLOzs7O0lBSE4sZ0RBQ3VEOztJQUV2RCwyQ0FDa0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLWZpbmQtYnV0dG9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi1maW5kLWJ1dHRvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi1maW5kLWJ1dHRvbi5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGRmRmluZEJ1dHRvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93RmluZEJ1dHRvbjogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgdGV4dExheWVyOiBib29sZWFuIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cblxufVxuIl19