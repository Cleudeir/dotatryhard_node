import sequelize from 'sequelize';
import Db from '../../class/Db';
import { Op } from "sequelize";
import rankingRate from '../Math/rankingRate';


type obj = {
    [key: string]: any;
};
export default async function ranking(limit?: number): Promise<obj> {
    if (!limit) {
        limit = 400
    }
    let time = Date.now()
    const avgPlayer: obj = (await Db.playersMatches.findAll({
        attributes: ['account_id',
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
        logging: false,
        group: 'account_id',
        order: [['matches', 'DESC']],
        include: [{
            model: Db.player,
            as: 'profile',
            attributes: ['account_id', 'personaname', 'avatarfull', 'loccountrycode'],
        }],
        where: {
            account_id: { [Op.gte]: 150 }
        },
        limit,
    })).map((x: { dataValues: any; }) => x.dataValues)
    //time
    console.log('ranking geration 33%', (Date.now() - time) / 1000, "s")
    time = Date.now()
    //--
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
    })).map((x: { dataValues: any; }) => x.dataValues)
    //time
    console.log('ranking geration 66%', (Date.now() - time) / 1000, "s")
    time = Date.now()
    //--
    const result = avgPlayer.map((avg: obj) => (rankingRate(avg, avgGlobal)))
    const resultOrder = result.filter((x: { matches: number; }) => x.matches > 10).sort(function (a: { rankingRate: number; }, b: { rankingRate: number; }) {
        if (a.rankingRate > b.rankingRate)
            return -1;
        if (a.rankingRate < b.rankingRate)
            return 1;
        return 0;
    })
    const resultIds = resultOrder.map((x: any, i: number) => ({ ...x, pos: (i + 1) }))
    //time
    console.log('ranking geration 99%', (Date.now() - time) / 1000, "s")
    time = Date.now()
    //--
    return resultIds
}