import dotenv from 'dotenv';
dotenv.config();
const { Op } = require("sequelize");
import fetch from 'node-fetch';
import Db from '../class/Db';
import { Match, MatchHistoryResult, Player } from '../interface/matchHistory';


export default async function matchHistory(accountId: number) {
    const time = Date.now();
    try {
        const request = await fetch(`${process.env.base_url}IDOTA2Match_570/GetMatchHistory/v1/?account_id=${accountId}&game_mode=${process.env.game_mode}&key=${process.env.key_api2}`)
        const data = await request.json() as MatchHistoryResult;
        if (data && data.result && data.result.matches) {
            const filteredArray = data.result.matches
            if (filteredArray.length === 0) {
                return null;
            }
            const matchesSingle = new Set();
            const playersSingle = new Set();
            filteredArray.map((_match: Match) => {
                matchesSingle.add(+_match.match_id)
                _match.players.map((_player: Player) => {
                    playersSingle.add(+_player.account_id === 4294967295 ? (+_player.player_slot + 1) : +_player.account_id)
                },
                );
            });
            const matches: any[] = Array.from(matchesSingle)
            const players: any[] = Array.from(playersSingle)
            console.log('matchHistory ', matches, players, (-time + Date.now()) / 1000, 's');
            return { matches, players }
        }
        return null;
    } catch (error) {
        console.warn('<<<<<< matchHistory-error >>>>>>>')
        return null;
    }
}
