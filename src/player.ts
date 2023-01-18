import Db from './class/Db';
import sequelize, { Op } from "sequelize";
import rankingRate from './components/Math/rankingRate';
import matchIds from './components/query/matchIds';

interface PlayerHistory { account_id: number, limit: number, _avgGlobal: any }
type obj = {
    [key: string]: any;
};
export default async function player({ account_id, limit, _avgGlobal }: PlayerHistory): Promise<obj> {
    if (!limit) {
        limit = 20
    }
    const _matchIds = await matchIds({ account_id, limit })
    // return _matchIds
    const findMatchesInfo: obj = await Db.playersMatches.findAll({
        logging: false,
        where: {
            match_id: { [Op.or]: _matchIds.map(item => item.match_id) }
        },
        include: [{
            model: Db.player,
            as: 'profile',
            attributes: ['account_id', 'personaname', 'avatarfull', 'loccountrycode'],
        }]
    })
    const data: obj = []
    _matchIds.forEach((item: any) => {
        data.push(
            {
                match_id: item.match_id,
                start_time: item.start_time,
                cluster: item.cluster,
                dire_score: item.dire_score,
                radiant_score: item.radiant_score,
                duration: item.duration,
                players: findMatchesInfo.filter(
                    (y: any) => y.match_id === item.match_id)
            }
        )
    }
    )
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

    const _avg = rankingRate({ avg, _avgGlobal })
    return { matches: data, avg: _avg }
}

