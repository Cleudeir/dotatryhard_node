import Db from '../../class/Db';
const { Op } = require("sequelize");
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();
const SteamID = require('steamid');

export default async function profiles(_players) {
  const time = Date.now();
  const players = [];

  const findPlayer = await Db.player.findAll({
    attributes: ['account_id'],
    logging: false,
    where: {
      account_id: { [Op.or]: _players },
    }
  });
  const findFilterPlayer = findPlayer.map(x => x.dataValues.account_id)
  const filteredArray = _players.filter(value => !findFilterPlayer.includes(value));
  if (filteredArray === 0) {
    console.log('Profile: ',(-time + Date.now()) / 1000, 's');
    console.log(_players, filteredArray.length, 'Partidas já existem!')
    return null;
  }
  for (let i = 0; i < filteredArray.length; i += 1) {
    console.log('profile:', i, "/", filteredArray.length)
    const accountId = filteredArray[i];
    const steamId = new SteamID(`[U:1:${accountId}]`).getSteamID64();
    if (accountId < 200) {
      players.push({
        account_id: accountId,
        personaname: 'unknown',
        avatarfull: 'https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/',
        loccountrycode: '',
      })
    } else {
      try {
        const request = await fetch(`${process.env.base_url}ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.key_api}&steamids=${steamId}`)
        const data = await request.json()
        if (data && data.response && data.response.players && data.response.players.length > 0) {
          const x = data.response.players[0];
          players.push({ ...x, account_id: accountId })
        } else {
          players.push({
            account_id: accountId,
            personaname: 'unknown',
            avatarfull: 'https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/',
            loccountrycode: '',
          })
        }
      } catch (error) {
        console.log('error Profile:', error.message);
      }
    }
  }
  const promisePlayer = await Promise.all(players);
  await Db.player.bulkCreate(promisePlayer, { ignoreDuplicates: true, updateOnDuplicate: ["account_id"], logging: false })
  console.log('Profile: ',(-time + Date.now()) / 1000, 's');
  return { player: promisePlayer };
}
