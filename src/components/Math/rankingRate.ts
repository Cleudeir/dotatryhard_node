
export default function rankingRate({ avg, _avgGlobal }: { avg: any, _avgGlobal: any }): any {

    function roundNumber(num: number): number {
        return Math.floor((Number(num) * 100)) / 100
    }

    const weight: any = {
        assists: 5,
        denies: 1,
        kills: 1,
        deaths: 1,
        gold_per_min: 1,
        hero_damage: 1,
        hero_healing: 0.1,
        net_worth: 1,
        tower_damage: 1,
        xp_per_min: 1,
        winRate: 3,
        last_hits: 1,
    }
    let totalValue = 0;
    let totalWeight = 0;
    const result: any = {}

    for (let key in avg) {
        if (key !== 'profile' && key !== 'account_id')
            result[key] = roundNumber(avg[key])
    }
    result.winRate = roundNumber((avg.win / avg.matches) * 100)

    for (let key in result) {
        if (key !== 'deaths' &&
            key !== 'win' &&
            key !== 'leaver_status' &&
            key !== 'matches' &&
            key !== 'winRate') {
            totalValue += (Number(result[key]) / Number(_avgGlobal[key])) * weight[key];
            totalWeight += weight[key];
        } else if (key === 'deaths') {
            let deaths = Number(result[key])
            if (deaths === 0) {
                deaths = 0.1
            }
            totalValue += (Number(_avgGlobal[key]) / deaths) * weight[key];
            totalWeight += weight[key];
        } else if (key === 'winRate') {
            totalValue += (Number(result[key]) / 50) * weight[key];
            totalWeight += weight[key];
        }
    }

    result.rankingRate = Math.floor(totalValue / totalWeight * 3000);
    result.profile = avg.profile
    return result;
}


