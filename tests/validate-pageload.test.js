import http from 'k6/http';
import { group, check, sleep } from 'k6';
import { RESULTS_PAGE, SCHEDULE_PAGE, RANKINGS_PAGE, TEAMS_PAGE, PLAYERS_PAGE } from '../config/constants.js'
import { createHtmlReport } from '../config/common.js'


export default function rankingPageLoadTest() {
    group('validate page loading time of different pages', function () {
        //validate page load on results page
        const results = http.get(RESULTS_PAGE);
        if (results.status != 200) {
            console.log('error code', results.status);
        }
        check(results, { 'Validate response of api for results page should be 200': (r) => r.status == 200 });
        sleep(1);

        //validate page load on Schedule page
        const Schedule = http.get(SCHEDULE_PAGE);
        if (Schedule.status != 200) {
            console.log('error code', Schedule.status);
        }
        check(Schedule, { 'Validate response of api for schedule page should be 200': (r) => r.status == 200 });
        sleep(1);

        //validate page load on Rankings page
        const Rankings = http.get(RANKINGS_PAGE);
        if (Schedule.status != 200) {
            console.log('error code', Rankings.status);
        }
        check(Rankings, { 'Validate response of api for rankings page should be 200': (r) => r.status == 200 });
        sleep(1);

        //validate page load on Teams page
        const Teams = http.get(TEAMS_PAGE);
        if (Teams.status != 200) {
            console.log('error code', Teams.status);
        }
        check(Teams, { 'Validate response of api for teams page should be 200': (r) => r.status == 200 });
        sleep(1);

        //validate page load on Players page
        const Players = http.get(PLAYERS_PAGE);
        if (Players.status != 200) {
            console.log('error code', Players.status);
        }
        check(Players, { 'Validate response of api for players page should be 200': (r) => r.status == 200 });
        sleep(1);
    });
}

// Capture the testing output and generate readable reports using plugin
export function handleSummary(data) {
    return createHtmlReport(data, 'validate_page_reloads')
}