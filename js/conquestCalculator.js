'use strict';
/*
* SOURCES
*
* https://forums.flaregames.com/t/how-to-achieve-supreme-victory-in-conquest/16641/2
* https://royal-revolt-2.fandom.com/wiki/Conquest_-_Supreme_Victory
*
*/
class Calculator {
    constructor() {
        this.outputs = [
            'skull_team',
            'skull_opponent',
            'power_team',
            'power_opponent',
            'attackdef_team',
            'attackdef_opponent'
        ];

        // Save DOM render output
        this.outputs.forEach(k => {
            this[k] = document.getElementById(k);
        });

        // Set default numeric value
        this.inputs = [
            'skull_win_team',
            'skull_win_opponent',
            'nb_player_team',
            'nb_player_opponent',
            'nb_troop_team',
            'nb_troop_opponent',
            'attack_team_hero',
            'attack_opponent_hero',
            'def_team_hero',
            'def_opponent_hero',
            'team_tower',
            'opponent_tower',
            'tower_level'
        ];

        this.inputs.forEach(k => {
            this[k] = 0;
        });

        this.tech = [
            'attack_team_troop',
            'attack_opponent_troop',
            'def_team_troop',
            'def_opponent_troop',
            'team_power',
            'opponent_power'
        ];

        this.tech.forEach(k => {
            this[k] = 1;
        });

        this.default = {
            attacker: "team",
            ground: "0.7;1.3",
            time_hour: 23,
            time_minute: 0,
            time_slider: 1380,
            tower_level: 1
        };

        // Set others default
        this.attacker    = this.default.attacker
        this.ground      = this.default.ground
        this.time_hour   = this.default.time_hour
        this.time_minute = this.default.time_minute
        this.time_slider = this.default.time_slider
        this.tower_level = this.default.tower_level

        // CONST
        this.const_basedHeroesValue = 2250;
        this.const_basedAttackHeroesValue = 75;

        // Set values based on hash
        const _this = this;
        document.location.hash.split('&').forEach(hash => {
            const [hashKey, hashValue] = hash.split('=');
            if(hashKey && hashValue) {
                _this[hashKey] = (!isNaN(hashValue)) ? parseFloat(hashValue) : hashValue;
                document.getElementById(hashKey).value = hashValue;
            }
        });

        this.render();
    }

    getDefault(id) {
    	return this.default[id];
    }

    getTimeMatrix() {
        return  [
            [24, 10],
            [8, 1],
            [this.time_hour + (this.time_minute / 60), null]
        ];
    }

    render() {
        // Time remaining (Hours)
        const d2 = this.time_hour + (this.time_minute / 60);

        // Time modifier
        const e2Calc = regression(
            'polynomial',
            this.getTimeMatrix(),
            1
        );

        const e2 = (d2 >= 8) ?
            e2Calc.points[2][1] :
            1;

        // Attack/Defense Ratings
        let totalAttackValue = 0;
        let totalDefenseValue = 0;

        // Terrain modifier
        const groundAttacker = parseFloat(this.ground.split(';')[0]);
        const groundDefender = parseFloat(this.ground.split(';')[1]);

        const towerBonus = tower => groundDefender * this.tower_level * (tower + 1);

        if (this.attacker == "team") {
            // Calculate attack ratings
            const heroAttackValue = this.nb_player_team * (this.const_basedAttackHeroesValue + this.attack_team_hero);
            const troopAttackValue = this.nb_troop_team * this.attack_team_troop;

            totalAttackValue = Math.round((heroAttackValue + troopAttackValue) * groundAttacker);

            // Calculate defense ratings
            const heroDefenseValue = this.nb_player_opponent * (this.const_basedAttackHeroesValue + this.def_opponent_hero);
            const troopDefenseValue = this.nb_troop_opponent * this.def_opponent_troop;

            totalDefenseValue = Math.round((heroDefenseValue + troopDefenseValue) * towerBonus(this.opponent_tower));
        } else {
            // Calculate attack ratings
            const heroAttackValue = this.nb_player_team * (this.const_basedAttackHeroesValue + this.def_team_hero);
            const troopAttackValue = this.nb_troop_team * this.def_team_troop;

            totalAttackValue = Math.round((heroAttackValue + troopAttackValue) * towerBonus(this.team_tower));

            // Calculate defense ratings
            const heroDefenseValue = this.nb_player_opponent * (this.const_basedAttackHeroesValue + this.attack_opponent_hero);
            const troopDefenseValue = this.nb_troop_opponent * this.attack_opponent_troop;
            
            totalDefenseValue = Math.round((heroDefenseValue + troopDefenseValue) * groundAttacker);
        }

        this.attackdef_team.innerText = this.formatNumber(totalAttackValue);
        this.attackdef_opponent.innerText = this.formatNumber(totalDefenseValue);

        // Calculate SV
        const svBased = (this.nb_player_team + this.nb_player_opponent) * this.const_basedHeroesValue;
        const svBasedTeam = svBased * totalDefenseValue / totalAttackValue * e2;
        const svBasedOpponent = svBased * totalAttackValue / totalDefenseValue * e2;

        const skull_team = (this.attacker == "team") ? 
            Math.round(svBasedTeam - this.skull_win_team + this.skull_win_opponent) : 
            Math.round(svBasedTeam + this.skull_win_opponent - this.skull_win_team);
        const skull_opponent = (this.attacker == "team") ?
            Math.round(svBasedOpponent + this.skull_win_team - this.skull_win_opponent) :
            Math.round(svBasedOpponent - this.skull_win_opponent + this.skull_win_team);

        this.skull_team.innerText = this.formatNumber(skull_team);
        this.skull_opponent.innerText = this.formatNumber(skull_opponent);

        // Calculate Energy cost
        const power_team = Math.round((16 + 16 * totalDefenseValue / totalAttackValue) * this.team_power);
        const power_opponent = Math.round((16 + 16 * totalAttackValue / totalDefenseValue) * this.opponent_power);

        this.power_team.innerText = this.formatNumber(power_team);
        this.power_opponent.innerText  = this.formatNumber(power_opponent);
    }

    resetCalc() {
        // Clear the outputs
        this.outputs.forEach(output => {
            this[output].innerText = 0;
            document.querySelector(`#${output}`).innerText = 0;
        });

        // Update the hash
        const targets = [
            createTarget('time_hour', this.default.time_hour),
            createTarget('time_minute', this.default.time_minute),
            createTarget('time_slider', this.default.time_slider),
            ...createTargets(this.inputs)
        ];
        // update takes a second param but forEach passes an index
        // so wrap and call it with only one parameter
        targets.forEach(target => update(target));
        resetTeam();
        resetTimer();
    }

    resetTech() {
        // update the hashes
        const targets = createTargets(this.tech)
        // This needs to be wrapped because forEach passes a second parameter
        setTimeout(targets.forEach(target => update(target, true)), 1000);
    }

    formatNumber(num) {
        if (!num || isNaN(num)) {
            return 0;
        }

        if (num === Infinity) {
            return '∞';
        }

        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}
