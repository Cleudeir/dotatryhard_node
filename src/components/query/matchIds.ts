import Db from "../../class/Db";
export default async function matchIds({ account_id, limit }: { account_id: number, limit: number }) {
    const queryMatchIds = await Db.playersMatches.findAll({
        attributes: ['match_id'],
        logging: false,
        where: {
            account_id
        },
        order: [['match_id', 'DESC']],
        limit: limit
    })
    const _matchIds = queryMatchIds.map((x: any) => x.match_id)
    return _matchIds
}
