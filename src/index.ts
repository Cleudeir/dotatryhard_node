import Db from './class/Db';
const { Op } = require("sequelize");
import server from './class/Server';
import playerHistory from './components/routes/playerHistory';
import ranking from './components/routes/ranking';
import updateMatches from './components/Steam/_index';
import Revalidate from './class/Revalidate'

type obj = {
    [key: string]: any;
};

server.post('/db/insert', async (req, res) => {

})

server.post('/db/update', async (req, res) => {

})

server.post('/db/read', async (req, res) => {

})
const update = new Revalidate("update", 1.5)
server.get('/player', async (req, res) => {

    const account_id = req.query.account_id as unknown as number
    const limit = req.query.limit as unknown as number
    console.log(account_id)
    if (+account_id === undefined) {
        return res.send({ account_id: 'undefined' })
    }

    update.check(updateMatches, account_id)
    const result = await playerHistory({account_id: +account_id, limit})
    return res.send(result)
})

server.get('/add', async (req, res) => {
    const account_id = req.query.account_id as unknown as number
    const limit = req.query.limit as unknown as number
    console.log(account_id)
    if (+account_id === undefined) {
        return res.send({ account_id: 'undefined' })
    }

    await update.check(updateMatches, account_id)
    const result = await playerHistory({account_id: +account_id, limit})
    return res.send(result)
})

server.get('/ranking', async (req, res) => {
    const limit = req.query.limit as unknown as number
    const result = await ranking(limit)
    return res.send(result)
})
