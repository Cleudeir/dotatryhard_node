import Db from './class/Db';
import { Op } from "sequelize";
import matchIds from './components/query/matchIds';

type obj = {
    [key: string]: any;
};
export default async function infos({ account_id, limit }: { account_id: number, limit: number }): Promise<obj> {
    if (!limit) {
        limit = 700
    }

    const _matchIds = await matchIds({ account_id, limit })
    const playersMatches: obj = await Db.playersMatches.findAll({
        logging: false,
        attributes: ['match_id', 'account_id', 'player_slot', 'win'],
        where: {
            match_id: { [Op.or]: _matchIds.map(item => item.match_id) }
        },
        include: [{
            model: Db.player,
            as: 'profile',
            attributes: ['account_id', 'personaname', 'avatarfull', 'loccountrycode'],
        }]
    })
    return { playersMatches, _matchIds }
}