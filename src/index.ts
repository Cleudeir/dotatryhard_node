import server from './class/Server';
import playerHistory from './components/routes/playerHistory';
import ranking from './components/routes/ranking';
import updateMatches from './components/Steam/_index';
import Revalidate from './class/Revalidate'
import dotenv from 'dotenv';
import infos from './components/routes/infos';
import RevalidateGroup from './class/RevalidateGroup';
dotenv.config();

type obj = {
    [key: string]: any;
};



const update = new Revalidate("update", 1)
const _playerHistory = new RevalidateGroup("playerHistory", 60)
server.get('/player', async (req, res) => {
    const time = Date.now()

    const account_id = req.query.account_id as unknown as number
    const limit = req.query.limit as unknown as number
    console.log(account_id)
    if (+account_id === undefined) {
        return res.send({ account_id: 'undefined' })
    }

    update.check(updateMatches, account_id)
    const result = await _playerHistory.check(account_id, playerHistory, { account_id: +account_id, limit })
    console.log('time player', (Date.now() - time) / 1000, "s")
    return res.send(result)
})
const _infos = new RevalidateGroup("infos", 60)
server.get('/infos', async (req, res) => {
    const time = Date.now()

    const account_id = req.query.account_id as unknown as number
    const limit = req.query.limit as unknown as number
    console.log({ account_id, limit })
    if (+account_id === undefined) {
        return res.send({ account_id: 'undefined' })
    }

    const result = await _infos.check(+account_id, infos, { account_id: +account_id, limit })
    console.log('infos player', (Date.now() - time) / 1000, "s")
    return res.send(result)
})

server.get('/add', async (req, res) => {
    const time = Date.now()
    const account_id = req.query.account_id as unknown as string
    const limit = req.query.limit as unknown as string
    console.log(account_id)
    if (+account_id === undefined) {
        return res.send({ account_id: 'undefined' })
    }

    await update.check(updateMatches, account_id)
    const result = await playerHistory({ account_id: +account_id, limit: +limit })
    console.log('time add', (Date.now() - time) / 1000, "s")
    return res.send(result)
})


const _ranking = new Revalidate("ranking", 4)

let count: number = 0
let inUse = false

server.get('/ranking', async (req, res) => {
    const time = Date.now()
    const limit = req.query.limit as unknown as string
    console.log({ limit })
    let result = await _ranking.check(ranking, +limit)
    if (inUse === false) {        
        const updateData : any = async function () {
            const element = result[count];
            if(result && element){
                inUse = true
                count++
                console.log('Busca automática do perfil: ', count, '/', result.length, element.profile.personaname)
                await updateMatches(element.profile.account_id)
                if (count < result.length-1) {                
                    updateData()
                } else {
                    count = 0
                    inUse = false
                }
            }           
        }   
        updateData()    
    }    
    console.log('time ranking', (Date.now() - time) / 1000, "s")
    return res.send(result)
})

