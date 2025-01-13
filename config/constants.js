export const BASE_URL = 'https://stage-blue.stagescoreboard.clippd.com';

export const GET_TOURNAMENTS = BASE_URL+'/api/search/tournaments';
export const GET_LEADERBOARD_OF_TOURNAMENT = BASE_URL+'/restapi/public/leaderboard'; // here should {tournament_id}
export const GET_PLAYER_OF_TOURNAMENT = BASE_URL+'/restapi/public/scorecard'; // here should {tournament_id}/players
export const GET_MATCHPLAY_GROUP = BASE_URL+'/restapi/public/matchplay'; // here should {tournament_id}/groups/{round-id}
export const GET_PLAYER_RANK = BASE_URL+'/restapi/public/rankings/player'; // here should {player_id}
export const GET_MATCHPLAY_SUMMARY = BASE_URL+'/restapi/public/matchplay';// here should {tournamentId}/summary
export const SEARCH_FOR_PLAYER = BASE_URL+'/api/search/players'
export const GET_TOURNAMENTS_PLAYER = BASE_URL+'/restapi/public/tournaments'
export const RESULTS_PAGE =  BASE_URL+'/results/current'
export const SCHEDULE_PAGE =  BASE_URL+'/schedule'
export const RANKINGS_PAGE = BASE_URL+'/rankings'
export const TEAMS_PAGE = BASE_URL+'/teams/search'
export const SEARCH_FOR_TEAM = BASE_URL+'/api/search/teams'
export const PLAYERS_PAGE = BASE_URL+'/players/search'
export const RANKING_LEADERBOARD =  BASE_URL+'/api/rankings/leaderboard'
export const SEARCH_FOR_TOURNAMENT = BASE_URL+'/api/search/tournaments'

// Data
export const tournament_id_for_matchplay = 301748;
export const tournament_id_for_players = 301749;
export const tournament_id_for_players_without_group = 231287;
export const tournament_id_for_leaderboard = 230726;

//responses
export const size_limit_32 = 32;