type obj = {
    [key: string]: any;
};

export default function rankingRate(_avg: obj, _avgGlobal: obj): obj {

    function roundNumber(x: number): number {
        return Math.floor((x * 10)) / 10
    }

    return {
        assists: roundNumber(+_avg.assists),
        denies: roundNumber(+_avg.denies),
        deaths: roundNumber(+_avg.deaths),
        gold_per_min: roundNumber(+_avg.gold_per_min),
        hero_damage: roundNumber(+_avg.hero_damage),
        hero_healing: roundNumber(+_avg.hero_healing),
        kills: roundNumber(+_avg.kills),
        last_hits: roundNumber(+_avg.last_hits),
        net_worth: roundNumber(+_avg.net_worth),
        tower_damage: roundNumber(+_avg.tower_damage),
        xp_per_min: roundNumber(+_avg.xp_per_min),
        win: roundNumber(+_avg.win),
        matches: roundNumber(_avg.matches),
        winRate: roundNumber((_avg.win / _avg.matches) * 100),

        rankingRate: Math.floor(((
            (+_avg.assists / +_avgGlobal.assists) * 1
            + (+_avg.denies / +_avgGlobal.denies) * 1
            + (+_avg.kills / +_avgGlobal.kills) * 0.5
            + (+_avgGlobal.deaths / (+_avg.deaths === 0 ? _avgGlobal.deaths : +_avg.deaths)) * 1
            + (+_avg.gold_per_min / +_avgGlobal.gold_per_min) * 0.5
            + (+_avg.hero_damage / +_avgGlobal.hero_damage) * 0.5
            + (+_avg.last_hits / +_avgGlobal.last_hits) * 0.5
            + (+_avg.hero_healing / +_avgGlobal.hero_healing) * 0.5
            + (+_avg.net_worth / +_avgGlobal.net_worth) * 0.5
            + (+_avg.tower_damage / +_avgGlobal.tower_damage) * 2
            + (+_avg.xp_per_min / +_avgGlobal.xp_per_min) * 1
            + ((_avg.win / _avg.matches) / 0.5) * 5
        )
            / (1 * 4 + 0.5 * 6 + 1 * 2 + 1 * 5)
        ) * 3000),
        profile: _avg.profile
    }
}