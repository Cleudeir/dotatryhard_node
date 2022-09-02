import matchDetails from "./matchDetails";
import matchHistory from "./matchHistory";
import profiles from "./profiles";

async function start(account_id) {
    const history = await matchHistory(account_id)
    if (history) {
        await profiles(history.players)
        await matchDetails(history.matches)
    }
}

export default start;