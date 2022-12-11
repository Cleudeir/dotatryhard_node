import dotenv from 'dotenv';
dotenv.config();
const { Op } = require("sequelize");
import fetch from 'node-fetch';
import Db from '../../class/Db';


export default async function matchHistory(accountId: any) {
    const time = Date.now();
    try {
        const request = await fetch(`${process.env.base_url}IDOTA2Match_570/GetMatchHistory/v1/?account_id=${accountId}&game_mode=${process.env.game_mode}&key=${process.env.key_api2}`)
        const data = await request.json()
        if (data && data.result && data.result.matches) {
            const findMatch = (await Db.playersMatches.findAll({
                attributes: ['match_id'],
                logging: false,
                where: {
                    match_id: { [Op.or]: data.result.matches.map((x: { match_id: any; }) => x.match_id) },
                },
                raw: true
            })).map((x: { match_id: any; }) => x.match_id)

            const filteredArray = data.result.matches.filter((value: { match_id: any; }) => !findMatch.includes(value.match_id));
            if (filteredArray.length === 0) {
                console.log('Partidas já existem!', (-time + Date.now()) / 1000, 's');
                return null;
            }
            const matchesSingle = new Set();
            const playersSingle = new Set();
            filteredArray.map((_match: { match_id: string | number; players: any[]; }) => {
                matchesSingle.add(+_match.match_id)
                _match.players.map((_player: { account_id: string | number; player_slot: string | number; }) => {
                    playersSingle.add(+_player.account_id === 4294967295 ? (+_player.player_slot + 1) : +_player.account_id)
                },
                );
            });
            const matches: any[] = Array.from(matchesSingle).map((x: any) => JSON.parse(x))
            const players: any[] = Array.from(playersSingle).map((x: any) => JSON.parse(x))
            console.log('matchHistory ', (-time + Date.now()) / 1000, 's');
            return { matches, players }
        }
        return null;
    } catch (error) {
        console.log('matchHistory-error', error)
        return null;
    }
}
