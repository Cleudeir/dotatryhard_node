import dotenv from 'dotenv';
dotenv.config();
import { Sequelize, Model, DataTypes } from 'sequelize'

type obj = {
    [key: string]: any;
};

class Db {
    private sequelize: any
    public player: {
        account_id: number;
        personaname: String;
        avatarfull: String;
        loccountrycode: String;
    } | any
    public match: {
        match_id: number;
        start_time: number;
        cluster: String;
        dire_score: number;
        radiant_score: number;
        duration: number;
    } | any
    public playersMatches: {
        account_id: number;
        personaname: String;
        avatarfull: String;
        loccountrycode: String;
    } | any
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
            assists: { type: DataTypes.SMALLINT.UNSIGNED },
            deaths: { type: DataTypes.SMALLINT.UNSIGNED },
            denies: { type: DataTypes.SMALLINT.UNSIGNED },
            gold_per_min: { type: DataTypes.SMALLINT.UNSIGNED },
            hero_damage: { type: DataTypes.SMALLINT.UNSIGNED },
            hero_healing: { type: DataTypes.SMALLINT.UNSIGNED },
            kills: { type: DataTypes.SMALLINT.UNSIGNED },
            last_hits: { type: DataTypes.SMALLINT.UNSIGNED },
            net_worth: { type: DataTypes.SMALLINT.UNSIGNED },
            tower_damage: { type: DataTypes.SMALLINT.UNSIGNED },
            xp_per_min: { type: DataTypes.SMALLINT.UNSIGNED },
            win: { type: DataTypes.TINYINT.UNSIGNED },
            ability_0: { type: DataTypes.SMALLINT.UNSIGNED },
            ability_1: { type: DataTypes.SMALLINT.UNSIGNED },
            ability_2: { type: DataTypes.SMALLINT.UNSIGNED },
            ability_3: { type: DataTypes.SMALLINT.UNSIGNED },
            Hero_level: { type: DataTypes.SMALLINT.UNSIGNED },
            team: { type: DataTypes.TINYINT.UNSIGNED },
            leaver_status: { type: DataTypes.TINYINT.UNSIGNED },
            aghanims_scepter: { type: DataTypes.SMALLINT.UNSIGNED },
            aghanims_shard: { type: DataTypes.SMALLINT.UNSIGNED },
            backpack_0: { type: DataTypes.SMALLINT.UNSIGNED },
            backpack_1: { type: DataTypes.SMALLINT.UNSIGNED },
            backpack_2: { type: DataTypes.SMALLINT.UNSIGNED },
            item_0: { type: DataTypes.SMALLINT.UNSIGNED },
            item_1: { type: DataTypes.SMALLINT.UNSIGNED },
            item_2: { type: DataTypes.SMALLINT.UNSIGNED },
            item_3: { type: DataTypes.SMALLINT.UNSIGNED },
            item_4: { type: DataTypes.SMALLINT.UNSIGNED },
            item_5: { type: DataTypes.SMALLINT.UNSIGNED },
            item_neutral: { type: DataTypes.SMALLINT.UNSIGNED },
            moonshard: { type: DataTypes.SMALLINT.UNSIGNED },
            hero_id: { type: DataTypes.SMALLINT.UNSIGNED },
            player_slot: { type: DataTypes.SMALLINT.UNSIGNED },
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
        this.player.sync()
        this.match.sync()
        this.playersMatches.sync()
    }
    public async start() {

    }
}
export default new Db()