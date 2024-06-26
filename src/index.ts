import server from "./class/Server";
import player from "./player";
import ranking from "./ranking";
import Revalidate from "./class/Revalidate";
import dotenv from "dotenv";
import infos from "./infos";
import avgGlobal from "./components/query/avgGlobal";
import start from "./components/Steam/_index";
import fsPromises from "fs/promises";
import fs from "fs";
import os from "os";
const userHomeDir = os.homedir();
dotenv.config();

const dir = userHomeDir + "/temp";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const avgGlobalCache = new Revalidate("avgGlobal", 0);

avgGlobalCache.check(avgGlobal).then((_avgGlobal) => {
  console.log("_avgGlobal: ", _avgGlobal);
  server.get("/", async (req, res) => {
    res.status(200).json({ status: "online" });
    return;
  });

  server.get("/player", async (req, res) => {
    const accountId = Number(req.query.account_id) || undefined;
    if (accountId === undefined) {
      return res.send({ account_id: "undefined" });
    }
    const limit = Number(req.query.limit) || undefined;
    const cacheKey = `player_${accountId}`;
    const cacheTTL = 1 * 10;
    const playerCache = new Revalidate(cacheKey, cacheTTL);
    const result = await playerCache.check(player, {
      account_id: accountId,
      limit,
      _avgGlobal,
    });
    res.send(result);
  });

  server.get("/infos", async (req, res) => {
    const accountId = Number(req.query.account_id) || undefined;
    const limit = Number(req.query.limit) || undefined;
    const cacheKey = `infos_${accountId}`;
    const cacheTTL = 1 * 10;
    const infosCache = new Revalidate(cacheKey, cacheTTL);
    if (accountId === undefined) {
      return res.send({ account_id: "undefined" });
    }
    const result = await infosCache.check(infos, {
      account_id: accountId,
      limit,
    });
    res.send(result);
  });

  const rankingCache = new Revalidate("ranking", 0);
  server.get("/ranking", async (req, res) => {
    const limit = Number(req.query.limit) || undefined;
    const data = await rankingCache.check(ranking, { limit, _avgGlobal });
    res.send({ data, avgGlobal: _avgGlobal });
  });

  (async () => {
    const limit = 3000;
    let data = await ranking({ limit, _avgGlobal });
    console.log("result: ", data);
    let count: number;
    try {
      const read = String(
        await fsPromises.readFile(`${userHomeDir}/temp/count.json`)
      );
      const number = Number(JSON.parse(read));
      if (data.length < number) {
        count = 0;
      } else {
        count = number;
      }
    } catch (error) {
      count = 0;
    }
    console.log("#$ count: ", data.length, count);
    createCacheInfos();

    async function createCacheInfos(initial?: number) {
      try {
        console.log("count : ### ", count + "/" + data.length, " ###");
        if (data.length < count || data.length === 0) {
          data = await ranking({ limit, _avgGlobal });
          count = 0;    
        }
        let accountId = 87683422;
        if (
          !initial &&
          data &&
          data[count] &&
          data[count].profile &&
          data[count].profile.account_id
        ) {
          accountId = Number(data[count].profile.account_id);
        }
        await start(accountId);
        await infos({ account_id: accountId, limit: 200 });
        await player({ account_id: accountId, limit: 20, _avgGlobal });

        count += 1;
        if (count === 3000) {
          count = 0;
        }
        await fsPromises.writeFile(
          `${userHomeDir}/temp/count.json`,
          JSON.stringify(count)
        );
        await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        createCacheInfos();
      } catch (error) {
        console.error(error);
      }
    }
  })();
});
