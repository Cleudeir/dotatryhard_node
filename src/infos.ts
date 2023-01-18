import Db from './class/Db';
import { Op } from "sequelize";

type obj = {
    [key: string]: any;
};
export default async function infos({ account_id, limit }: { account_id: number, limit: number }): Promise<obj> {
    if (!limit) {
        limit = 500
    }

    const queryMatchIds = await Db.playersMatches.findAll({
        attributes: ['match_id'],
        logging: false,
        where: {
            account_id
        },
        order: [['match_id', 'DESC']],
        limit: limit,
        raw: true
    })
    const _matchIds = queryMatchIds.map((item: any) => item.match_id)
    console.log('_matchIds: ', _matchIds);
    const playersMatches: obj = await Db.playersMatches.findAll({
        logging: false,
        attributes: ['match_id', 'account_id', 'player_slot', 'win'],
        where: {
            match_id: { [Op.or]: _matchIds }
        },
        include: [{
            model: Db.player,
            as: 'profile',
            attributes: ['account_id', 'personaname', 'avatarfull', 'loccountrycode'],
        }]
    })
    return { playersMatches, _matchIds }
}