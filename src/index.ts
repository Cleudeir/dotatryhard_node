import Db from './class/Db';
import server from './class/Server';
import matchHistory from './components/Steam/matchHistory';

type obj = {
    [key: string]: any;
};
server.post('/db/insert', async (req, res) => {
    const tableName: string = req.body.tableName as string
    const params: obj = req.body.params as obj
    console.log('NODE: ',tableName, params)
    if (tableName && params) {
        const result = await Db.insert(tableName, params)
        console.log(result)
        return res.send(result)
    }
    return res.send("error: use {tableName: string, params: obj}")
})

server.post('/db/update', async (req, res) => {
    const tableName: string = req.body.tableName as string
    const params: obj = req.body.params as obj
    console.log('NODE: ',tableName, params)
    if (tableName && params) {
        const result = await Db.update(tableName, params)
        console.log(result)
        return res.send(result)
    }
    return res.send("error: use {tableName: string, params: obj}")
})

server.post('/db/read', async (req, res) => {
    const tableName: string = req.body.tableName as string
    const item: string = req.body.item as string
    const value: string = req.body.value as string
    console.log('NODE: ',tableName, item, value)
    if (tableName) {
        const result = await Db.read(tableName, item, value)
        console.log(result)
        return res.send(result)
    }
    return res.send("error: use {tableName: string, item?: string, value?: string}")
})
server.get('/', async (req, res) => {
    matchHistory(87683422)
    return res.send({status:"online"})
})