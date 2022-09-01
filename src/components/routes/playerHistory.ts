import Db from '../../class/Db';
import matchDetails from '../Steam/matchDetails';
import matchHistory from '../Steam/matchHistory';
import profiles from '../Steam/profiles';
const { Op } = require("sequelize");
import sequelize from 'sequelize';


type obj = {
    [key: string]: any;
};
export default async function playerHistory(account_id: number, limit?: number): Promise<obj> {
    if (!limit) {
        limit = 10000
    }
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

    const result = {
        assists: Math.floor(+avg.assists * 10) / 10,
        denies: Math.floor(+avg.denies * 10) / 10,
        deaths: Math.floor(+avg.deaths * 10) / 10,
        gold_per_min: Math.floor(+avg.gold_per_min * 10) / 10,
        hero_damage: Math.floor(+avg.hero_damage * 10) / 10,
        hero_healing: Math.floor(+avg.hero_healing * 10) / 10,
        kills: Math.floor(+avg.kills * 10) / 10,
        last_hits: Math.floor(+avg.last_hits * 10) / 10,
        net_worth: Math.floor(+avg.net_worth * 10) / 10,
        tower_damage: Math.floor(+avg.tower_damage * 10) / 10,
        xp_per_min: Math.floor(+avg.xp_per_min * 10) / 10,
        win: Math.floor(+avg.win * 10) / 10,
        matches: Math.floor(avg.matches * 10) / 10,
        winRate: Math.floor((avg.win / avg.matches) * 100 * 10) / 10,
        rankingRate: Math.floor(((
            (+avg.assists / +avgGlobal.assists) * 1
            + (+avg.denies / +avgGlobal.denies) * 1
            + (+avg.kills / +avgGlobal.kills) * 0.5
            + (+avgGlobal.deaths / (+avg.deaths === 0 ? avgGlobal.deaths : +avg.deaths)) * 1
            + (+avg.gold_per_min / +avgGlobal.gold_per_min) * 0.5
            + (+avg.hero_damage / +avgGlobal.hero_damage) * 0.5
            + (+avg.last_hits / +avgGlobal.last_hits) * 0.5
            + (+avg.hero_healing / +avgGlobal.hero_healing) * 0.5
            + (+avg.net_worth / +avgGlobal.net_worth) * 0.5
            + (+avg.tower_damage / +avgGlobal.tower_damage) * 2
            + (+avg.xp_per_min / +avgGlobal.xp_per_min) * 1
            + ((avg.win / avg.matches) / 0.5) * 2
        )
            / (1 * 4 + 0.5 * 6 + 2 * 2)
        ) * 3000),
        profile: avg.profile
    }
    return { matches, avg: result}
}