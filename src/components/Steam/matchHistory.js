import dotenv from 'dotenv';
dotenv.config();
const { Op } = require("sequelize");
import fetch from 'node-fetch';
import Db from '../../class/Db';


export default async function matchHistory(accountId) {
    const time = Date.now();
    try {
        console.log(`${process.env.base_url}IDOTA2Match_570/GetMatchHistory/v1/?account_id=${accountId}&game_mode=${process.env.game_mode}&key=${process.env.key_api2}`)
        const request = await fetch(`${process.env.base_url}IDOTA2Match_570/GetMatchHistory/v1/?account_id=${accountId}&game_mode=${process.env.game_mode}&key=${process.env.key_api2}`)
        const data = await request.json()
        if (data && data.result && data.result.matches) {
            const findMatch = (await Db.playersMatches.findAll({
                attributes: ['match_id'],
                logging: false,
                where: {
                    match_id: { [Op.or]: data.result.matches.map(x => x.match_id) },
                },
                raw:true
            })).map(x=>x.match_id)

            const filteredArray = data.result.matches.filter(value => !findMatch.includes(value.match_id));
            if (filteredArray.length === 0) {
                console.log((-time + Date.now()) / 1000, 's');
                console.log(filteredArray, 'Partidas já existem!')
                return null;
            }
            const matchesSingle = new Set();
            const playersSingle = new Set();
            filteredArray.map((_match) => {
                matchesSingle.add(+_match.match_id)
                _match.players.map((_player) => {
                    playersSingle.add(+_player.account_id === 4294967295 ? (+_player.player_slot + 1) : +_player.account_id)
                },
                );
            });
            const matches = Array.from(matchesSingle).map(x => JSON.parse(x))
            const players = Array.from(playersSingle).map(x => JSON.parse(x))
            console.log('matchHistory ',(-time + Date.now()) / 1000, 's');
            return { matches, players }
        }
        console.log('matchHistory-data', data)
        return null;
    } catch (error) {
        console.log('matchHistory-error', error)
        return null;
    }
}
