import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { BASE_URL, GET_TOURNAMENTS, SCHEDULE_PAGE, SEARCH_FOR_TEAM, SEARCH_FOR_TOURNAMENT, RANKINGS_PAGE, RANKING_LEADERBOARD } from '../config/constants.js'
import { size_limit_32 } from '../config/constants.js'
import { createHtmlReport } from '../config/common.js'


let selectedDivision;
let selectedGender;
let selectedSchoolId;

export default function () {
    group('validate Opening all tournaments list to get division', function () {

        // Send a GET request to fetch tournaments
        const res = http.get(GET_TOURNAMENTS);

        // Check if the response status is 200
        check(res, { 'Response status is 200': (r) => r.status === 200 });

        // Parse the response body as JSON
        const tournaments = JSON.parse(res.body);

        // Extract divisions from the response and store them in an array
        const divisions = tournaments.results.map(tournament => tournament.division);

        // Extract genders from the response and store them in an array
        const genders = tournaments.results.map(tournament => tournament.gender);

        // Randomly select a division from the list
        const randomIndex = Math.floor(Math.random() * divisions.length);
        selectedDivision = divisions[randomIndex];

        // Randomly select a gender from the list
        const randomGenderIndex = Math.floor(Math.random() * genders.length);
        selectedGender = genders[randomGenderIndex];

        // Sleep for 1 second before the next iteration
        sleep(1);
        rankingsApiTest();
        sleep(1);
        schedulePageApiTest();
    });        
}

function rankingsApiTest() {
    // Replace spaces with %20 in divisionName
    const encodedDivisionName = encodeURIComponent(selectedDivision);
    const gender = selectedGender;

    group('validate response from rankings api', function () {
        const resOne = http.get(RANKINGS_PAGE);
        if (resOne.status != 200) {
            console.log('error code', resOne.status);
        }
        check(resOne, { 'Validate response of api for rankings page should be 200': (r) => r.status == 200 });
        sleep(1);
    });

    group('validate rankings data', function () {
        const URL = RANKING_LEADERBOARD+'?rankingType=Team'+'&gender='+gender+'&division='+encodedDivisionName+'&sortField=rank&limit='+size_limit_32+'&offset='+size_limit_32;
        const rankings = http.get(URL);

        // Parse the response body as JSON
        const rankingsResponse = JSON.parse(rankings.body);

        // Extract divisions from the response and store them in an array
        const schoolIds = rankingsResponse.results.map(ranking => ranking.schoolId);

        // Randomly select a division from the list
        const randomIndex = Math.floor(Math.random() * schoolIds.length);
        selectedSchoolId = schoolIds[randomIndex];

        check(rankings, { 'Validate response of api for rankings details should be 200': (r) => r.status == 200 });
        check(rankings, { 'response should be success': (r) => r.json().result == 'success' });
        check(rankings, { 'response size should be 32': (r) => r.json().results.length == 32 });
        check(rankings, { 'response object length should be greated than 0': (r) => r.json().results.length > 0 });
        
        //objects fields 
        let requiredFields = ['gender', 'schoolId', 'schoolName', 'schoolLogo', 'schoolLogoThumbnail', 'division', 'conference', 'region', 'boardName', 'rank', 'rankingDate', 'averagePoints', 'totalPoints', 'totalWeight', 'regionalRank', 'divisionalRank', 'strokePlayEvents', 'strokePlayRounds', 'matchPlayEvents', 'matchPlayRounds', 'eventsWon', 'eventsTop3', 'strengthOfSchedule', 'strengthOfScheduleRank', 'averageScore', 'adjustedScore', 'winLossTie', 'startDate', 'endDate'];
        let allFieldsPresent = true;
        
        // Check if all required fields are present in the response object
        requiredFields.forEach(field => {
            if (!rankings.json().results[0].hasOwnProperty(field)) {
                console.log(`Required field '${field}' is missing from the response object`);
                allFieldsPresent = false;
            }
        });

        //validate the fileds of the objects 
        check(rankings, { 'Validate fields of the object': (r) => allFieldsPresent === true });
        sleep(1);

    });

    group('validate team response', function () {
        const id = selectedSchoolId;
        const teamPage = http.get(BASE_URL+'/teams/'+id);

        check(teamPage, { 'Validate response of api for team should be 200': (r) => r.status == 200 });

        const teams = http.get(SEARCH_FOR_TEAM+'?schoolId='+id);
        check(teams, { 'Validate response of api for team should be 200': (r) => r.status == 200 });
    });

    group('validate roster page for selected team', function () {
        const id = selectedSchoolId;
        const roster = http.get(BASE_URL+'/teams/'+id+'/roster');
        check(roster, { 'Validate response of api for roster page for selected team should be 200': (r) => r.status == 200 });
    });
}

function schedulePageApiTest() {
    group('validate schedule page api', function () {
        //validate page load on results page
        const results = http.get(SCHEDULE_PAGE);
        if (results.status != 200) {
            console.log('error code', results.status);
        }
        check(results, { 'Validate response of api for results page should be 200': (r) => r.status == 200 });
        sleep(1);
    });

    group('validate schedule data', function () {
        const schedule = http.get(SEARCH_FOR_TOURNAMENT+'?month=09&year=2024&filter=global&offset=0&limit=12');

        check(schedule, { 'Validate response of api for rankings details should be 200': (r) => r.status == 200 });
        check(schedule, { 'response should be success': (r) => r.json().result == 'success' });
        check(schedule, { 'response size should be 32': (r) => r.json().results.length == 12 });
        check(schedule, { 'response object length should be greated than 0': (r) => r.json().results.length > 0 });
        
        //objects fields 
        let requiredFields = ['state', 'city', 'hostId', 'gender', 'hostName', 'division', 'hostBoardName', 'hostType', 'schoolLogo', 'schoolLogoThumbnail', 'division', 'tournamentId', 'tournamentName', 'eventType', 'startDate', 'endDate', 'tournamentLogo', 'venue', 'inviteType', 'hasResults', 'isComplete', 'competingSchools', 'numTeamPlayers', 'numTeamScoring'];
        let allFieldsPresent = true;

        // Check if all required fields are present in the response object
        requiredFields.forEach(field => {
            if (!schedule.json().results[0].hasOwnProperty(field)) {
                console.log(`Required field '${field}' is missing from the response object`);
                allFieldsPresent = false;
            }
        });

        //validate the fileds of the objects 
        check(schedule, { 'Validate fields of the object': (r) => allFieldsPresent === true });
        sleep(1);

    });
}

// Capture the testing output and generate readable reports using plugin
export function handleSummary(data) {
    return createHtmlReport(data, 'validate_responses')
}