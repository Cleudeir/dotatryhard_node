const { Op } = require("sequelize");
import server from './class/Server';
import playerHistory from './components/routes/playerHistory';
import ranking from './components/routes/ranking';
import updateMatches from './components/Steam/_index';
import Revalidate from './class/Revalidate'
import dotenv from 'dotenv';
dotenv.config();

type obj = {
    [key: string]: any;
};

server.post('/db/insert', async (req, res) => {

})

server.post('/db/update', async (req, res) => {

})

server.post('/db/read', async (req, res) => {

})
const update = new Revalidate("update", 1)
server.get('/player', async (req, res) => {

    const account_id = req.query.account_id as unknown as number
    const limit = req.query.limit as unknown as number
    console.log(account_id)
    if (+account_id === undefined) {
        return res.send({ account_id: 'undefined' })
    }

    update.check(updateMatches, account_id)
    const result = await playerHistory({ account_id: +account_id, limit })
    return res.send(result)
})
console.warn(
    String(process.env.DATABASE_DB),
    String(process.env.USER_DB),
    String(process.env.PASSWORD_DB),
    String(process.env.HOST_DB),
    Number(process.env.PORT_DB)
)

server.get('/add', async (req, res) => {
    const account_id = req.query.account_id as unknown as number
    const limit = req.query.limit as unknown as number
    console.log(account_id)
    if (+account_id === undefined) {
        return res.send({ account_id: 'undefined' })
    }

    await update.check(updateMatches, account_id)
    const result = await playerHistory({ account_id: +account_id, limit })
    return res.send(result)
})


const findAndUpdate = new Revalidate("findAndUpdate", 4)
const _ranking = new Revalidate("ranking", 4)

server.get('/ranking', async (req, res) => {
    const limit = req.query.limit as unknown as number
    const result = await _ranking.check(ranking, limit)
    let count: number = 0

    if (count < 300) {
        findAndUpdate.check(updateMatches, result[count].profile.account_id)
        count++
        setInterval(() => {
            const element = result[count];
            count++
            findAndUpdate.check(updateMatches, element.profile.account_id)
        }, 5 * 60 * 1000)
    }
    return res.send(result)
})
