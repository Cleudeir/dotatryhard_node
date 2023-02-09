export interface Player {
    account_id: number;
    player_slot: number;
    team_number: number;
    team_slot: number;
    hero_id: number;
}

export interface Match {
    match_id: number;
    match_seq_num: number;
    start_time: number;
    lobby_type: number;
    radiant_team_id: number;
    dire_team_id: number;
    players: Player[];
}