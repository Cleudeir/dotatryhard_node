import Db from './class/Db';
const { Op } = require("sequelize");
import server from './class/Server';
import playerHistory from './components/routes/playerHistory';
import ranking from './components/routes/ranking';

server.post('/db/insert', async (req, res) => {

})

server.post('/db/update', async (req, res) => {

})

server.post('/db/read', async (req, res) => {

})
server.get('/player', async (req, res) => {

    const { account_id } = req.query
    const limit = req.query.limit as unknown as number
    console.log(account_id)
    if (account_id === undefined) {
        return res.send({ account_id: 'undefined' })
    }
    const result = await playerHistory(+account_id, limit)
    return res.send(result)
})

server.get('/ranking', async (req, res) => {
    const limit = req.query.limit as unknown as number
    const result = await ranking(limit)
    return res.send(result)
})