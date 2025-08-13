import sequelize from 'sequelize';
import Db from '../class/Db';
import { Op } from "sequelize";
import rankingRate from './Math/rankingRate';
import { parseSequelize } from '../utils/parser';

type obj = {
    [key: string]: any;
};
export default async function ranking({ limit, _avgGlobal }: { limit: number, _avgGlobal: any }): Promise<obj> {

    const lastDays = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const avgPlayer: obj = parseSequelize(await Db.playersMatches.findAll({
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
            account_id: { [Op.gte]: 150 },
            createdAt: { [Op.gte]: lastDays },
        },
        limit,
    }))

    const result = avgPlayer.map((avg: obj) => (rankingRate({ avg, _avgGlobal })));
    const resultOrder = result
        .filter((x: { matches: number; }) => x.matches > 20)
        .sort(function (a: { rankingRate: number; }, b: { rankingRate: number; }) {
            if (a.rankingRate > b.rankingRate)
                return -1;
            if (a.rankingRate < b.rankingRate)
                return 1;
            return 0;
        })
    const resultIds = resultOrder.map((x: any, i: number) => ({ ...x, pos: (i + 1) }))
    return resultIds
}
