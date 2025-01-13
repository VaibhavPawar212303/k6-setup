import { open } from 'k6';
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export const takeScreenshot = async function (page, fileName) {
    //set path to store screenshot with given name
    let path = `../../screenshots/${fileName}.png`;
    // Capture screenshot
    page.screenshot({ path: path });

    console.log(`Screenshot saved: ../../screenshots/${fileName}.png`);
    // page.screenshot({ path: 'screenshots/previousScreenScreenshot.png' });
};

export const createHtmlReport = function (data, type) {
    if(type === 'Scoreboard'){
        // Define the path for the report
        let reportDir = './reports/html';
        let reportFileName = `Scoreboard_report_${Date.now()}.html`; // Unique filename based on timestamp
        let reportPath = `${reportDir}/${reportFileName}`;
        
        return {
            [reportPath]: htmlReport(data),
            stdout: textSummary(data, { indent: "", enableColors: true }),
        };
    }
    else{
        // Define the path for the report
        let reportDir = '../reports/html';
        let reportFileName = `${type}_report_${Date.now()}.html`; // Unique filename based on timestamp
        let reportPath = `${reportDir}/${reportFileName}`;
        
        return {
            [reportPath]: htmlReport(data),
            stdout: textSummary(data, { indent: "", enableColors: true }),
        };
    }
};

