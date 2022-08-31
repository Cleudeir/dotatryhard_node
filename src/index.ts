import Db from './class/Db';
const { Op } = require("sequelize");
import server from './class/Server';
import matchDetails from './components/Steam/matchDetails';
import matchHistory from './components/Steam/matchHistory';
import profiles from './components/Steam/profiles';

type obj = {
    [key: string]: any;
};
server.post('/db/insert', async (req, res) => {

})

server.post('/db/update', async (req, res) => {

})

server.post('/db/read', async (req, res) => {

})
server.get('/player', async (req, res) => {
    const { account_id, limit } = req.query
    console.log(account_id)
    if (account_id === undefined) {
        return res.send({ account_id: 'undefined' })
    }
    if (limit === undefined) {
        return res.send({ limit: 'undefined' })
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
    const result: obj = []
    findMatchesIds.forEach((item: { match_id: number, match: obj }) => result.push(
        {
            ...item.match.dataValues,
            players: findMatchesInfo.filter(
                (y: { match_id: number; }) => y.match_id === item.match_id)
        }
    ))
    return res.send(result)
})