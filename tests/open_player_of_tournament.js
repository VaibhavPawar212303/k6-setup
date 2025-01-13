import http from 'k6/http';
import { check, sleep } from 'k6';
import { GET_TOURNAMENTS, GET_TOURNAMENTS_PLAYER } from '../config/constants.js';
import { tournament_id_for_players_without_group } from '../config/constants.js';
import { createHtmlReport } from '../config/common.js'
import { options } from '../config/options.js';
  
// Use the options object from options.js
// export { options };

export default function () {
    group('validate Opening all tournaments', function () {
        console.log("Opening all tournaments list");

        // Send a GET request to fetch tournaments
        const res = http.get(GET_TOURNAMENTS);

        // Check if the response status is 200
        check(res, { 'Response status is 200': (r) => r.status === 200 });

        // Parse the response body as JSON
        const tournaments = JSON.parse(res.body);

        // Extract tournamentIds from the response and store them in an array
        const tournamentIds = tournaments.results.map(tournament => tournament.tournamentId);

        // Randomly select a tournamentId from the list
        const randomIndex = Math.floor(Math.random() * tournamentIds.length);
        const selectedTournamentId = tournamentIds[randomIndex];

        // Sleep for 1 second before the next iteration
        sleep(1);

        //open tournament leaderboard
        get_player_tournament(selectedTournamentId);
    });
}

const get_player_tournament = id => {
    group('validate Opening one tournament from list', function () {
        console.log("Opening one tournament from list");

        let tournament_ID = id;

        const res = http.get(GET_TOURNAMENTS_PLAYER + '/' + tournament_ID + '/players');

        const responseBody = JSON.parse(res.body);

        // Check if the response contains the expected message
        if (responseBody.message && responseBody.message.startsWith("Unable to find records for tournament_id")) {
            console.log(`Tournament with ID ${tournament_ID} not found. Making request with another ID.`);

            tournament_ID = tournament_id_for_players_without_group; // Assign the backup tournament ID

            const resBackup = http.get(GET_TOURNAMENTS_PLAYER + '/' + tournament_ID + '/players');

            check(resBackup, { 'Response status is 200': (r) => r.status === 200 });

        }
        else {
            check(res, { 'Response status is 200': (r) => r.status === 200 });
        }

        sleep(1);
    });
};
 
// Capture the testing output and generate readable reports using plugin
export function handleSummary(data) {
    return createHtmlReport(data, 'open_tournament_players')
}