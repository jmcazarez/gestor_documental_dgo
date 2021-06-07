import { TemplateRef, ElementRef, OnDestroy, EventEmitter } from '@angular/core';
import { PdfThumbnailDrawnEvent } from '../../../events/pdf-thumbnail-drawn-event';
export declare class PdfSidebarContentComponent implements OnDestroy {
    customThumbnail: TemplateRef<any>;
    thumbnailViewTemplate: ElementRef;
    private linkService;
    thumbnailDrawn: EventEmitter<PdfThumbnailDrawnEvent>;
    top: string;
    _hideSidebarToolbar: boolean;
    constructor();
    ngOnDestroy(): void;
    pdfThumbnailGeneratorReady(): boolean;
    private createThumbnail;
    private createElementFromHTML;
    onKeyDown(event: KeyboardEvent): void;
    hideSidebarToolbar: boolean;
}
