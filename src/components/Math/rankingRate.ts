
export default function rankingRate({ avg, _avgGlobal }: { avg: any, _avgGlobal: any }): any {
    function roundNumber(x: number): number {
        return Math.floor((x * 10)) / 10
    }
    const rankingRate = Math.floor(((
        (+avg.assists / +_avgGlobal.assists) * 1
        + (+avg.denies / +_avgGlobal.denies) * 1
        + (+avg.kills / +_avgGlobal.kills) * 0.5
        + (+_avgGlobal.deaths / (+avg.deaths === 0 ? +_avgGlobal.deaths : +avg.deaths)) * 1
        + (+avg.gold_per_min / +_avgGlobal.gold_per_min) * 0.5
        + (+avg.hero_damage / +_avgGlobal.hero_damage) * 0.5
        + (+avg.last_hits / +_avgGlobal.last_hits) * 0.5
        + (+avg.hero_healing / +_avgGlobal.hero_healing) * 0.5
        + (+avg.net_worth / +_avgGlobal.net_worth) * 0.5
        + (+avg.tower_damage / +_avgGlobal.tower_damage) * 2
        + (+avg.xp_per_min / +_avgGlobal.xp_per_min) * 1
        + ((+avg.win / +avg.matches) / 0.5) * 5
    )
        / (1 * 4 + 0.5 * 6 + 1 * 2 + 1 * 5)
    ) * 3000)
    return {
        assists: roundNumber(+avg.assists),
        denies: roundNumber(+avg.denies),
        deaths: roundNumber(+avg.deaths),
        gold_per_min: roundNumber(+avg.gold_per_min),
        hero_damage: roundNumber(+avg.hero_damage),
        hero_healing: roundNumber(+avg.hero_healing),
        kills: roundNumber(+avg.kills),
        last_hits: roundNumber(+avg.last_hits),
        net_worth: roundNumber(+avg.net_worth),
        tower_damage: roundNumber(+avg.tower_damage),
        xp_per_min: roundNumber(+avg.xp_per_min),
        win: roundNumber(+avg.win),
        matches: roundNumber(avg.matches),
        winRate: roundNumber((avg.win / avg.matches) * 100),
        rankingRate,
        profile: avg.profile
    }
}