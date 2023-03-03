import server from './class/Server';
import player from './player';
import ranking from './ranking';
import Revalidate from './class/Revalidate';
import dotenv from 'dotenv';
import infos from './infos';
import avgGlobal from './components/query/avgGlobal';
import start from './components/Steam/_index';

dotenv.config();

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
    const cacheTTL = 1 * 60 + Math.floor(Math.random() * 1);
    const playerCache = new Revalidate(cacheKey, cacheTTL);

    const result = await playerCache.check(player, { account_id: accountId, limit, _avgGlobal });
    res.send(result);
    return await start(accountId);
  });

  server.get('/infos', async (req, res) => {
    const accountId = Number(req.query.account_id) || undefined;
    const limit = Number(req.query.limit) || undefined;
    const cacheKey = `infos_${accountId}`;
    const cacheTTL = 1 * 60 + Math.floor(Math.random() * 1);
    const infosCache = new Revalidate(cacheKey, cacheTTL);

    if (accountId === undefined) {
      return res.send({ account_id: 'undefined' });
    }

    const result = await infosCache.check(infos, { account_id: accountId, limit });

    res.send(result);
    return await start(accountId);
  });

  const rankingCache = new Revalidate('ranking', 1);
  server.get('/ranking', async (req, res) => {
    const limit = Number(req.query.limit) || undefined;
    const data = await rankingCache.check(ranking, { limit, _avgGlobal });

    res.send({ data, avgGlobal: _avgGlobal });
  });

  (async () => {
    const limit = 1000;
    const result = await rankingCache.check(ranking, { limit, _avgGlobal });
    let count = 0;
    if (result.length > 0) {
      createCacheInfos()
    } else {
      createCacheInfos(87683422)
    }

    async function createCacheInfos(initial?: number) {
      const accountId = initial || Number(result[count].profile.account_id);
      const cacheKey = `infos_${accountId}`;
      const cacheTTL = 23 * 60 + Math.floor(Math.random() * 1);
      const infosCache = new Revalidate(cacheKey, cacheTTL);

      await start(accountId);
      await infosCache.check(infos, { account_id: accountId, limit: 1000 });

      if (count < result.length) {
        await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
        count += 1;
        createCacheInfos();
      }
    }
  })()
})
