import Db from "../../class/Db";
export default async function matchIds({ account_id, limit }: { account_id: number, limit: number }) {
    const queryMatchIds = await Db.playersMatches.findAll({
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
    })
    const match = [...queryMatchIds].map(item => item.match)
    return match
}
