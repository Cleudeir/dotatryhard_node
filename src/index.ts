import server from './class/Server';
import player from './player';
import ranking from './ranking';
import Revalidate from './class/Revalidate'
import dotenv from 'dotenv';
import infos from './infos';
import avgGlobal from './components/query/avgGlobal';
dotenv.config();

let playerInUse = false
const _avgGlobal = avgGlobal().then(data => { console.log(data); return data })

server.get('/player', async (req, res) => {
    if (!playerInUse && await _avgGlobal) {
        playerInUse = true
        const time = Date.now()
        const account_id = Number(req.query.account_id) as unknown as number
        const limit = Number(req.query.limit) as unknown as number
        if (+account_id === undefined) {
            return res.send({ account_id: 'undefined' })
        }
        const result = await player({ account_id, limit, _avgGlobal })
        console.log('Informações sobre utimas partidas', (Date.now() - time) / 1000, "s")
        playerInUse = false
        return res.send(result)
    }
})

let infoInUse = false
server.get('/infos', async (req, res) => {
    if (!infoInUse) {
        infoInUse = true
        const time = Date.now()
        const account_id = Number(req.query.account_id) as unknown as number
        const limit = Number(req.query.limit) as unknown as number
        console.log({ account_id, limit })
        if (+account_id === undefined) {
            return res.send({ account_id: 'undefined' })
        }
        const result = await infos({ account_id, limit })
        console.log('Informações percentual de vitória!', (Date.now() - time) / 1000, "s")
        infoInUse = false
        return res.send(result)
    }
})

let addInUse = false
server.get('/add', async (req, res) => {
    if (!addInUse && await _avgGlobal) {
        addInUse = true
        const time = Date.now()
        const account_id = Number(req.query.account_id) as unknown as number
        const limit = Number(req.query.limit) as unknown as number
        if (+account_id === undefined) {
            return res.send({ account_id: 'undefined' })
        }
        const result = await player({ account_id, limit, _avgGlobal })
        console.log('time add', (Date.now() - time) / 1000, "s")
        addInUse = false
        return res.send(result)
    }
})
const _ranking = new Revalidate('ranking', 24 * 60)

let rankingInUse = false
server.get('/ranking', async (req, res) => {
    if (!rankingInUse && await _avgGlobal) {
        rankingInUse = true
        let time = Date.now()
        const limit = Number(req.query.limit) as unknown as number
        console.log({ limit })
        let result = await _ranking.check(ranking, { limit, _avgGlobal })
        console.log('time ranking', (Date.now() - time) / 1000, "s")
        rankingInUse = false
        return res.send(result)
    }
})

