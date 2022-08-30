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
            //Matchs
            const matchesSingle = new Set();
            const playersSingle = new Set();
            data.result.matches.forEach((match) => {
                matchesSingle.add(match.match_id)
                match.players.forEach((player) => {
                    if (+player.account_id === 4294967295) {
                        playersSingle.add(player.player_slot + 1);
                    } else {
                        playersSingle.add(player.account_id);
                    }
                },
                );
            });
            const matches = ([...matchesSingle]).filter((x) => x > null);
            const players = ([...playersSingle]).filter((x) => x > 0);
            return { matches, players };
        }
        console.log('matchHistory', data)
        return null;
    } catch (error) {
        console.log('matchHistory', error)
        return null;
    }
}
