import { TemplateRef, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PdfThumbnailDrawnEvent } from '../../events/pdf-thumbnail-drawn-event';
export declare class PdfSidebarComponent {
    private elementRef;
    private ref;
    sidebarPositionTop: number;
    sidebarVisible: boolean;
    showSidebarButton: boolean;
    customSidebar: TemplateRef<any>;
    customThumbnail: TemplateRef<any>;
    thumbnailDrawn: EventEmitter<PdfThumbnailDrawnEvent>;
    hideSidebarToolbar: boolean;
    constructor(elementRef: ElementRef, ref: ChangeDetectorRef);
    showToolbarWhenNecessary(): void;
}
