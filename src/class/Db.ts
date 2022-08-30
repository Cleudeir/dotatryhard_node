import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize'
import { DataTypes } from 'sequelize';

type obj = {
    [key: string]: any;
};

class Db {
    private sequelize: any
    public constructor() {
        this.sequelize = new Sequelize(
        String(process.env.DATABASE_DB) || 'DB_DOTA',
        String(process.env.USER_DB) || 'username',
        String(process.env.PASSWORD_DB) || '7685' ,
        {
            dialect: 'mariadb',
            host: String(process.env.HOST_DB) || 'localhost' ,
            port: Number(process.env.PORT_DB) || 3306
        });
        this.tables()
    }
    private async tables() {
        const player = this.sequelize.define('PLAYERS', {
            account_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            personaname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            avatarfull: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            loccountrycode: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        })
        const matches = this.sequelize.define('MATCHES', {
            match_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            start_time: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            cluster: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            dire_score: {
                type: DataTypes.SMALLINT,
                allowNull: true,
            },
            radiant_score: {
                type: DataTypes.SMALLINT,
                allowNull: true,
            },
            duration: {
                type: DataTypes.SMALLINT,
                allowNull: true,
            },
        })

        const playerMatches = this.sequelize.define('PLAYERS_MATCHES', {
            account_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            match_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            assists: {type: DataTypes.SMALLINT.UNSIGNED },
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
        player.belongsToMany(matches, {
            foreignKey: 'account_id',
            constraints: true,
            through: {
                model: playerMatches
            }
        })
        matches.belongsToMany(player, {
            foreignKey: 'match_id',
            constraints: true,
            through: {
                model: playerMatches
            }
        })
        console.log(await player.sync())
        console.log(await matches.sync())
        console.log(await playerMatches.sync())
    }
}
export default new Db()