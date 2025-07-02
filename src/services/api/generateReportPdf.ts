import axios from 'axios';

import { API_SERVICE_URL } from '@/config';

export const generateReportPdf = async (data: { age: number; name: string; diagnosis: string; reportType: string; image: string; selectedTooth: string }): Promise<any> => {
    const report = `report-${new Date().getTime()}.pdf`;
    return new Promise((resolve, reject) => {
        axios
            .post(API_SERVICE_URL + '/pdf/pdfReport', data, {
                responseType: 'blob',
            })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', report);
                document.body.appendChild(link);
                link.click();
                link.remove();
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};
