import React from 'react';
import { ExportExcelJS, ExportToPdf } from '../../../shared/utils/ExportHelper';

function PurchaseTransactionsExportComponent() {
    const handlePdfExport = () => {
        ExportToPdf('purchaseTransactions', {
            title: 'Purchase Transaction',
            saveName: 'purchaseTransactions',
            pageFormat: { orientation: 'l', format: 'a4', lang: 'en' },
        });
    };

    const handleExcelExport = () => {
        ExportExcelJS(
            'purchaseTransactions',
            'Purchase Transaction',
            'purchaseTransactions',
            'en'
        );
    };

    return (
        <div className="row p-3 justify-content-end">
            <div>
                <button className="btn btn-sm btn-outline-secondary mr-1" onClick={handlePdfExport}>
                    <i className="btn-icon btn-icon-sm pdf-icon"></i>
                    Export To PDF
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleExcelExport}>
                    <i className="btn-icon btn-icon-sm xls-icon"></i>
                    Export To Excel
                </button>
            </div>
        </div>
    );
}

export default PurchaseTransactionsExportComponent;
