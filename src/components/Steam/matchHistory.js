import dotenv from 'dotenv';
dotenv.config();

export default async function matchHistory(accountId, length) {
    if (!length) {
        length = 100;
    }
    try {
        const request = await fetch(`${process.env.base_url}IDOTA2Match_570/GetMatchHistory/v1/?account_id=${accountId}&game_mode=${process.env.game_mode}&key=${process.env.key_api}`)
        const data = await request.json()
        if (data && data.result && data.result.matches) {
            return data.result.matches.splice(0, length);
        }
        console.log('matchHistory', data)
        return null;
    } catch (error) {
        console.log('matchHistory', error)
        return null;
    }
}
