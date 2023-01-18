import server from './class/Server';
import player from './player';
import ranking from './ranking';
import Revalidate from './class/Revalidate'
import dotenv from 'dotenv';
import infos from './infos';
import avgGlobal from './components/query/avgGlobal';
import start from './components/Steam/_index';
dotenv.config();

const avgGlobalCache = new Revalidate('avgGlobal', 7 * 24 * 60)
avgGlobalCache.check(avgGlobal).then((_avgGlobal) => {

    server.get('/player', async (req, res) => {
        const time = Date.now()
        const account_id = Number(req.query.account_id) as unknown as number
        const limit = Number(req.query.limit) as unknown as number
        if (+account_id === undefined) {
            return res.send({ account_id: 'undefined' })
        }

        const result = await player({ account_id, limit, _avgGlobal })
        console.log('Informações sobre utimas partidas', (Date.now() - time) / 1000, "s")
        start(account_id)
        return res.send(result)
    })

    server.get('/infos', async (req, res) => {

        const time = Date.now()
        const account_id = Number(req.query.account_id) as unknown as number
        const limit = Number(req.query.limit) as unknown as number
        const _infos = new Revalidate('infos_' + account_id, 18 * 60 + Math.floor(Math.random() * 6))
        console.log({ account_id, limit })
        if (+account_id === undefined) {
            return res.send({ account_id: 'undefined' })
        }
        start(account_id)
        const result = await _infos.check(infos, { account_id, limit })
        console.log('Informações percentual de vitória!', (Date.now() - time) / 1000, "s")
        return res.send(result)

    })

    const _ranking = new Revalidate('ranking', 24 * 60)
    server.get('/ranking', async (req, res) => {
        let time = Date.now()
        const limit = Number(req.query.limit) as unknown as number
        console.log({ limit })
        let result = await _ranking.check(ranking, { limit, _avgGlobal })
        console.log('time ranking', (Date.now() - time) / 1000, "s")
        return res.send(result)
    });

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    (async () => {
        let limit = 1000
        const result: any = await _ranking.check(ranking, { limit, _avgGlobal })
        let count = 0
        async function createCacheInfos() {
            const account_id: number = Number(result[count].profile.account_id)
            limit = 1000
            const _infos: any = new Revalidate('infos_' + account_id, 18 * 60 + Math.floor(Math.random() * 6))
            console.log({ count, account_id, limit })
            await start(account_id)
            await _infos.check(infos, { account_id, limit })
            if (count < result.length) {
                await sleep(60 * 1000)
                createCacheInfos()
                count += 1
            }
        }
        createCacheInfos()
    })()

})
