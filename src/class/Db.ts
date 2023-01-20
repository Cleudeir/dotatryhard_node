import dotenv from 'dotenv';
dotenv.config();
import { Sequelize, Model, DataTypes } from 'sequelize'

type obj = {
    [key: string]: any;
};

class Db {
    private sequelize: any
    public player: any
    public match: any
    public playersMatches: any
    private sync: any

    public constructor() {
        this.sequelize = new Sequelize(
            String(process.env.DATABASE_DB),
            String(process.env.USER_DB),
            String(process.env.PASSWORD_DB),
            {
                dialect: 'mariadb',
                host: String(process.env.HOST_DB),
                port: Number(process.env.PORT_DB)
            })
        this.player = this.sequelize.define('player', {
            account_id: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true, },
            personaname: { type: DataTypes.STRING, allowNull: true, },
            avatarfull: { type: DataTypes.STRING, allowNull: true, },
            loccountrycode: { type: DataTypes.STRING, allowNull: true, }
        })
        this.match = this.sequelize.define('match', {
            match_id: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true, },
            start_time: { type: DataTypes.BIGINT, allowNull: true, },
            cluster: { type: DataTypes.STRING, allowNull: true, },
            dire_score: { type: DataTypes.SMALLINT, allowNull: true, },
            radiant_score: { type: DataTypes.SMALLINT, allowNull: true, },
            duration: { type: DataTypes.SMALLINT, allowNull: true, },
        })
        this.playersMatches = this.sequelize.define('PLAYERS_MATCHES', {
            account_id: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true, },
            match_id: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true, },
            assists: { type: DataTypes.SMALLINT },
            deaths: { type: DataTypes.SMALLINT },
            denies: { type: DataTypes.SMALLINT },
            gold_per_min: { type: DataTypes.SMALLINT },
            hero_damage: { type: DataTypes.SMALLINT },
            hero_healing: { type: DataTypes.SMALLINT },
            kills: { type: DataTypes.SMALLINT },
            last_hits: { type: DataTypes.SMALLINT },
            net_worth: { type: DataTypes.SMALLINT },
            tower_damage: { type: DataTypes.SMALLINT },
            xp_per_min: { type: DataTypes.SMALLINT },
            win: { type: DataTypes.TINYINT },
            ability_0: { type: DataTypes.STRING },
            ability_1: { type: DataTypes.STRING },
            ability_2: { type: DataTypes.STRING },
            ability_3: { type: DataTypes.STRING },
            Hero_level: { type: DataTypes.SMALLINT },
            team: { type: DataTypes.TINYINT },
            leaver_status: { type: DataTypes.TINYINT },
            aghanims_scepter: { type: DataTypes.SMALLINT },
            aghanims_shard: { type: DataTypes.SMALLINT },
            backpack_0: { type: DataTypes.SMALLINT },
            backpack_1: { type: DataTypes.SMALLINT },
            backpack_2: { type: DataTypes.SMALLINT },
            item_0: { type: DataTypes.STRING },
            item_1: { type: DataTypes.STRING },
            item_2: { type: DataTypes.STRING },
            item_3: { type: DataTypes.STRING },
            item_4: { type: DataTypes.STRING },
            item_5: { type: DataTypes.STRING },
            item_neutral: { type: DataTypes.SMALLINT },
            moonshard: { type: DataTypes.SMALLINT },
            hero_id: { type: DataTypes.STRING },
            player_slot: { type: DataTypes.SMALLINT },
        })
        this.sync = this.tables()
    }
    private async tables() {

        this.player.belongsToMany(this.match, {
            foreignKey: 'account_id',
            constraints: true,
            through: {
                model: this.playersMatches
            }
        })
        this.match.belongsToMany(this.player, {
            foreignKey: 'match_id',
            constraints: true,
            through: {
                model: this.playersMatches
            }
        })

        this.player.hasMany(this.playersMatches, {
            foreignKey: 'account_id',
        })

        this.match.hasMany(this.playersMatches, {
            foreignKey: 'match_id',
        })

        this.playersMatches.belongsTo(this.player, {
            foreignKey: 'account_id',
            as: 'profile'
        })

        this.playersMatches.belongsTo(this.match, {
            foreignKey: 'match_id',
        })
        const force = false
        this.player.sync({ force })
        this.match.sync({ force })
        this.playersMatches.sync({ force })
    }
}
export default new Db()