/**
 * @fileoverview added by tsickle
 * Generated from: lib/toolbar/pdf-zoom-toolbar/pdf-zoom-toolbar.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
export class PdfZoomToolbarComponent {
    constructor() {
        this.showZoomButtons = true;
        this.zoomLevels = ['auto', 'page-actual', 'page-fit', 'page-width', 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
    }
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
if (false) {
    /** @type {?} */
    PdfZoomToolbarComponent.prototype.showZoomButtons;
    /** @type {?} */
    PdfZoomToolbarComponent.prototype.zoomLevels;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXpvb20tdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlci8iLCJzb3VyY2VzIjpbImxpYi90b29sYmFyL3BkZi16b29tLXRvb2xiYXIvcGRmLXpvb20tdG9vbGJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBd0IsTUFBTSxlQUFlLENBQUM7QUFPL0UsTUFBTSxPQUFPLHVCQUF1QjtJQUxwQztRQVFTLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBR3ZCLGVBQVUsR0FBRyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUcsQ0FBQzs7O1lBWkEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLHdTQUFnRDs7YUFFakQ7Ozs4QkFHRSxLQUFLO3lCQUdMLEtBQUs7Ozs7SUFITixrREFDOEI7O0lBRTlCLDZDQUN3RyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGRmLXpvb20tdG9vbGJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9wZGYtem9vbS10b29sYmFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGRmLXpvb20tdG9vbGJhci5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGRmWm9vbVRvb2xiYXJDb21wb25lbnQge1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93Wm9vbUJ1dHRvbnMgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB6b29tTGV2ZWxzID0gWydhdXRvJywgJ3BhZ2UtYWN0dWFsJywgJ3BhZ2UtZml0JywgJ3BhZ2Utd2lkdGgnLCAwLjUsIDAuNzUsIDEsIDEuMjUsIDEuNSwgMiwgMywgNF07XG59XG4iXX0=