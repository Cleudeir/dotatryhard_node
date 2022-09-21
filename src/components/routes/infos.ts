import Db from '../../class/Db';
import { Op } from "sequelize";
import sequelize from 'sequelize';
import profiles from '../Steam/profiles';


type obj = {
    [key: string]: any;
};
export default async function infos({ account_id, limit }: obj): Promise<obj> {
    if (!limit) {
        limit = 300
    }

    const findMatchesIds = (await Db.playersMatches.findAll({
        attributes: ['match_id'],
        logging: false,
        where: {
            account_id
        },
        order: [['match_id', 'DESC']],
        include: [Db.match],
        limit: +limit
    }))
    const findMatchesInfo: obj = await Db.playersMatches.findAll({
        logging: false,
        where: {
            match_id: { [Op.or]: findMatchesIds.map((x: { match_id: number }) => x.match_id) }
        },
        include: [{
            model: Db.player,
            as: 'profile',
            attributes: ['account_id', 'personaname', 'avatarfull', 'loccountrycode'],
        }]
    })
    const matches: obj = []
    findMatchesIds.forEach((item: { match_id: number, match: obj }) => matches.push(
        {
            ...item.match.dataValues,
            players: findMatchesInfo.filter(
                (y: { match_id: number; }) => y.match_id === item.match_id)
        }
    ))

    console.log('matches', matches.length, account_id);
    const playersAlliesTeamGame: { profile: any; win: any; }[] = [];
    const playersEnemyTeamGame: { profile: any; win: any; }[] = [];
    const uniqueAlliesPlayers = new Set();
    const uniqueEnemyPlayers = new Set();
    matches.map((item: { players: { filter: (arg0: (x: any) => boolean) => [{ player_slot: any; win: any; }]; map: (arg0: (x: any) => void) => void; }; }) => {
        const [{ player_slot, win }] = item.players.filter((x) => x.account_id === account_id);

        item.players.map((x) => {
            if (x.account_id > 150 && x.account_id !== account_id && x.player_slot > 100 && player_slot > 100) {
                playersAlliesTeamGame.push({
                    profile: x.profile,
                    win: win,
                });
                uniqueAlliesPlayers.add(x.account_id);
            } else if (x.account_id > 150 && x.account_id !== account_id && x.player_slot < 100 && player_slot < 100) {
                playersAlliesTeamGame.push({
                    profile: x.profile,
                    win: win,
                });
                uniqueAlliesPlayers.add(x.account_id);
            }
            if (x.account_id > 150 && x.account_id !== account_id && x.player_slot < 100 && player_slot > 100) {
                playersEnemyTeamGame.push({
                    profile: x.profile,
                    win: win,
                });
                uniqueEnemyPlayers.add(x.account_id);
            } else if (x.account_id > 150 && x.account_id !== account_id && x.player_slot > 100 && player_slot < 100) {
                playersEnemyTeamGame.push({
                    profile: x.profile,
                    win: win,
                });
                uniqueEnemyPlayers.add(x.account_id);
            }
        },
        );
    });


    const alliesPlayers = await orderAlliesEnemy(uniqueAlliesPlayers, playersAlliesTeamGame);
    const enemyPlayers = await orderAlliesEnemy(uniqueEnemyPlayers, playersEnemyTeamGame);
    return { alliesPlayers, enemyPlayers };
}




async function orderAlliesEnemy(playersUnique: Iterable<unknown> | ArrayLike<unknown>, gamed: { profile: any; win: any; }[]) {
    const uniqueToArray = Array.from(playersUnique);
    const PlayersWinRate: { profile: any; win: number; loss: number; matches: number; winRate: number; }[] = [];
    uniqueToArray.map((id) => {
        let win = 0;
        let loss = 0;
        const [{ profile }] = gamed
            .filter((x) => x.profile.account_id === id)
            .map((x) => {
                if (x.win === 1) {
                    win++;
                } else {
                    loss++;
                }
                return x;
            });
        PlayersWinRate.push({ profile, win, loss, matches: win + loss, winRate: Math.floor((win / (win + loss)) * 10000) / 100 });
    });
    const PlayersOrder = PlayersWinRate.sort((a, b) => {
        if (a.matches > b.matches) return -1;
        if (a.matches < b.matches) return 1;
        return 0;
    });
    return PlayersOrder;
}