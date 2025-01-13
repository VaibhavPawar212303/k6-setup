import { sleep } from 'k6';
import { default as check_player_ranking} from './tests/check_player_ranking.js';
import { default as open_matchplay_summary} from './tests/open_matchplay_summary.js';
import { default as open_player_of_tournament } from './tests/open_player_of_tournament.js';
import { default as open_tournament_leaderboard } from './tests/open_tournament_leaderboard.js';
import { default as search_player } from './tests/search_player.js';
import { default as page_loading_validation } from './tests/validate-pageload.test.js';
import { default as response_validation } from './tests/validate-responses.test.js';
import { options } from './config/options.js';
import { createHtmlReport } from './config/common.js'

export { options };

// Run script related navigation and flows
export function navigation_scenario_test() {
    return check_player_ranking();
    return open_matchplay_summary();
    return open_player_of_tournament();
    return open_tournament_leaderboard();
    return search_player();
}

// Run script related page loading
export function page_load_test() {
    return page_loading_validation();
}

// Run script related response validations
export function response_validation_test() {
    return response_validation();
}

// Call all test functions
export default function () {
    navigation_scenario_test();
    page_load_test();
    response_validation_test();
}

// Capture the testing output and generate readable reports using plugin
export function handleSummary(data) {
    return createHtmlReport(data, 'Scoreboard')
}