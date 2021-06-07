/**
 * @fileoverview added by tsickle
 * Generated from: lib/pdf-document-properties-extractor.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @record
 */
export function PdfDocumentInfo() { }
if (false) {
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.author;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.creationDate;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.creator;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.keywords;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.linearized;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.maybeFileSize;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.modificationDate;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.pdfFormatVersion;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.producer;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.subject;
    /** @type {?|undefined} */
    PdfDocumentInfo.prototype.title;
}
var PdfDocumentPropertiesExtractor = /** @class */ (function () {
    function PdfDocumentPropertiesExtractor() {
        this.pdfDateStringRegex = new RegExp('^D:' + // Prefix (required)
            '(\\d{4})' + // Year (required)
            '(\\d{2})?' + // Month (optional)
            '(\\d{2})?' + // Day (optional)
            '(\\d{2})?' + // Hour (optional)
            '(\\d{2})?' + // Minute (optional)
            '(\\d{2})?' + // Second (optional)
            '([Z|+|-])?' + // Universal time relation (optional)
            '(\\d{2})?' + // Offset hour (optional)
            // tslint:disable-next-line: quotemark
            "'?" + // Splitting apostrophe (optional)
            '(\\d{2})?' + // Offset minute (optional)
            // tslint:disable-next-line: quotemark
            "'?" // Trailing apostrophe (optional)
        );
    }
    /**
     * @return {?}
     */
    PdfDocumentPropertiesExtractor.prototype.getDocumentProperties = /**
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var PDFViewerApplication, pdfDocument, result;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                PDFViewerApplication = ((/** @type {?} */ (window)))
                    .PDFViewerApplication;
                pdfDocument = PDFViewerApplication.pdfDocument;
                result = {};
                return [2 /*return*/, pdfDocument
                        .getMetadata()
                        .then((/**
                     * @param {?} __0
                     * @return {?}
                     */
                    function (_a) {
                        var info = _a.info, metadata = _a.metadata, contentDispositionFilename = _a.contentDispositionFilename;
                        result.author = info.Author;
                        result.creationDate = _this.toDateObject(info.CreationDate);
                        result.creator = info.Creator;
                        result.keywords = info.Keywords;
                        result.linearized = info.IsLinearized;
                        result.modificationDate = _this.toDateObject(info.ModDate);
                        result.pdfFormatVersion = info.PDFFormatVersion;
                        result.producer = info.Producer;
                        result.subject = info.Subject;
                        result.title = info.Title;
                        if (contentDispositionFilename) {
                            result.fileName = contentDispositionFilename;
                        }
                        return pdfDocument.getDownloadInfo();
                    }))
                        .then((/**
                     * @param {?} __0
                     * @return {?}
                     */
                    function (_a) {
                        var length = _a.length;
                        result.maybeFileSize = length;
                        return result;
                    }))];
            });
        });
    };
    /** shamelessly copied from pdf.js */
    /**
     * shamelessly copied from pdf.js
     * @private
     * @param {?} input
     * @return {?}
     */
    PdfDocumentPropertiesExtractor.prototype.toDateObject = /**
     * shamelessly copied from pdf.js
     * @private
     * @param {?} input
     * @return {?}
     */
    function (input) {
        // if (!input ||  typeof input !== "string")) {
        //  return null;
        //  }
        // if (!input ||  typeof input !== "string")) {
        //  return null;
        //  }
        // Optional fields that don't satisfy the requirements from the regular
        // expression (such as incorrect digit counts or numbers that are out of
        // range) will fall back the defaults from the specification.
        /** @type {?} */
        var matches = this.pdfDateStringRegex.exec(input);
        if (!matches) {
            return null;
        }
        // JavaScript's `Date` object expects the month to be between 0 and 11
        // instead of 1 and 12, so we have to correct for that.
        /** @type {?} */
        var year = parseInt(matches[1], 10);
        /** @type {?} */
        var month = parseInt(matches[2], 10);
        month = month >= 1 && month <= 12 ? month - 1 : 0;
        /** @type {?} */
        var day = parseInt(matches[3], 10);
        day = day >= 1 && day <= 31 ? day : 1;
        /** @type {?} */
        var hour = parseInt(matches[4], 10);
        hour = hour >= 0 && hour <= 23 ? hour : 0;
        /** @type {?} */
        var minute = parseInt(matches[5], 10);
        minute = minute >= 0 && minute <= 59 ? minute : 0;
        /** @type {?} */
        var second = parseInt(matches[6], 10);
        second = second >= 0 && second <= 59 ? second : 0;
        /** @type {?} */
        var universalTimeRelation = matches[7] || 'Z';
        /** @type {?} */
        var offsetHour = parseInt(matches[8], 10);
        offsetHour = offsetHour >= 0 && offsetHour <= 23 ? offsetHour : 0;
        /** @type {?} */
        var offsetMinute = parseInt(matches[9], 10) || 0;
        offsetMinute = offsetMinute >= 0 && offsetMinute <= 59 ? offsetMinute : 0;
        // Universal time relation 'Z' means that the local time is equal to the
        // universal time, whereas the relations '+'/'-' indicate that the local
        // time is later respectively earlier than the universal time. Every date
        // is normalized to universal time.
        if (universalTimeRelation === '-') {
            hour += offsetHour;
            minute += offsetMinute;
        }
        else if (universalTimeRelation === '+') {
            hour -= offsetHour;
            minute -= offsetMinute;
        }
        return new Date(Date.UTC(year, month, day, hour, minute, second));
    };
    return PdfDocumentPropertiesExtractor;
}());
export { PdfDocumentPropertiesExtractor };
if (false) {
    /**
     * @type {?}
     * @private
     */
    PdfDocumentPropertiesExtractor.prototype.pdfDateStringRegex;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWRvY3VtZW50LXByb3BlcnRpZXMtZXh0cmFjdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIvIiwic291cmNlcyI6WyJsaWIvcGRmLWRvY3VtZW50LXByb3BlcnRpZXMtZXh0cmFjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBLHFDQWFDOzs7SUFaQyxpQ0FBZ0I7O0lBQ2hCLHVDQUFvQjs7SUFDcEIsa0NBQWlCOztJQUVqQixtQ0FBa0I7O0lBQ2xCLHFDQUFxQjs7SUFDckIsd0NBQXVCOztJQUN2QiwyQ0FBd0I7O0lBQ3hCLDJDQUEwQjs7SUFDMUIsbUNBQWtCOztJQUNsQixrQ0FBaUI7O0lBQ2pCLGdDQUFlOztBQUdqQjtJQUFBO1FBQ1UsdUJBQWtCLEdBQUcsSUFBSSxNQUFNLENBQ3JDLEtBQUssR0FBRyxvQkFBb0I7WUFDMUIsVUFBVSxHQUFHLGtCQUFrQjtZQUMvQixXQUFXLEdBQUcsbUJBQW1CO1lBQ2pDLFdBQVcsR0FBRyxpQkFBaUI7WUFDL0IsV0FBVyxHQUFHLGtCQUFrQjtZQUNoQyxXQUFXLEdBQUcsb0JBQW9CO1lBQ2xDLFdBQVcsR0FBRyxvQkFBb0I7WUFDbEMsWUFBWSxHQUFHLHFDQUFxQztZQUNwRCxXQUFXLEdBQUcseUJBQXlCO1lBQ3ZDLHNDQUFzQztZQUN0QyxJQUFJLEdBQUcsa0NBQWtDO1lBQ3pDLFdBQVcsR0FBRywyQkFBMkI7WUFDekMsc0NBQXNDO1lBQ3RDLElBQUksQ0FBQyxpQ0FBaUM7U0FDekMsQ0FBQztJQW1GSixDQUFDOzs7O0lBakZjLDhEQUFxQjs7O0lBQWxDOzs7OztnQkFDUSxvQkFBb0IsR0FBMEIsQ0FBQyxtQkFBQSxNQUFNLEVBQU8sQ0FBQztxQkFDaEUsb0JBQW9CO2dCQUNqQixXQUFXLEdBQUcsb0JBQW9CLENBQUMsV0FBVztnQkFFOUMsTUFBTSxHQUFRLEVBQUU7Z0JBQ3RCLHNCQUFPLFdBQVc7eUJBQ2YsV0FBVyxFQUFFO3lCQUNi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ZXNDb250ZW50IjpbImltcG9ydCB7IElQREZWaWV3ZXJBcHBsaWNhdGlvbiB9IGZyb20gJy4vb3B0aW9ucy9wZGYtdmlld2VyLWFwcGxpY2F0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBQZGZEb2N1bWVudEluZm8ge1xuICBhdXRob3I/OiBzdHJpbmc7XG4gIGNyZWF0aW9uRGF0ZT86IERhdGU7XG4gIGNyZWF0b3I/OiBzdHJpbmc7XG5cbiAga2V5d29yZHM/OiBzdHJpbmc7XG4gIGxpbmVhcml6ZWQ/OiBib29sZWFuO1xuICBtYXliZUZpbGVTaXplPzogc3RyaW5nO1xuICBtb2RpZmljYXRpb25EYXRlPzogRGF0ZTtcbiAgcGRmRm9ybWF0VmVyc2lvbj86IHN0cmluZztcbiAgcHJvZHVjZXI/OiBzdHJpbmc7XG4gIHN1YmplY3Q/OiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgUGRmRG9jdW1lbnRQcm9wZXJ0aWVzRXh0cmFjdG9yIHtcbiAgcHJpdmF0ZSBwZGZEYXRlU3RyaW5nUmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICdeRDonICsgLy8gUHJlZml4IChyZXF1aXJlZClcbiAgICAgICcoXFxcXGR7NH0pJyArIC8vIFllYXIgKHJlcXVpcmVkKVxuICAgICAgJyhcXFxcZHsyfSk/JyArIC8vIE1vbnRoIChvcHRpb25hbClcbiAgICAgICcoXFxcXGR7Mn0pPycgKyAvLyBEYXkgKG9wdGlvbmFsKVxuICAgICAgJyhcXFxcZHsyfSk/JyArIC8vIEhvdXIgKG9wdGlvbmFsKVxuICAgICAgJyhcXFxcZHsyfSk/JyArIC8vIE1pbnV0ZSAob3B0aW9uYWwpXG4gICAgICAnKFxcXFxkezJ9KT8nICsgLy8gU2Vjb25kIChvcHRpb25hbClcbiAgICAgICcoW1p8K3wtXSk/JyArIC8vIFVuaXZlcnNhbCB0aW1lIHJlbGF0aW9uIChvcHRpb25hbClcbiAgICAgICcoXFxcXGR7Mn0pPycgKyAvLyBPZmZzZXQgaG91ciAob3B0aW9uYWwpXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHF1b3RlbWFya1xuICAgICAgXCInP1wiICsgLy8gU3BsaXR0aW5nIGFwb3N0cm9waGUgKG9wdGlvbmFsKVxuICAgICAgJyhcXFxcZHsyfSk/JyArIC8vIE9mZnNldCBtaW51dGUgKG9wdGlvbmFsKVxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBxdW90ZW1hcmtcbiAgICAgIFwiJz9cIiAvLyBUcmFpbGluZyBhcG9zdHJvcGhlIChvcHRpb25hbClcbiAgKTtcblxuICBwdWJsaWMgYXN5bmMgZ2V0RG9jdW1lbnRQcm9wZXJ0aWVzKCk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KVxuICAgICAgLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIGNvbnN0IHBkZkRvY3VtZW50ID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQ7XG5cbiAgICBjb25zdCByZXN1bHQ6IGFueSA9IHt9O1xuICAgIHJldHVybiBwZGZEb2N1bWVudFxuICAgICAgLmdldE1ldGFkYXRhKClcbiAgICAgIC50aGVuKCh7IGluZm8sIG1ldGFkYXRhLCBjb250ZW50RGlzcG9zaXRpb25GaWxlbmFtZSB9KSA9PiB7XG4gICAgICAgIHJlc3VsdC5hdXRob3IgPSBpbmZvLkF1dGhvcjtcbiAgICAgICAgcmVzdWx0LmNyZWF0aW9uRGF0ZSA9IHRoaXMudG9EYXRlT2JqZWN0KFxuICAgICAgICAgIGluZm8uQ3JlYXRpb25EYXRlXG4gICAgICAgICk7XG4gICAgICAgIHJlc3VsdC5jcmVhdG9yID0gaW5mby5DcmVhdG9yO1xuICAgICAgICByZXN1bHQua2V5d29yZHMgPSBpbmZvLktleXdvcmRzO1xuICAgICAgICByZXN1bHQubGluZWFyaXplZCA9IGluZm8uSXNMaW5lYXJpemVkO1xuICAgICAgICByZXN1bHQubW9kaWZpY2F0aW9uRGF0ZSA9IHRoaXMudG9EYXRlT2JqZWN0KFxuICAgICAgICAgIGluZm8uTW9kRGF0ZVxuICAgICAgICApO1xuICAgICAgICByZXN1bHQucGRmRm9ybWF0VmVyc2lvbiA9IGluZm8uUERGRm9ybWF0VmVyc2lvbjtcbiAgICAgICAgcmVzdWx0LnByb2R1Y2VyID0gaW5mby5Qcm9kdWNlcjtcbiAgICAgIHJlc3VsdC5zdWJqZWN0ID0gaW5mby5TdWJqZWN0O1xuICAgICAgICByZXN1bHQudGl0bGUgPSBpbmZvLlRpdGxlO1xuICAgICAgICBpZiAoY29udGVudERpc3Bvc2l0aW9uRmlsZW5hbWUpIHtcbiAgICAgICAgICByZXN1bHQuZmlsZU5hbWUgPSBjb250ZW50RGlzcG9zaXRpb25GaWxlbmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGRmRG9jdW1lbnQuZ2V0RG93bmxvYWRJbmZvKCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKHsgbGVuZ3RoIH0pID0+IHtcbiAgICAgICAgcmVzdWx0Lm1heWJlRmlsZVNpemUgPSBsZW5ndGg7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBzaGFtZWxlc3NseSBjb3BpZWQgZnJvbSBwZGYuanMgKi9cbiAgcHJpdmF0ZSB0b0RhdGVPYmplY3QoaW5wdXQ6IHN0cmluZyB8IGFueSk6IERhdGUgfCBudWxsIHtcbiAgICAvLyBpZiAoIWlucHV0IHx8ICB0eXBlb2YgaW5wdXQgIT09IFwic3RyaW5nXCIpKSB7XG4gICAgLy8gIHJldHVybiBudWxsO1xuICAgIC8vICB9XG5cbiAgICAvLyBPcHRpb25hbCBmaWVsZHMgdGhhdCBkb24ndCBzYXRpc2Z5IHRoZSByZXF1aXJlbWVudHMgZnJvbSB0aGUgcmVndWxhclxuICAgIC8vIGV4cHJlc3Npb24gKHN1Y2ggYXMgaW5jb3JyZWN0IGRpZ2l0IGNvdW50cyBvciBudW1iZXJzIHRoYXQgYXJlIG91dCBvZlxuICAgIC8vIHJhbmdlKSB3aWxsIGZhbGwgYmFjayB0aGUgZGVmYXVsdHMgZnJvbSB0aGUgc3BlY2lmaWNhdGlvbi5cbiAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5wZGZEYXRlU3RyaW5nUmVnZXguZXhlYyhpbnB1dCk7XG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBKYXZhU2NyaXB0J3MgYERhdGVgIG9iamVjdCBleHBlY3RzIHRoZSBtb250aCB0byBiZSBiZXR3ZWVuIDAgYW5kIDExXG4gICAgLy8gaW5zdGVhZCBvZiAxIGFuZCAxMiwgc28gd2UgaGF2ZSB0byBjb3JyZWN0IGZvciB0aGF0LlxuICAgIGNvbnN0IHllYXIgPSBwYXJzZUludChtYXRjaGVzWzFdLCAxMCk7XG4gICAgbGV0IG1vbnRoID0gcGFyc2VJbnQobWF0Y2hlc1syXSwgMTApO1xuICAgIG1vbnRoID0gbW9udGggPj0gMSAmJiBtb250aCA8PSAxMiA/IG1vbnRoIC0gMSA6IDA7XG4gICAgbGV0IGRheSA9IHBhcnNlSW50KG1hdGNoZXNbM10sIDEwKTtcbiAgICBkYXkgPSBkYXkgPj0gMSAmJiBkYXkgPD0gMzEgPyBkYXkgOiAxO1xuICAgIGxldCBob3VyID0gcGFyc2VJbnQobWF0Y2hlc1s0XSwgMTApO1xuICAgIGhvdXIgPSBob3VyID49IDAgJiYgaG91ciA8PSAyMyA/IGhvdXIgOiAwO1xuICAgIGxldCBtaW51dGUgPSBwYXJzZUludChtYXRjaGVzWzVdLCAxMCk7XG4gICAgbWludXRlID0gbWludXRlID49IDAgJiYgbWludXRlIDw9IDU5ID8gbWludXRlIDogMDtcbiAgICBsZXQgc2Vjb25kID0gcGFyc2VJbnQobWF0Y2hlc1s2XSwgMTApO1xuICAgIHNlY29uZCA9IHNlY29uZCA+PSAwICYmIHNlY29uZCA8PSA1OSA/IHNlY29uZCA6IDA7XG4gICAgY29uc3QgdW5pdmVyc2FsVGltZVJlbGF0aW9uID0gbWF0Y2hlc1s3XSB8fCAnWic7XG4gICAgbGV0IG9mZnNldEhvdXIgPSBwYXJzZUludChtYXRjaGVzWzhdLCAxMCk7XG4gICAgb2Zmc2V0SG91ciA9IG9mZnNldEhvdXIgPj0gMCAmJiBvZmZzZXRIb3VyIDw9IDIzID8gb2Zmc2V0SG91ciA6IDA7XG4gICAgbGV0IG9mZnNldE1pbnV0ZSA9IHBhcnNlSW50KG1hdGNoZXNbOV0sIDEwKSB8fCAwO1xuICAgIG9mZnNldE1pbnV0ZSA9IG9mZnNldE1pbnV0ZSA+PSAwICYmIG9mZnNldE1pbnV0ZSA8PSA1OSA/IG9mZnNldE1pbnV0ZSA6IDA7XG5cbiAgICAvLyBVbml2ZXJzYWwgdGltZSByZWxhdGlvbiAnWicgbWVhbnMgdGhhdCB0aGUgbG9jYWwgdGltZSBpcyBlcXVhbCB0byB0aGVcbiAgICAvLyB1bml2ZXJzYWwgdGltZSwgd2hlcmVhcyB0aGUgcmVsYXRpb25zICcrJy8nLScgaW5kaWNhdGUgdGhhdCB0aGUgbG9jYWxcbiAgICAvLyB0aW1lIGlzIGxhdGVyIHJlc3BlY3RpdmVseSBlYXJsaWVyIHRoYW4gdGhlIHVuaXZlcnNhbCB0aW1lLiBFdmVyeSBkYXRlXG4gICAgLy8gaXMgbm9ybWFsaXplZCB0byB1bml2ZXJzYWwgdGltZS5cbiAgICBpZiAodW5pdmVyc2FsVGltZVJlbGF0aW9uID09PSAnLScpIHtcbiAgICAgIGhvdXIgKz0gb2Zmc2V0SG91cjtcbiAgICAgIG1pbnV0ZSArPSBvZmZzZXRNaW51dGU7XG4gICAgfSBlbHNlIGlmICh1bml2ZXJzYWxUaW1lUmVsYXRpb24gPT09ICcrJykge1xuICAgICAgaG91ciAtPSBvZmZzZXRIb3VyO1xuICAgICAgbWludXRlIC09IG9mZnNldE1pbnV0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQpKTtcbiAgfVxufVxuIl19