import Db from './class/Db';
const { Op } = require("sequelize");
import server from './class/Server';
import playerHistory from './components/routes/playerHistory';
import ranking from './components/routes/ranking';
import regions from './components/Steam/regions';


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
    const result = await playerHistory(+account_id, +limit)
    return res.send(result)
})

server.get('/ranking', async (req, res) => {

    const { limit } = req.query
    if (limit === undefined) {
        return res.send({ limit: 'undefined' })
    }
    const result = await ranking(+limit)
    return res.send(result)
})