import matchDetails from "./matchDetails";
import matchHistory from "./matchHistory";
import profiles from "./profiles";
import upDateProfiles from "./upDateProfiles";


async function start(account_id: number) {
    const history = await matchHistory(account_id)
    const updateResult = await upDateProfiles(account_id)
    if (history) {
        const profileResult = await profiles(history.players)
        const matchDetailsResult = await matchDetails(history.matches)
        console.log({ history, profileResult, matchDetailsResult, updateResult })
    }
}

export default start;