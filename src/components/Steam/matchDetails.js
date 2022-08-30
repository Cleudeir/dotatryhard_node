/* eslint-disable no-await-in-loop */
import dotenv from 'dotenv';
dotenv.config();


export default async function GetMatchDetails(matches) {
    console.log('matches');
    const array = [];
    const time = Date.now();
    for (let i = 0; i < matches.length; i += 1) {
        const request = fetch(`${process.env.base_url}/IDOTA2Match_570/GetMatchDetails/v1?match_id=${matches[i]}&key=${process.env.key_api}`)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.result) {
                    return data.result;
                }
                return null;
            })
            .catch((error) => {
                console.log('matchDetails:', error);
                return null;
            });
        matches.push(request);
    }    
    const promise = await Promise.all(matches);
    const result = promise.filter((x) => x != null);
    console.log((-time + Date.now()) / 1000, 's');
    return result;
}
