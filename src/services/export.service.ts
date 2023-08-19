import { Injectable } from '@angular/core';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    public exportAsExcelFile(rows: any[], excelFileName: string): void {
        if (rows.length > 0) {

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
            const workbook: XLSX.WorkBook = { Sheets: { Hoja1: worksheet }, SheetNames: ['Hoja1'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, excelFileName);
        } else {
        }
    }
    private saveAsExcelFile(buffer: any, baseFileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, baseFileName + '_' + EXCEL_EXTENSION);
    }

    getBase64ImageFromURL(url: string) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.setAttribute("crossOrigin", "anonymous");

            img.onload = () => {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                var ctx = canvas.getContext("2d");
                ctx!.drawImage(img, 0, 0);

                var dataURL = canvas.toDataURL("image/png");

                resolve(dataURL);
            };

            img.onerror = error => {
                reject(error);
            };

            img.src = url;
        });
    }


}