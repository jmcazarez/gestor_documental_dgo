/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-findbar/pdf-findbar.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef } from '@angular/core';
export class PdfFindbarComponent {
    constructor() {
        this.showFindButton = true;
    }
}
PdfFindbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'pdf-findbar',
                template: "<ng-container [ngTemplateOutlet]=\"customFindbar ? customFindbar : defaultFindbar\">\n</ng-container>\n\n<ng-template #defaultFindbar>\n  <div\n    class=\"findbar hidden doorHanger\"\n    [class.invisible]=\"!showFindButton\"\n    id=\"findbar\"\n    [style.transform]=\"'scale(' + mobileFriendlyZoomScale + ')'\"\n    [style.transformOrigin]=\"'left center'\"\n    [style.left]=\"findbarLeft\"\n    [style.top]=\"findbarTop\"\n  >\n    <ng-container [ngTemplateOutlet]=\"customFindbarButtons ? customFindbarButtons : defaultFindbarButtons\"> </ng-container>\n    </div>\n</ng-template>\n\n<ng-template #defaultFindbarButtons>\n  <pdf-find-input-area [customFindbarInputArea]=\"customFindbarInputArea\"></pdf-find-input-area>\n  <pdf-findbar-options-one-container></pdf-findbar-options-one-container>\n  <pdf-findbar-options-two-container></pdf-findbar-options-two-container>\n  <pdf-findbar-options-three-container></pdf-findbar-options-three-container>\n  <pdf-findbar-message-container></pdf-findbar-message-container>\n</ng-template>\n",
                styles: [""]
            }] }
];
PdfFindbarComponent.propDecorators = {
    showFindButton: [{ type: Input }],
    mobileFriendlyZoomScale: [{ type: Input }],
    findbarLeft: [{ type: Input }],
    findbarTop: [{ type: Input }],
    customFindbarInputArea: [{ type: Input }],
    customFindbar: [{ type: Input }],
    customFindbarButtons: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    PdfFindbarComponent.prototype.showFindButton;
    /** @type {?} */
    PdfFindbarComponent.prototype.mobileFriendlyZoomScale;
    /** @type {?} */
    PdfFindbarComponent.prototype.findbarLeft;
    /** @type {?} */
    PdfFindbarComponent.prototype.findbarTop;
    /** @type {?} */
    PdfFindbarComponent.prototype.customFindbarInputArea;
    /** @type {?} */
    PdfFindbarComponent.prototype.customFindbar;
    /** @type {?} */
    PdfFindbarComponent.prototype.customFindbarButtons;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWZpbmRiYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvIiwic291cmNlcyI6WyJsaWIvdG9vbGJhci9wZGYtZmluZGJhci9wZGYtZmluZGJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPOUQsTUFBTSxPQUFPLG1CQUFtQjtJQUxoQztRQU9TLG1CQUFjLEdBQUcsSUFBSSxDQUFDO0lBb0IvQixDQUFDOzs7WUEzQkEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxhQUFhO2dCQUN2Qiw0aENBQTJDOzthQUU1Qzs7OzZCQUVFLEtBQUs7c0NBR0wsS0FBSzswQkFHTCxLQUFLO3lCQUdMLEtBQUs7cUNBSUwsS0FBSzs0QkFHTCxLQUFLO21DQUdMLEtBQUs7Ozs7SUFuQk4sNkNBQzZCOztJQUU3QixzREFDdUM7O0lBRXZDLDBDQUN1Qzs7SUFFdkMseUNBQ3NDOztJQUd0QyxxREFDZ0Q7O0lBRWhELDRDQUN1Qzs7SUFFdkMsbURBQzhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLWZpbmRiYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vcGRmLWZpbmRiYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wZGYtZmluZGJhci5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGRmRmluZGJhckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93RmluZEJ1dHRvbiA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHVibGljIG1vYmlsZUZyaWVuZGx5Wm9vbVNjYWxlOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGZpbmRiYXJMZWZ0OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGZpbmRiYXJUb3A6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKiBVSSB0ZW1wbGF0ZXMgKi9cbiAgQElucHV0KClcbiAgcHVibGljIGN1c3RvbUZpbmRiYXJJbnB1dEFyZWE6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KClcbiAgcHVibGljIGN1c3RvbUZpbmRiYXI6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KClcbiAgcHVibGljIGN1c3RvbUZpbmRiYXJCdXR0b25zOiBUZW1wbGF0ZVJlZjxhbnk+O1xufVxuIl19