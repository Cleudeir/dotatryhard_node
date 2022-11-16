import Db from '../../class/Db';
import { Op } from "sequelize";
import sequelize from 'sequelize';
import profiles from '../Steam/profiles';
import rankingRate from '../Math/rankingRate';


type obj = {
    [key: string]: any;
};
export default async function playerHistory({ account_id, limit }: obj): Promise<obj> {
    if (!limit) {
        limit = 500
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
    const [avg] = (await Db.playersMatches.findAll({
        attributes: [
            [sequelize.fn('avg', sequelize.col('assists')), 'assists'],
            [sequelize.fn('avg', sequelize.col('deaths')), 'deaths'],
            [sequelize.fn('avg', sequelize.col('denies')), 'denies'],
            [sequelize.fn('avg', sequelize.col('gold_per_min')), 'gold_per_min'],
            [sequelize.fn('avg', sequelize.col('hero_damage')), 'hero_damage'],
            [sequelize.fn('avg', sequelize.col('hero_healing')), 'hero_healing'],
            [sequelize.fn('avg', sequelize.col('kills')), 'kills'],
            [sequelize.fn('avg', sequelize.col('last_hits')), 'last_hits'],
            [sequelize.fn('avg', sequelize.col('net_worth')), 'net_worth'],
            [sequelize.fn('avg', sequelize.col('tower_damage')), 'tower_damage'],
            [sequelize.fn('avg', sequelize.col('xp_per_min')), 'xp_per_min'],
            [sequelize.fn('sum', sequelize.col('win')), 'win'],
            [sequelize.fn('sum', sequelize.col('leaver_status')), 'leaver_status'],
            [sequelize.fn('count', sequelize.col('match_id')), 'matches'],
        ],
        where: {
            account_id: account_id
        },
        include: [{
            model: Db.player,
            as: 'profile'
        }],
        logging: false,
    })).map((x: { dataValues: any; }) => x.dataValues)

    const [avgGlobal] = (await Db.playersMatches.findAll({
        attributes: [
            [sequelize.fn('avg', sequelize.col('assists')), 'assists'],
            [sequelize.fn('avg', sequelize.col('deaths')), 'deaths'],
            [sequelize.fn('avg', sequelize.col('denies')), 'denies'],
            [sequelize.fn('avg', sequelize.col('gold_per_min')), 'gold_per_min'],
            [sequelize.fn('avg', sequelize.col('hero_damage')), 'hero_damage'],
            [sequelize.fn('avg', sequelize.col('hero_healing')), 'hero_healing'],
            [sequelize.fn('avg', sequelize.col('kills')), 'kills'],
            [sequelize.fn('avg', sequelize.col('last_hits')), 'last_hits'],
            [sequelize.fn('avg', sequelize.col('net_worth')), 'net_worth'],
            [sequelize.fn('avg', sequelize.col('tower_damage')), 'tower_damage'],
            [sequelize.fn('avg', sequelize.col('xp_per_min')), 'xp_per_min'],
            [sequelize.fn('sum', sequelize.col('win')), 'win'],
            [sequelize.fn('sum', sequelize.col('leaver_status')), 'leaver_status'],
            [sequelize.fn('count', sequelize.col('match_id')), 'matches'],
        ],
        where: {
            account_id: { [Op.gte]: 150 }
        },
        logging: false,
        raw: true
    }))

    const result = rankingRate(avg,avgGlobal)
    return { matches, avg: result }
}

