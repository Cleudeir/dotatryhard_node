import dotenv from 'dotenv';


import fetch from 'node-fetch';

import Db from '../../class/Db';
dotenv.config();

export default async function matchHistory(accountId) {
    try {
        console.log(`${process.env.base_url}IDOTA2Match_570/GetMatchHistory/v1/?account_id=${accountId}&game_mode=${process.env.game_mode}&key=${process.env.key_api}`)
        const request = await fetch(`${process.env.base_url}IDOTA2Match_570/GetMatchHistory/v1/?account_id=${accountId}&game_mode=${process.env.game_mode}&key=${process.env.key_api}`)
        const data = await request.json()
        if (data && data.result && data.result.matches) {
            const matchesSingle = new Set();
            const playersSingle = new Set();
            const playerMatchesArraySingle = new Set();
            data.result.matches.map((_match) => {
                matchesSingle.add({
                    match_id: +_match.match_id,
                    start_time: +_match.start_time,
                    cluster: '',
                    dire_score: -1,
                    radiant_score: -1,
                    duration: -1,
                })
                _match.players.map((_player) => {
                    console.log(_player)
                    playersSingle.add(+_player.account_id)
                    playerMatchesArraySingle.add({
                        account_id: +_player.account_id,
                        match_id: +_match.match_id,
                        assists: -1,
                        deaths: -1,
                        denies: -1,
                        gold_per_min: -1,
                        hero_damage: -1,
                        hero_healing: -1,
                        kills: -1,
                        last_hits: -1,
                        net_worth: -1,
                        tower_damage: -1,
                        xp_per_min: -1,
                        win: -1,
                        ability_0: -1,
                        ability_1: -1,
                        ability_2: -1,
                        ability_3: -1,
                        Hero_level: -1,
                        team: +_player.team_number,
                        leaver_status: -1,
                        aghanims_scepter: -1,
                        aghanims_shard: -1,
                        backpack_0: -1,
                        backpack_1: -1,
                        backpack_2: -1,
                        item_0: -1,
                        item_1: -1,
                        item_2: -1,
                        item_3: -1,
                        item_4: -1,
                        item_5: -1,
                        item_neutral: -1,
                        moonshard: -1,
                        hero_id: +_player.hero_id,
                        player_slot: +_player.player_slot,
                    })
                },
                );
            });
            const matchesUnique = [...matchesSingle]
            const playersUnique = [...playersSingle].map(x => (
                {
                    account_id: x,
                    personaname: '',
                    avatarfull: '',
                    loccountrycode: ''
                }
            ))
            const playersMatchesUnique = [...playerMatchesArraySingle]

            Db.match.bulkCreate(matchesUnique)
            Db.player.bulkCreate(playersUnique)
            Db.playersMatches.bulkCreate(playersMatchesUnique)

            return { matchesUnique, playersUnique, playersMatchesUnique }
        }
        console.log('matchHistory', data)
        return null;
    } catch (error) {
        console.log('matchHistory', error)
        return null;
    }
}
