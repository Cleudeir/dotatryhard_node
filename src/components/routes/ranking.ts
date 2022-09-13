import sequelize from 'sequelize';
import Db from '../../class/Db';
import { Op } from "sequelize";


type obj = {
    [key: string]: any;
};
export default async function ranking(limit?: number): Promise<obj> {
    if (!limit) {
        limit = 10000
    }
    const avgPlayer = (await Db.playersMatches.findAll({
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
        limit: limit,
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
    })).map((x: { dataValues: any; }) => x.dataValues)

    const result = avgPlayer.map((player: obj) => ({
        assists: Math.floor(+player.assists * 10) / 10,
        denies: Math.floor(+player.denies * 10) / 10,
        deaths: Math.floor(+player.deaths * 10) / 10,
        gold_per_min: Math.floor(+player.gold_per_min * 10) / 10,
        hero_damage: Math.floor(+player.hero_damage * 10) / 10,
        hero_healing: Math.floor(+player.hero_healing * 10) / 10,
        kills: Math.floor(+player.kills * 10) / 10,
        last_hits: Math.floor(+player.last_hits * 10) / 10,
        net_worth: Math.floor(+player.net_worth * 10) / 10,
        tower_damage: Math.floor(+player.tower_damage * 10) / 10,
        xp_per_min: Math.floor(+player.xp_per_min * 10) / 10,
        win: Math.floor(+player.win * 10) / 10,
        matches: Math.floor(player.matches * 10) / 10,
        winRate: Math.floor((player.win / player.matches) * 100 * 10) / 10,
        rankingRate: Math.floor(((
            (+player.assists / +avgGlobal.assists) * 1
            + (+player.denies / +avgGlobal.denies) * 1
            + (+player.kills / +avgGlobal.kills) * 0.5
            + (+avgGlobal.deaths / (+player.deaths === 0 ? avgGlobal.deaths : +player.deaths)) * 1
            + (+player.gold_per_min / +avgGlobal.gold_per_min) * 0.5
            + (+player.hero_damage / +avgGlobal.hero_damage) * 0.5
            + (+player.last_hits / +avgGlobal.last_hits) * 0.5
            + (+player.hero_healing / +avgGlobal.hero_healing) * 0.5
            + (+player.net_worth / +avgGlobal.net_worth) * 0.5
            + (+player.tower_damage / +avgGlobal.tower_damage) * 2
            + (+player.xp_per_min / +avgGlobal.xp_per_min) * 1
            + ((player.win / player.matches) / 0.5) * 2
        )
            / (1 * 4 + 0.5 * 6 + 2 * 2)
        ) * 3000),
        profile: player.profile
    }))
    const resultOrder = result.filter((x: { matches: number; }) => x.matches > 10).sort(function (a: { rankingRate: number; }, b: { rankingRate: number; }) {
        if (a.rankingRate > b.rankingRate)
            return -1;
        if (a.rankingRate < b.rankingRate)
            return 1;
        return 0;
    })
    const resultIds = resultOrder.map((x: any, i: number) => ({ ...x, pos: (i+1) }))

    return resultIds
}