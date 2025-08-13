import Db from "../../class/Db";
import { parseSequelize } from "../../utils/parser";
export default async function matchIds({ account_id, limit }: { account_id: number, limit: number }) {
    const queryMatchIds = parseSequelize(await Db.playersMatches.findAll({
        attributes: ['match_id'],
        logging: false,
        where: {
            account_id
        },
        include: [{
            model: Db.match,
            as: 'match',
        }],
        order: [['match_id', 'DESC']],
        limit: limit,
    }))
    const match = queryMatchIds.map((item: any) => item.match)
    console.log('matchIds', match)
    return match
}
