/* eslint-disable no-await-in-loop */
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import Db from "../../class/Db";
import { ability } from "../lists/ability";
import regions from "../lists/regions";
import { itens } from "../lists/itens";
import { heros } from "../lists/heros";
import { Player } from "../../interface/matchDetails";
import { Op } from "sequelize";
import fs from 'fs';
import os from "os";
const userHomeDir = os.homedir();

export default async function matchDetails(_matches: any[]) {
  const time = Date.now();
  const matches = [];
  const playerUnique = new Set();
  const playersMatches: any[] = [];

  const findMatches = await Db.playersMatches.findAll({
    attributes: ["match_id"],
    logging: false,
    where: {
      match_id: { [Op.or]: _matches },
    },
    raw: true,
  });

  const filteredArray = _matches.filter(
    (value: any) => !findMatches.includes(value)
  );
  if (filteredArray.length === 0) {
    return null;
  }

  let matchesGameModeError: any[];
  try {
    matchesGameModeError = JSON.parse(await fs.readFileSync(`${userHomeDir}/temp/matchesGameModeError.json`))
  } catch (error) {
    matchesGameModeError = []
  }


  for (let i = 0; i < _matches.length; i += 1) {
    if (matchesGameModeError.includes(_matches[i])) {
      continue;
    }
    console.log("matchDetails " + (i + 1) + "/" + _matches.length)
    try {
      const request = await fetch(
        `${process.env.base_url}/IDOTA2Match_570/GetMatchDetails/v1?match_id=${_matches[i]}&game_mode=${process.env.game_mode}&key=${process.env.key_api}`
      );
      const data = await request.json();

      if (data && data.result) {
        const res = data.result;
        if (res.game_mode !== 18) {
          console.log(res.game_mode)
          matchesGameModeError.push(_matches[i])
          continue;
        }
        matches.push({
          match_id: +res.match_id,
          start_time: +res.start_time,
          cluster: regions(+res.cluster),
          dire_score: res.dire_score,
          radiant_score: res.radiant_score,
          duration: res.duration,
        });

        data.result.players.map((_player: Player) => {
          const uniqueAbility = new Set();

          playerUnique.add(
            JSON.stringify({
              loccountrycode: regions(+res.cluster),
              account_id:
                +_player.account_id === 4294967295
                  ? +_player.player_slot + 1
                  : +_player.account_id,
            })
          );
          if (_player.ability_upgrades) {
            _player.ability_upgrades.map((x: { ability: unknown }) =>
              uniqueAbility.add(x.ability)
            );
          }

          const abilities = Array.from(uniqueAbility);
          let win = 0;
          if (res.radiant_win) {
            if (+_player.player_slot < 5) {
              win = 1;
            }
          } else if (+_player.player_slot > 5) {
            win = 1;
          }
          playersMatches.push({
            account_id:
              +_player.account_id === 4294967295
                ? +_player.player_slot + 1
                : +_player.account_id,
            match_id: +res.match_id,
            assists: _player.assists || 0,
            deaths: _player.deaths || 0,
            denies: _player.denies || 0,
            gold_per_min: _player.gold_per_min || 0,
            hero_damage: _player.hero_damage || 0,
            hero_healing: _player.hero_healing || 0,
            kills: _player.kills || 0,
            last_hits: _player.last_hits || 0,
            net_worth: _player.net_worth || 0,
            tower_damage: _player.tower_damage || 0,
            xp_per_min: _player.xp_per_min || 0,
            win,
            ability_0: ability(abilities[0]),
            ability_1: ability(abilities[1]),
            ability_2: ability(abilities[2]),
            ability_3: ability(abilities[3]),
            Hero_level: _player.level || 0,
            team: +_player.team_number || 0,
            leaver_status: _player.leaver_status || 0,
            aghanims_scepter: _player.aghanims_scepter || 0,
            aghanims_shard: _player.aghanims_shard || 0,
            backpack_0: _player.backpack_0 || 0,
            backpack_1: _player.backpack_1 || 0,
            backpack_2: _player.backpack_2 || 0,
            item_0: itens(_player.item_0),
            item_1: itens(_player.item_1),
            item_2: itens(_player.item_2),
            item_3: itens(_player.item_3),
            item_4: itens(_player.item_4),
            item_5: itens(_player.item_5),
            item_neutral: _player.item_neutral || 0,
            moonshard: _player.moonshard || 0,
            hero_id: heros(+_player.hero_id),
            player_slot: +_player.player_slot,
          });
        });
      }
    } catch (error) {
      console.warn("matchDetails:", error);
    }
  }
  fs.writeFileSync(`${userHomeDir}/temp/matchesGameModeError.json`, JSON.stringify(matchesGameModeError));
  const promiseMatches = await Promise.all(matches);
  await Db.match.bulkCreate(promiseMatches, {
    ignoreDuplicates: true,
    updateOnDuplicate: ["match_id"],
    logging: false,
  });

  const promisePlayersMatches = await Promise.all(playersMatches);
  await Db.playersMatches.bulkCreate(promisePlayersMatches, {
    ignoreDuplicates: true,
    updateOnDuplicate: ["account_id", "match_id"],
    logging: false,
  });

  const promisePlayers = await Promise.all(playerUnique);

  [...promisePlayers].map((x: any) => {
    const item = JSON.parse(x);
    Db.player.update(
      { loccountrycode: item.loccountrycode },
      {
        logging: false,
        where: {
          account_id: item.account_id,
        },
      }
    );
  });

  console.log("matches ", (-time + Date.now()) / 1000, "s");
  return { matches: promiseMatches, playersMatches: promisePlayersMatches };
}
