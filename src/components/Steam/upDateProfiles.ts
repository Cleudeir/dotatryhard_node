import Db from '../../class/Db';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();
const SteamID = require('steamid');

export default async function upDateProfiles(accountId: number) {
  const time = Date.now();
  console.log('profile update:')
  const steamId = new SteamID(`[U:1:${accountId}]`).getSteamID64();
  let infoPlayer = null
  if (accountId > 200) {
    try {
      const request = await fetch(`${process.env.base_url}ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.key_api}&steamids=${steamId}`)
      const data = await request.json()
      if (data && data.response && data.response.players && data.response.players.length > 0) {
        const x = data.response.players[0];
        infoPlayer = {
          account_id: accountId,
          personaname: x.personaname,
          avatarfull: x.avatarfull,
          loccountrycode: x.loccountrycode
        }
      } else {
        infoPlayer = {
          account_id: accountId,
          personaname: 'unknown',
          avatarfull: 'https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/',
          loccountrycode: 'unknown'
        }
      }
      await Db.player.update(infoPlayer, {
        where:
        {
          account_id: accountId
        },
        logging: false
      })
      console.log('Profile: ', infoPlayer.personaname, (-time + Date.now()) / 1000, 's');
      return infoPlayer;
    } catch (error) {
      console.log('error Profile:', error);
    }
  }
}
