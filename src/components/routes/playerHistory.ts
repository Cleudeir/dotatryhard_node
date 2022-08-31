import Db from '../../class/Db';
import matchDetails from '../Steam/matchDetails';
import matchHistory from '../Steam/matchHistory';
import profiles from '../Steam/profiles';
const { Op } = require("sequelize");


type obj = {
    [key: string]: any;
};
export default async function playerHistory(account_id: number, limit: number): Promise<obj> {
    const history = await matchHistory(account_id)
    if (history) {
        await profiles(history.players)
        await matchDetails(history.matches)
    }
    const findMatchesIds = (await Db.playersMatches.findAll({
        attributes: ['match_id'],
        logging: false,
        where: {
            account_id: 87683422
        },
        order: ['updatedAt'],
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
            as: 'profile'
        }]
    })
    const result: obj = []
    findMatchesIds.forEach((item: { match_id: number, match: obj }) => result.push(
        {
            ...item.match.dataValues,
            players: findMatchesInfo.filter(
                (y: { match_id: number; }) => y.match_id === item.match_id)
        }
    ))
    return result
}