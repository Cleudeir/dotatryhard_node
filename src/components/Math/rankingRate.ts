type obj = {
    [key: string]: any;
};

export default function rankingRate(avg: obj, avgGlobal: obj): obj {

    function roundNumber(x: number): number {      
        return Math.floor((x * 10)) / 10
    }

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

        rankingRate: Math.floor(((
            (+avg.assists / +avgGlobal.assists) * 1
            + (+avg.denies / +avgGlobal.denies) * 1
            + (+avg.kills / +avgGlobal.kills) * 0.5
            + (+avgGlobal.deaths / (+avg.deaths === 0 ? avgGlobal.deaths : +avg.deaths)) * 1
            + (+avg.gold_per_min / +avgGlobal.gold_per_min) * 0.5
            + (+avg.hero_damage / +avgGlobal.hero_damage) * 0.5
            + (+avg.last_hits / +avgGlobal.last_hits) * 0.5
            + (+avg.hero_healing / +avgGlobal.hero_healing) * 0.5
            + (+avg.net_worth / +avgGlobal.net_worth) * 0.5
            + (+avg.tower_damage / +avgGlobal.tower_damage) * 2
            + (+avg.xp_per_min / +avgGlobal.xp_per_min) * 1
            + ((avg.win / avg.matches) / 0.5) * 3
        )
            / (1 * 4 + 0.5 * 6 + 1 * 2 + 1 * 3)
        ) * 3000),
        profile: avg.profile
    }
}