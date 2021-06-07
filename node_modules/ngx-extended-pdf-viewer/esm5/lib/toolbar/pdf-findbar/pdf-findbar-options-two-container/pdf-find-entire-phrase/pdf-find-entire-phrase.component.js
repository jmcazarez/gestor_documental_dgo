/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-findbar/pdf-findbar-options-two-container/pdf-find-entire-phrase/pdf-find-entire-phrase.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { PdfFindbarService } from '../../pdf-findbar-service';
var PdfFindMultipleSearchTextsComponent = /** @class */ (function () {
    function PdfFindMultipleSearchTextsComponent(pdfFindbarService) {
        this.pdfFindbarService = pdfFindbarService;
    }
    /**
     * @return {?}
     */
    PdfFindMultipleSearchTextsComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () { };
    PdfFindMultipleSearchTextsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pdf-find-entire-phrase',
                    template: "<input\n  type=\"checkbox\"\n  id=\"findMultipleSearchTexts\"\n  class=\"toolbarField\"\n  [(ngModel)]=\"pdfFindbarService.multipleSearchTexts\"\n/>\n\n<label\n  for=\"findMultipleSearchTexts\"\n  class=\"toolbarLabel\"\n  data-l10n-id=\"find_multiple_texts_label\">\n  multiple search texts\n</label>\n\n<input [class.hidden]=\"!pdfFindbarService.multipleSearchTexts\"\n  type=\"checkbox\"\n  id=\"individualWordsMode\"\n  class=\"toolbarField\"\n  [(ngModel)]=\"pdfFindbarService.individualWordsMode\"\n/>\n\n<label [class.hidden]=\"!pdfFindbarService.multipleSearchTexts\"\n  for=\"individualWordsMode\"\n  id=\"individualWordsModeLabel\"\n  class=\"toolbarLabel\"\n  data-l10n-id=\"find_individual_words_label\">\n  separated by word boundaries\n</label>\n",
                    styles: [""]
                }] }
    ];
    /** @nocollapse */
    PdfFindMultipleSearchTextsComponent.ctorParameters = function () { return [
        { type: PdfFindbarService }
    ]; };
    return PdfFindMultipleSearchTextsComponent;
}());
export { PdfFindMultipleSearchTextsComponent };
if (false) {
    /** @type {?} */
    PdfFindMultipleSearchTextsComponent.prototype.pdfFindbarService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWZpbmQtZW50aXJlLXBocmFzZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci8iLCJzb3VyY2VzIjpbImxpYi90b29sYmFyL3BkZi1maW5kYmFyL3BkZi1maW5kYmFyLW9wdGlvbnMtdHdvLWNvbnRhaW5lci9wZGYtZmluZC1lbnRpcmUtcGhyYXNlL3BkZi1maW5kLWVudGlyZS1waHJhc2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUU5RDtJQU9FLDZDQUFtQixpQkFBb0M7UUFBcEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtJQUFHLENBQUM7Ozs7SUFFM0Qsc0RBQVE7OztJQUFSLGNBQVksQ0FBQzs7Z0JBVGQsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLG93QkFBc0Q7O2lCQUV2RDs7OztnQkFOUSxpQkFBaUI7O0lBWTFCLDBDQUFDO0NBQUEsQUFWRCxJQVVDO1NBTFksbUNBQW1DOzs7SUFFbEMsZ0VBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBkZkZpbmRiYXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vcGRmLWZpbmRiYXItc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BkZi1maW5kLWVudGlyZS1waHJhc2UnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLWZpbmQtZW50aXJlLXBocmFzZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BkZi1maW5kLWVudGlyZS1waHJhc2UuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFBkZkZpbmRNdWx0aXBsZVNlYXJjaFRleHRzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGRmRmluZGJhclNlcnZpY2U6IFBkZkZpbmRiYXJTZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCkge31cbn1cbiJdfQ==