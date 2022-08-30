/* eslint-disable no-await-in-loop */
const SteamID = require('steamid');

export default async function GetPlayerSummaries(accountId) {
    const time = Date.now();
    console.log('profile: ');
    const steamId = new SteamID(`[U:1:${accountId}]`).getSteamID64();
    let request = {};
    if (accountId < 200) {
        request = {
            account_id: accountId,
            personaname: 'unknown',
            avatarfull: 'https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/',
            loccountrycode: '',
        };
    } else {
        request = fetch(`${process.env.base_url}ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.key_api}&steamids=${steamId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.response.players.length > 0) {
                    const x = data.response.players[0];
                    return { ...x, account_id: accountId };
                }
                return {
                    account_id: accountId,
                    personaname: 'unknown',
                    avatarfull: 'https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/',
                    loccountrycode: '',
                };
            })
            .catch((error) => {
                console.log('error Profile:', error.message);
                return null;
            });
    }

console.log((-time + Date.now()) / 1000, 's');
const result = request

return result;
}
