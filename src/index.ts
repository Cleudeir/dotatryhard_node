import server from './class/Server';
import player from './player';
import ranking from './ranking';
import Revalidate from './class/Revalidate';
import dotenv from 'dotenv';
import infos from './infos';
import avgGlobal from './components/query/avgGlobal';
import start from './components/Steam/_index';
import fsPromises from 'fs/promises';
import fs from 'fs';
import os from "os";
const userHomeDir = os.homedir();
dotenv.config();

const dir = userHomeDir + '/temp'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const avgGlobalCache = new Revalidate('avgGlobal', 10);

avgGlobalCache.check(avgGlobal).then((_avgGlobal) => {
  server.get('/', async (req, res) => {
    res.send('Hello');
    return
  });

  server.get('/player', async (req, res) => {
    const accountId = Number(req.query.account_id) || undefined;
    if (accountId === undefined) {
      return res.send({ account_id: 'undefined' });
    }
    const limit = Number(req.query.limit) || undefined;
    const cacheKey = `player_${accountId}`;
    const cacheTTL = 1 * 60;
    const playerCache = new Revalidate(cacheKey, cacheTTL);
    const result = await playerCache.check(player, { account_id: accountId, limit, _avgGlobal });
    res.send(result);
  });

  server.get('/infos', async (req, res) => {
    const accountId = Number(req.query.account_id) || undefined;
    const limit = Number(req.query.limit) || undefined;
    const cacheKey = `infos_${accountId}`;
    const cacheTTL = 1 * 60;
    const infosCache = new Revalidate(cacheKey, cacheTTL);
    if (accountId === undefined) {
      return res.send({ account_id: 'undefined' });
    }
    const result = await infosCache.check(infos, { account_id: accountId, limit });
    res.send(result);
  });

  const rankingCache = new Revalidate('ranking', 1);
  server.get('/ranking', async (req, res) => {
    const limit = Number(req.query.limit) || undefined;
    const data = await rankingCache.check(ranking, { limit, _avgGlobal });

    res.send({ data, avgGlobal: _avgGlobal });
  });

  (async () => {
    const limit = 2000;
    let result = await ranking({ limit, _avgGlobal });
    let count: number;
    try {
      const read = String(await fsPromises.readFile(`${userHomeDir}/temp/count.json`))
      count = Number(JSON.parse(read))
    } catch (error) {
      count = 0
    }

    if (result.length > 0) {
      createCacheInfos()
    } else {
      createCacheInfos(87683422)
    }

    async function createCacheInfos(initial?: number) {
      const accountId = initial || Number(result[count].profile.account_id);

      const infosCache = new Revalidate(`infos_${accountId}`, 0);
      const playerCache = new Revalidate(`player_${accountId}`, 0);

      console.log((count + 1) + "/" + result.length);
      await start(accountId);
      await infosCache.check(infos, { account_id: accountId, limit: 500 });
      await playerCache.check(player, { account_id: accountId, limit: 20, _avgGlobal });

      if (count < result.length) {
        await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
        count += 1;
        await fsPromises.writeFile(`${userHomeDir}/temp/count.json`, JSON.stringify(count));
        setTimeout(createCacheInfos, 60 * 1000);
      } else {
        count = 0
        await fsPromises.writeFile(`${userHomeDir}/temp/count.json`, JSON.stringify(count));
        result = await ranking({ limit, _avgGlobal });
        setTimeout(createCacheInfos, 60 * 1000);
      }
    }
  })()
})
