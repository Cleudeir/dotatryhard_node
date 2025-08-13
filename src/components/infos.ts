import Db from "../class/Db";
import { Op } from "sequelize";
import { parseSequelize } from "../utils/parser";

export default async function infos({
  account_id,
  limit,
}: {
  account_id: number;
  limit: number;
}): Promise<any> {
  const queryMatchIds = parseSequelize(await Db.playersMatches.findAll({
    attributes: ["match_id"],
    logging: false,
    where: {
      account_id,
    },
    order: [["match_id", "DESC"]],
    limit: limit,
    raw: true,
  }));
  const _matchIds = queryMatchIds.map((item: any) => item.match_id);
  const playersMatches: any = parseSequelize(await Db.playersMatches.findAll({
    logging: false,
    where: {
      match_id: { [Op.or]: _matchIds },
    },
    include: [
      {
        model: Db.player,
        as: "profile",
        attributes: [
          "account_id",
          "personaname",
          "avatarfull",
          "loccountrycode",
        ],
      },
    ],
  }));
  return { playersMatches, _matchIds };
}
