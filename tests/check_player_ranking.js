import http from 'k6/http';
import { group, check, sleep } from 'k6';
import { GET_TOURNAMENTS, GET_MATCHPLAY_SUMMARY, GET_PLAYER_OF_TOURNAMENT, GET_PLAYER_RANK } from '../config/constants.js';
import { tournament_id_for_matchplay, tournament_id_for_players } from '../config/constants.js'
import { createHtmlReport } from '../config/common.js'
import { options } from '../config/options.js';
  
// Use the options object from options.js
// export { options };

export default function () {
    group('validate Opening all tournaments list', function () {
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
        get_tournament_matchplay_summary(selectedTournamentId);
    });        
}

const get_tournament_matchplay_summary = id => {
    group('validate Opening matchplay summary', function () {
        console.log("Opening matchplay summary");

        let tournament_ID = id;

        const res = http.get(GET_MATCHPLAY_SUMMARY + '/' + tournament_ID + '/summary');

        const responseBody = JSON.parse(res.body);

        // Check if the response contains the expected message
        if (responseBody.message && responseBody.message.startsWith("Unable to find match play tournament")) {
            console.log(`Tournament with ID ${tournament_ID} not found. Making request with another ID.`);

            tournament_ID = tournament_id_for_matchplay; // Assign the backup tournament ID

            const res = http.get(GET_MATCHPLAY_SUMMARY + '/' + tournament_ID + '/summary');

            // Check if the response status is 200
            check(res, { 'Response status is 200': (r) => r.status === 200 });

            // Parse the response body as JSON
            const summary = JSON.parse(res.body);

            // Check if the response contains the expected structure
            if (summary.leaderboard && summary.leaderboard.rounds && summary.leaderboard.rounds.length > 0) {
                // Extract roundIds from the response and store them in an array
                const roundIds = summary.leaderboard.rounds.map(round => round.roundId);

                // Selecting a random roundId (assuming only one roundId for simplicity)
                const selectedRoundId = roundIds[Math.floor(Math.random() * roundIds.length)];
                        
                // Pass both tournamentId and roundId to get_tournament_players function
                get_tournament_players(tournament_ID, selectedRoundId);
            } else {
                console.error("Unexpected response structure:", summary);
            }

        }
        else {
            // Check if the response status is 200
            check(res, { 'Response status is 200': (r) => r.status === 200 });

            // Parse the response body as JSON
            const summary = JSON.parse(res.body);

            // Check if the response contains the expected structure
            if (summary.leaderboard && summary.leaderboard.rounds && summary.leaderboard.rounds.length > 0) {
                // Extract roundIds from the response and store them in an array
                const roundIds = summary.leaderboard.rounds.map(round => round.roundId);

                // Selecting a random roundId (assuming only one roundId for simplicity)
                const selectedRoundId = roundIds[Math.floor(Math.random() * roundIds.length)];
                        
                // Pass both tournamentId and roundId to get_tournament_players function
                get_tournament_players(tournament_ID, selectedRoundId);
            } else {
                console.error("Unexpected response structure:", summary);
            }
        }

        sleep(1);
    });
};


const get_tournament_players = (tournamentId, roundId) => {
    group('validate Opening players of tournament', function () {
        console.log("Opening player of tournament");

        const res = http.get(GET_PLAYER_OF_TOURNAMENT + '/' + tournamentId + '/' + roundId + '/players');

        const responseBody = JSON.parse(res.body);

        // Check if the response contains the expected message
        if (responseBody.message && responseBody.message.startsWith("Unable to find records for tournament_id")) {
            console.log(`Tournament with ID ${tournamentId} not found. Making request with another ID.`);

            tournamentId = tournament_id_for_players; // Assign the backup tournament ID

            const res = http.get(GET_PLAYER_OF_TOURNAMENT + '/' + tournamentId + '/' + roundId + '/players');

            // Parse the response body as JSON
            const players = JSON.parse(res.body);

            // Check if the response contains the expected structure
            if (players && players.leaderboard && players.leaderboard.results) {
                // Extract PlayerIds from the response and store them in an array
                const playerIds = players.leaderboard.results.map(player => player.playerId);

                // Randomly select a PlayerIds from the list
                const randomIndex = Math.floor(Math.random() * playerIds.length);
                const selectedPlayerId = playerIds[randomIndex];
                get_player_rank(selectedPlayerId)
            } else {
                console.error("Unexpected response structure:", players);
            }

        }
        else {
            // Parse the response body as JSON
            const players = JSON.parse(res.body);

            // Check if the response contains the expected structure
            if (players && players.leaderboard && players.leaderboard.results) {
                // Extract PlayerIds from the response and store them in an array
                const playerIds = players.leaderboard.results.map(player => player.playerId);

                // Randomly select a PlayerIds from the list
                const randomIndex = Math.floor(Math.random() * playerIds.length);
                const selectedPlayerId = playerIds[randomIndex];
                get_player_rank(selectedPlayerId)
            } else {
                console.error("Unexpected response structure:", players);
            }
        }

        sleep(1);
    });
};

const get_player_rank = id => {
    group('validate Opening player rank', function () {
        console.log("Opening player rank");

        let player_Id = id;

        const res = http.get(GET_PLAYER_RANK + '/' + player_Id);

        // Check if the response status is 200
        check(res, { 'Response status is 200': (r) => r.status === 200 });

        sleep(1);
    });
};
 
// Capture the testing output and generate readable reports using plugin
export function handleSummary(data) {
    return createHtmlReport(data, 'check_player_rank')
}