/* eslint-disable no-await-in-loop */
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import Db from '../../class/Db';
import regions from './regions';
const { Op } = require("sequelize");


export default async function matchDetails(_matches) {
    const time = Date.now();
    const matches = []
    const findMatches = await Db.playersMatches.findAll({
        attributes: ['match_id'],
        logging: false,
        where: {
            match_id: { [Op.or]: _matches },
        }
    });
    const findFilterMatches = findMatches.map(x => x.dataValues.match_id)
    const filteredArray = _matches.filter(value => !findFilterMatches.includes(value));
    if (filteredArray === 0) {
        console.log('match_id: ', (-time + Date.now()) / 1000, 's');
        return null;
    }

    const playersMatches = []
    for (let i = 0; i < _matches.length; i += 1) {
        console.log('matches: ', i, "/", _matches.length)
        try {
            const request = await fetch(`${process.env.base_url}/IDOTA2Match_570/GetMatchDetails/v1?match_id=${_matches[i]}&key=${process.env.key_api}`)
            const data = await request.json()

            if (data && data.result) {
                const res = data.result
                matches.push({
                    match_id: +res.match_id,
                    start_time: +res.start_time,
                    cluster: regions(+res.cluster),
                    dire_score: res.dire_score,
                    radiant_score: res.radiant_score,
                    duration: res.duration,
                })
                data.result.players.map(_player => {
                    const uniqueAbility = new Set();
                    _player.ability_upgrades.map(x => uniqueAbility.add(x.ability))
                    const abilities = Array.from(uniqueAbility)
                    let win = 0;
                    if (res.radiant_win) { if (+_player.player_slot < 5) { win = 1 } }
                    else if (+_player.player_slot > 5) { win = 1 }
                    playersMatches.push({
                        account_id: +_player.account_id === 4294967295 ? (+_player.player_slot + 1) : +_player.account_id,
                        match_id: +res.match_id,
                        assists: _player.assists,
                        deaths: _player.deaths,
                        denies: _player.denies,
                        gold_per_min: _player.gold_per_min,
                        hero_damage: _player.hero_damage,
                        hero_healing: _player.hero_healing,
                        kills: _player.kills,
                        last_hits: _player.last_hits,
                        net_worth: _player.net_worth,
                        tower_damage: _player.tower_damage,
                        xp_per_min: _player.xp_per_min,
                        win,
                        ability_0: abilities[0],
                        ability_1: abilities[1],
                        ability_2: abilities[2],
                        ability_3: abilities[3],
                        Hero_level: _player.level,
                        team: +_player.team_number,
                        leaver_status: _player.leaver_status,
                        aghanims_scepter: _player.aghanims_scepter,
                        aghanims_shard: _player.aghanims_shard,
                        backpack_0: _player.backpack_0,
                        backpack_1: _player.backpack_1,
                        backpack_2: _player.backpack_2,
                        item_0: _player.item_0,
                        item_1: _player.item_1,
                        item_2: _player.item_2,
                        item_3: _player.item_3,
                        item_4: _player.item_4,
                        item_5: _player.item_5,
                        item_neutral: _player.item_neutral,
                        moonshard: _player.moonshard,
                        hero_id: +_player.hero_id,
                        player_slot: +_player.player_slot,
                    })
                })
            }
        } catch (error) {
            console.log('matchDetails:', error);
        }
    }
    const promiseMatches = await Promise.all(matches);
    await Db.match.bulkCreate(promiseMatches, { ignoreDuplicates: true, updateOnDuplicate: ["match_id"], logging: false })


    const promisePlayersMatches = await Promise.all(playersMatches);
    await Db.playersMatches.bulkCreate(promisePlayersMatches, { ignoreDuplicates: true, updateOnDuplicate: ["account_id", "match_id"], logging: false })

    console.log('matches ', (-time + Date.now()) / 1000, 's');
    return { matches: promiseMatches, playersMatches: promisePlayersMatches };
}
