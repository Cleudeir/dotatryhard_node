import matchDetails from "./matchDetails";
import matchHistory from "./matchHistory";
import profiles from "./profiles";
import upDateProfiles from "./upDateProfiles";


async function start(account_id: number) {
    console.log("-----------------------------")
    const history = await matchHistory(account_id)
    await upDateProfiles(account_id)
    if (history) {
        await profiles(history.players)
        await matchDetails(history.matches)
    }
    return history
}

export default start;