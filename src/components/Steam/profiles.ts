import Db from '../../class/Db';
import { Op } from "sequelize";
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Player } from '../../interface/profile';
dotenv.config();
import SteamID from 'steamid';

export default async function profiles(_players: any[]) {
  const time = Date.now();
  const players = [];

  const findPlayer = await Db.player.findAll({
    attributes: ['account_id'],
    logging: false,
    where: {
      account_id: { [Op.or]: _players },
    }
  });
  const findFilterPlayer = findPlayer.map((x: { dataValues: { account_id: any; }; }) => x.dataValues.account_id)
  const filteredArray: any[] = _players.filter((value: any) => !findFilterPlayer.includes(value));
  if (filteredArray.length === 0) {
    return null;
  }
  for (let i = 0; i < filteredArray.length; i += 1) {
    const accountId = filteredArray[i];
    const steamId = new SteamID(`[U:1:${accountId}]`).getSteamID64();
    if (accountId < 200) {
      players.push({
        account_id: accountId,
        personaname: 'unknown',
        avatarfull: 'https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/',
        loccountrycode: 'unknown',
      })
    } else {
      try {
        const request = await fetch(`${process.env.base_url}ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.key_api}&steamids=${steamId}`)
        const data = await request.json()
        if (data && data.response && data.response.players && data.response.players.length > 0) {
          const x : Player = data.response.players[0];
          players.push({ ...x, account_id: accountId })
        } else {
          players.push({
            account_id: accountId,
            personaname: 'unknown',
            avatarfull: 'https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/',
            loccountrycode: 'unknown',
          })
        }
      } catch (error) {
        console.warn('>>>>>> Error Profile: <<<<<<<<<<', error);
      }
    }
  }
  const promisePlayer = await Promise.all(players);
  await Db.player.bulkCreate(promisePlayer, { ignoreDuplicates: true, updateOnDuplicate: ["account_id"], logging: false })
  console.log('Profile: ', (-time + Date.now()) / 1000, 's');
  return { player: promisePlayer };
}
