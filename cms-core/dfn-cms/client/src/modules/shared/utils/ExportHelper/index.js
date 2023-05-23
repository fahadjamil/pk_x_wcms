import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './customFonts/arial-normal';

const copyrightText = '© Copyright 2021 Boursa Kuwait. All Rights Reserved';
const copyrightTextAr =
    '2021 حقوق النشر والحقوق الفكرية الواردة في هذا الموقع، تحفظ لبورصة الكويت ©';
const totalPagesExp = '{total_pages_count_string}';

const pageFormats = [
    { format: 'a4', size: [595.28, 841.89] },
    { format: 'a3', size: [841.89, 1190.55] },
    { format: 'a2', size: [1190.55, 1683.78] },
    { format: 'a1', size: [1683.78, 2383.94] },
    { format: 'a0', size: [2383.94, 3370.39] },
];

const _getTableElements = (element) => {
    return Array.from(element.getElementsByTagName('TABLE'));
};

const _getPageFormat = (maxWidth) => {
    let pageFormat;

    for (let page of pageFormats) {
        if (Math.min(...page.size) >= maxWidth) {
            pageFormat = { orientation: 'p', format: page.format };
        } else if (Math.max(...page.size) >= maxWidth) {
            pageFormat = { orientation: 'l', format: page.format };
        }

        if (pageFormat) {
            break;
        }
    }

    if (!pageFormat) {
        pageFormat = { format: 'a4', orientation: 'landscape' };
    }

    return pageFormat;
};

const _getHeaderStyles = (tableElement) => {
    const header = tableElement.tHead;
    const styles = getComputedStyle(header);

    return {
        backgroundColor: '#c6974b', // Hardcoded value || styles.backgroundColor
        color: '#fff', // Hardcoded value || styles.color
    };
};

const reverseTable = (data) => {
    let finalData = [];
    data.forEach((element) => {
        let arr = element.reverse();
        finalData.push(arr);
    });
    return finalData;
};

const printPage = (doc) => {
    const hiddenFrame = document.createElement('iframe');
    // const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    let isSafari = '';
    if (typeof window !== 'undefined') {
        isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    }

    hiddenFrame.style.position = 'fixed';
    // "visibility: hidden" would trigger safety rules in some browsers like safari，
    // in which the iframe display in a pretty small size instead of hidden.
    // here is some little hack ~
    hiddenFrame.style.width = '1px';
    hiddenFrame.style.height = '1px';
    hiddenFrame.style.opacity = '0.01';

    if (isSafari) {
        // fallback in safari
        hiddenFrame.onload = () => {
            try {
                hiddenFrame.contentWindow.document.execCommand('print', false, null);
            } catch (e) {
                hiddenFrame.contentWindow.print();
            }
        };
    }
    hiddenFrame.src = doc.output('bloburl');
    document.body.appendChild(hiddenFrame);
};

const downloadCSV = (csvData, filename) => {
    const csvFile = new Blob(['\uFEFF' + csvData], { type: 'text/csv; charset=utf-18' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    if (typeof window !== 'undefined') {
        downloadLink.href = window.URL.createObjectURL(csvFile);
    }
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
};

/** Export page content
 *
 * @param {string} elementId                        Element id of the content which includes the table to export
 * @param {object} options                          Export options
 * @param {boolean} autoPrint                       Open print window. default is false. true if used in ExportToPrint
 * @param {string} options.title                    Title of the page. default ''
 * @param {string} options.saveName                 Export name. default is title or time stamp
 * @param {object} options.pageFormat               Page format as required by jsPDF
 * @param {string} options.pageFormat.orientation   'p' = portrait, 'l' = landscape
 * @param {string} options.pageFormat.format        Page size [ex: a2, a3, a4, b2, etc..]
 */
export const ExportToPdf = (elementId, options, autoPrint = false) => {
    if (!elementId) {
        console.error('Cannot export with empty element id'); // TODO: [Chathuranga] Use log error
        return;
    }

    const elementContent = document.getElementById(elementId);

    if (!elementContent) {
        console.error('Cannot find provided element for export'); // TODO: [Chathuranga] Use log error
        return;
    }

    const tableElements = _getTableElements(elementContent);

    try {
        if (tableElements.length) {
            let exportOptions = options || { saveName: `${Date.now()}.pdf` }; // Default pdf save name is set to current time

            if (exportOptions.saveName) {
                exportOptions.saveName = `${exportOptions.saveName}.pdf`;
            }

            let pageFormat = exportOptions.pageFormat;

            if (!pageFormat) {
                const maxTableWidth = Math.max(
                    tableElements.map((tableElement) => tableElement.clientWidth)
                );

                pageFormat = _getPageFormat(maxTableWidth);
            }

            const pdf = new jsPDF(pageFormat.orientation, 'pt', pageFormat.format);

            const res = pdf.autoTableHtmlToJson(tableElements[0]); // TODO: [Chathuranga] Support multiple table usage;
            const tableStyles = _getHeaderStyles(tableElements[0]);

            pdf.setFont('arial');

            let yPos = 0;
            let textAlign = pageFormat.lang == 'En' || pageFormat.lang == 'en' ? 'left' : 'right';
            const pageSize = pdf.internal.pageSize;
            const pageWidth = pageSize.getWidth() - 100;

            if (exportOptions.title) {
                pdf.text(40, 50, exportOptions.title, { lang: pageFormat.lang, align: textAlign });
                yPos = 60;
            }

            let columns =
                pageFormat.lang == 'EN' || pageFormat.lang == 'en'
                    ? res.columns
                    : res.columns.reverse();

            // Remove given column names from column array
            // removeColumns = ["column 1", "column 2"]
            if (options.removeColumns && options.removeColumns.length > 0) {
                options.removeColumns.forEach((column, columnIndex) => {
                    const index = columns.indexOf(column);

                    if (index > -1) {
                        columns.splice(index, 1);
                    }
                });
            }

            let finalData =
                pageFormat.lang == 'EN' || pageFormat.lang == 'en'
                    ? res.data
                    : reverseTable(res.data);
            let footerText =
                pageFormat.lang == 'EN' || pageFormat.lang == 'en'
                    ? copyrightText
                    : copyrightTextAr;
            let pageText = pageFormat.lang == 'EN' || pageFormat.lang == 'en' ? 'Page' : 'الصفحة';

            pdf.autoTable(columns, finalData, {
                tableWidth: 'auto',
                columnWidth: 'auto',
                startY: yPos,
                headStyles: {
                    fillColor: tableStyles.backgroundColor,
                    textColor: tableStyles.color,
                    halign: pageFormat.lang == 'EN' || pageFormat.lang == 'en' ? 'left' : 'right',
                    font: 'arial',
                },
                styles: {
                    overflow: 'linebreak',
                    font: 'arial',
                },
                didDrawPage: (data) => {
                    const pageSize = pdf.internal.pageSize;
                    const pageHeight = pageSize.getHeight();
                    const pageWidth = pageSize.getWidth();
                    let footerVerticalPos = pageHeight - 10;
                    pdf.setFontSize(10);

                    let pageNumber = pageText + pdf.internal.getNumberOfPages();

                    if (typeof pdf.putTotalPages === 'function') {
                        pageNumber = 'Page ' + data.pageNumber + ' of ' + totalPagesExp;
                    }

                    pdf.text(pageNumber, data.settings.margin.left, footerVerticalPos);
                    pdf.text(
                        footerText,
                        pageWidth - data.settings.margin.right,
                        footerVerticalPos,
                        { align: 'right' }
                    );
                },
            });

            if (typeof pdf.putTotalPages === 'function') {
                pdf.putTotalPages(totalPagesExp);
            }

            if (autoPrint) {
                pdf.autoPrint();
                printPage(pdf);
            } else {
                pdf.save(exportOptions.saveName);
            }
        }
    } catch (e) {
        console.error('Error while exporting data: ' + e); // TODO: [Chathuranga] Use log error
    }
};

export const ExportToPrint = (elementId, options) => {
    const defaultPrintPageFormat = { pageFormat: { orientation: 'p', format: 'a4' } };
    const exportOptions = options
        ? Object.assign(defaultPrintPageFormat, options)
        : defaultPrintPageFormat;
    ExportToPdf(elementId, exportOptions, true);
    // const elementContent = document.getElementById(elementId);
    // const fileName = `${options.title}.pdf`;
    // const tableElements = _getTableElements(elementContent);
    // const dataContent = tableToJsonNew(tableElements[0]);
    // let report = generateReport(dataContent, options.title, options);
    // let body = report.body;

    // if (typeof window !== 'undefined') {
    // let domWindow = window.open('', '', 'height=600,width=920');
    // domWindow.document.write('<html moznomarginboxes mozdisallowselectionprint><head>');
    // //domWindow.document.write(headerContent);
    // domWindow.document.write('</head><body>');
    // domWindow.document.write(body.outerHTML);
    // domWindow.document.write('<style type="text/css">  body {background-color: #ffffff; }</style>');
    // domWindow.document.title = options.title;
    // domWindow.document.write('</body></html>');

    // domWindow.document.close(); // necessary for IE >= 10
    // domWindow.focus(); // necessary for IE >= 10
    // domWindow.print(); // change window to winPrint
    // //domWindow.close();
    // }
};

/** Export csv data
 *
 * @param {string} elementId                        Element id of the content which includes the table to export
 * @param {string} saveName                         Export name. default is title or time stamp
 */
export const ExportToCsv = (elementId, saveName) => {
    if (!elementId) {
        console.error('Cannot export with empty element id'); // TODO: [Chathuranga] Use log error
        return;
    }

    const elementContent = document.getElementById(elementId);

    if (!elementContent) {
        console.error('Cannot find provided element for export'); // TODO: [Chathuranga] Use log error
        return;
    }

    const tableElements = _getTableElements(elementContent);

    try {
        if (tableElements.length === 1) {
            const fileName = saveName || `${Date.now()}.csv`; // Default csv save name is set to current time
            const csv = [];
            const rows = tableElements[0].querySelectorAll('tr');

            for (let i = 0; i < rows.length; i++) {
                let row = [],
                    cols = rows[i].querySelectorAll('td, th');

                for (let j = 0; j < cols.length; j++) row.push(cols[j].innerText);

                csv.push(row.join(',')); // TODO: [Tharindu] Use proper separation or use a regex to replace comma usage
            }

            downloadCSV(csv.join('\n'), fileName);
        } else {
            console.error('Element should include single table for export'); // TODO: [Chathuranga] Use log error
        }
    } catch (e) {
        console.error('Error while exporting csv data: ' + e); // TODO: [Chathuranga] Use log error
    }
};

/** Export csv data
 *
 * @param {string} elementId                        Element id of the content which includes the table to export
 * @param {string} saveName                         Export name. default is title or time stamp
 */

function tableToJson(table) {
    let data = []; // first row needs to be headers let headers = [];
    let headers = [];
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toUpperCase().replace(/<\/?[^>]+>/gi, '');
    }
    // go through cells
    for (let i = 1; i < table.rows.length; i++) {
        let tableRow = table.rows[i];
        let rowData = {};
        for (let j = 0; j < tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].innerHTML.replace(/<\/?[^>]+>/gi, '');
        }
        data.push(rowData);
    }
    return data;
}

export const ExportExcelJS = (elementId, title, saveName, lang, removeColumns = []) => {
    const sheetName = title;
    const fileName = `${saveName}.xlsx`;

    const elementContent = document.getElementById(elementId);

    if (!elementContent) {
        console.error('Cannot find provided element for export'); // TODO: [Chathuranga] Use log error
        return;
    }
    const tableElements = _getTableElements(elementContent);
    const dataContent = tableToJSONForExcelJS(tableElements[0], removeColumns);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    let maxColumnLength = 0;
    let columnLength = 0;
    let cellValue = '';
    let columnPadding = 2;

    worksheet.mergeCells('A4', 'F5');
    worksheet.getCell('A4').font = {
        name: 'Arial',
        family: 4,
        size: 20,
        underline: false,
        bold: true,
    };
    let siteDirection = lang == 'EN' || lang == 'en' ? 'left' : 'right';
    worksheet.getCell('A4').alignment = { horizontal: siteDirection };
    worksheet.getCell('A4').value = sheetName;

    worksheet.addTable({
        name: 'table',
        ref: 'A7',
        headerRow: true,
        columns: dataContent.headers,
        rows: dataContent.data,
    });

    worksheet.columns.forEach((column) => {
        maxColumnLength = 0;

        column.eachCell({ includeEmpty: false }, function (cell) {
            if (cell.value && cell.value !== sheetName) {
                cellValue = String(cell.value);
                columnLength = cellValue.length;

                if (columnLength > maxColumnLength) {
                    maxColumnLength = columnLength;
                }
            }
        });
        column.width = maxColumnLength < 10 ? 10 : maxColumnLength + columnPadding;
    });

    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });
        if (typeof window !== 'undefined') {
            let elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = fileName;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    });
};

const tableToJSONForExcelJS = (table, removeColumns) => {
    let data = []; // first row needs to be headers let headers = [];
    let headers = [];
    let obj = {};
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        const removeThisColumn = removeColumns.includes(i + 1);

        if (removeThisColumn) {
            continue;
        }

        let rowElements = table.rows[0].cells[i].innerHTML
            .toUpperCase()
            .replace(/<\/?[^>]+>/gi, '');
        if (rowElements != '') {
            obj = { name: rowElements };
        } else {
            continue;
        }
        headers.push(obj);
    }
    // go through cells
    for (let i = 1; i < table.rows.length; i++) {
        let tableRow = table.rows[i];
        let emptyArray = [];
        for (let j = 0; j < tableRow.cells.length; j++) {
            const removeThisColumn = removeColumns.includes(j + 1);

            if (removeThisColumn) {
                continue;
            }

            let rowEle = tableRow.cells[j].innerHTML.replace(/<\/?[^>]+>/gi, '');
            emptyArray.push(rowEle);
            // if (rowEle != '') {
            //     emptyArray.push(rowEle);
            // }
        }
        data.push(emptyArray);
    }
    return { data, headers };
};

function tableToJsonNew(table) {
    let data = []; // first row needs to be headers let headers = [];
    let headers = [];
    let obj = {};
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        let rowElements = table.rows[0].cells[i].innerHTML
            .toUpperCase()
            .replace(/<\/?[^>]+>/gi, '');
        if (rowElements != '') {
            obj = { name: rowElements };
        } else {
            continue;
        }
        headers.push(obj);
    }
    // go through cells
    for (let i = 1; i < table.rows.length; i++) {
        let tableRow = table.rows[i];
        let emptyArray = [];
        for (let j = 0; j < tableRow.cells.length; j++) {
            let rowEle = tableRow.cells[j].innerHTML.replace(/<\/?[^>]+>/gi, '');
            if (rowEle != '') {
                emptyArray.push(rowEle);
            }
        }
        data.push(emptyArray);
    }
    return { data, headers };
}

function generateReport(tableContentArray, name, options) {
    let language = options.pageFormat.lang;
    let tableContent = tableContentArray;
    let body = document.createElement('body');
    let header = document.createElement('div');
    let h3 = document.createElement('h3');
    let title = document.createTextNode(name);
    let contentTable = document.createElement('table');
    let linebreak1 = document.createElement('br');
    let linebreak2 = document.createElement('br');
    let linebreak3 = document.createElement('br');
    let table, headerTable, tHeader, trHeader, tdHeaderImg, tdHeaderTitle;

    h3.appendChild(title);
    header.appendChild(h3);
    language == 'EN'
        ? header.setAttribute('style', 'direction: ltr;')
        : header.setAttribute('style', 'direction: rtl;');

    contentTable.setAttribute('style', 'width: 100%; margin-top: 60px;');
    header.appendChild(contentTable);

    //header.appendChild(linebreak1);

    body.setAttribute(
        'style',
        'font-family: "Open Sans", sans-serif; -webkit-print-color-adjust: exact; color-adjust: exact; printer-colors: exact;'
    );

    table = document.createElement('table');
    let headerRow = document.createElement('tr');
    let tblBody = document.createElement('tbody');

    language == 'EN'
        ? headerRow.setAttribute(
              'style',
              'background-color: #c4954a !important; color: white; width: 25px; direction: ltr'
          )
        : headerRow.setAttribute(
              'style',
              'background-color: #c4954a !important; color: white; width: 25px; direction: rtl'
          );

    let headerArray = tableContent.headers;
    headerArray.forEach((element) => {
        let headTitle = document.createElement('th');
        let headText = document.createTextNode(element.name);
        headTitle.appendChild(headText);
        headerRow.appendChild(headTitle);
    });

    tblBody.appendChild(headerRow);
    table.appendChild(tblBody);
    body.appendChild(header);

    if (tableContent && tableContent.data.length > 0) {
        let data = tableContent.data;
        for (let i = 0; i < data.length; i++) {
            // creates a table row
            let row = document.createElement('tr');
            for (let j = 0; j < data[i].length; j++) {
                // Create a <td> element and a text node, make the text
                // node the contents of the <td>, and put the <td> at
                // the end of the table row
                let cell = document.createElement('td');
                let cellText = document.createTextNode(data[i][j]);
                cell.appendChild(cellText);
                row.appendChild(cell);
            }

            // add the row to the end of the table body
            tblBody.appendChild(row);
        }
    }

    table.appendChild(tblBody);
    body.appendChild(table);
    language == 'EN'
        ? table.setAttribute(
              'style',
              'font-size: 12px; width: 100%; border-radius:4px; direction: ltr'
          )
        : table.setAttribute(
              'style',
              'font-size: 12px; width: 100%; border-radius:10px; direction: rtl'
          );

    return {
        body: body,
        header: header,
        // table: table
    };
}

// exports.ExportToPdf = ExportToPdf; // Supports only table export
// exports.ExportToPrint = ExportToPrint;
// exports.ExportToCsv = ExportToCsv;
// exports.ExportExcelJS = ExportExcelJS;
