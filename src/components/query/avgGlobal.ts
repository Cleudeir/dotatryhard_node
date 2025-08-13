import Db from "../../class/Db";
import sequelize, { Op } from "sequelize";
import { parseSequelize as parseSequelize } from "../../utils/parser";
export default async function avgGlobal() {
  const [data] = parseSequelize(await Db.playersMatches.findAll({
    attributes: [
      [sequelize.fn("avg", sequelize.col("assists")), "assists"],
      [sequelize.fn("avg", sequelize.col("deaths")), "deaths"],
      [sequelize.fn("avg", sequelize.col("denies")), "denies"],
      [sequelize.fn("avg", sequelize.col("gold_per_min")), "gold_per_min"],
      [sequelize.fn("avg", sequelize.col("hero_damage")), "hero_damage"],
      [sequelize.fn("avg", sequelize.col("hero_healing")), "hero_healing"],
      [sequelize.fn("avg", sequelize.col("kills")), "kills"],
      [sequelize.fn("avg", sequelize.col("last_hits")), "last_hits"],
      [sequelize.fn("avg", sequelize.col("net_worth")), "net_worth"],
      [sequelize.fn("avg", sequelize.col("tower_damage")), "tower_damage"],
      [sequelize.fn("avg", sequelize.col("xp_per_min")), "xp_per_min"],
      [sequelize.fn("sum", sequelize.col("win")), "win"],
      [sequelize.fn("sum", sequelize.col("leaver_status")), "leaver_status"],
      [sequelize.fn("count", sequelize.col("match_id")), "matches"],
    ],
    logging: false,
    raw: true,
  }));
  return data;
}
