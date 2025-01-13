import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { parseHTML } from 'k6/html';
import {takeScreenshot, createHtmlReport} from '../config/common.js';
import { options } from '../config/browserOption.js';

export {options};

export default async function () {
  const page = browser.newPage();

  try {
    await page.goto('https://stage-blue.stagescoreboard.clippd.com/results/current');
    takeScreenshot(page,'screenshot1.png')

    // Click on the "Previous Tournaments" link
    await page.waitForSelector('a[href="/results/previous"]');
    await page.click('a[href="/results/previous"]');

    // sleep for 1 sec to see tournaments list
    sleep(1);

    // Check if the "Previous" header is displayed
    check(page, {
        'Header is displayed': () => page.innerText('h3.text-lg') === 'Previous',
    });
    takeScreenshot(page, 'image2')

  } finally {
    page.close();
  }
}

// Capture the testing output and generate readable reports using plugin
export function handleSummary(data) {
  createHtmlReport(data)
    return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: "", enableColors: true }),
    };
}