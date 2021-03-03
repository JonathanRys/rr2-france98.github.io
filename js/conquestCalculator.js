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
		// Show console info message
		console.log('%c Look at "calc" variable to play with this script ', 'background: red; color: #222; font-size: 32px;');

		// Save DOM render output
		[
			'skullTeam',
			'skullOpponent',
			'powerTeam',
			'powerOpponent',
			'attackdefTeam',
			'attackdefOpponent'
		].forEach(k => {
			this[k] = document.getElementById(k);
		});

		// Set default numeric value
		[
			'skullWinTeam',
			'skullWinOpponent',
			'nbPlayerTeam',
			'nbPlayerOpponent',
			'nbTroopTeam',
			'nbTroopOpponent',
			'attackTeamHero',
			'attackOpponentHero',
			'defTeamHero',
			'defOpponentHero',
			'team_tower',
			'opponent_tower'
		].forEach(k => {
			this[k] = 0;
		});

		[
			'attackTeamTroop',
			'attackOpponentTroop',
			'defTeamTroop',
			'defOpponentTroop',
			'team_power',
			'opponent_power'
		].forEach(k => {
			this[k] = 1;
		});

		// Set others default
		this.timeHour = 23;
		this.timeMinute = 0;
		this.attacker = "team";
		this.towerLevel = 1;
		this.ground = "0.7;1.3";

		// CONST
		this.const_timeRemainingData = [24, 10];
		this.const_timeModifierData = [8, 1];

		this.const_basedHeroesValue = 2250;
		this.const_basedAttackHeroesValue = 75;

		// Set values based on hash
		const that = this;
		document.location.hash.split('&').forEach(hash => {
			const hashSplited = hash.split('=');
			if(hashSplited.length == 2) {
				that[hashSplited[0]] = (!isNaN(hashSplited[1])) ? parseFloat(hashSplited[1]) : hashSplited[1];
				document.getElementById(hashSplited[0]).value = hashSplited[1];
			}
		});

		this.render();
	}

	render() {
		// Time remaining (Hours)
		const d2 = this.timeHour + (this.timeMinute / 60);

		// Time modifier
		const e2Calc = regression(
			'polynomial', 
			[
			    this.const_timeRemainingData, 
			    this.const_timeModifierData, 
			    [d2, null]
			],
			1
		);

		const e2 = (d2 >= 8) ?
		    e2Calc.points[2][1] : 
		    1;

		console.log('-------------- e2', e2);

		// Terrain modifier
		const groundAttacker = parseFloat(this.ground.split(';')[0]);
		const groundDefender = parseFloat(this.ground.split(';')[1]);

		// Rating
		let attackdefTeam = 0;
		let attackdefOpponent = 0;

		const towerBonus = tower => groundDefender * this.towerLevel * (tower + 1);

		if(this.attacker == "team") {
			// Calculate attack ratings
			const heroAttackValue = this.nbPlayerTeam * (this.const_basedAttackHeroesValue + this.attackTeamHero);
			const troopAttackValue = this.nbTroopTeam * this.attackTeamTroop;
			// Calculate defense ratings
			const heroDefValue = this.nbPlayerOpponent * (this.const_basedAttackHeroesValue + this.defOpponentHero);
			const troopDefValue = this.nbTroopOpponent * this.defOpponentTroop;

			attackdefTeam = Math.round((heroAttackValue + troopAttackValue) * groundAttacker);
			attackdefOpponent = Math.round((heroDefValue + troopDefValue) * towerBonus(this.opponent_tower));

		} else {
			// Calculate attack ratings
			const heroAttackValue = this.nbPlayerTeam * (this.const_basedAttackHeroesValue + this.defTeamHero);
			const troopAttackValue = this.nbTroopTeam * this.defTeamTroop;
			// Calculate defense ratings
			const heroDefValue = this.nbPlayerOpponent * (this.const_basedAttackHeroesValue + this.attackOpponentHero);
			const troopDefValue = this.nbTroopOpponent * this.attackOpponentTroop;

			attackdefTeam = Math.round((heroAttackValue + troopAttackValue) * towerBonus(this.team_tower));
			attackdefOpponent = Math.round((heroDefValue + troopDefValue) * groundAttacker);
		}

		this.attackdefTeam.innerText = this.formatNumber(attackdefTeam);
		this.attackdefOpponent.innerText = this.formatNumber(attackdefOpponent);

		// SV skulls required
		const svBased = (this.nbPlayerTeam + this.nbPlayerOpponent) * this.const_basedHeroesValue;
		const svBasedTeam = svBased * attackdefOpponent / attackdefTeam * e2;
		const svBasedOpponent = svBased * attackdefTeam / attackdefOpponent * e2;

		const skullTeam = (this.attacker == "team") ? 
		    Math.round(svBasedTeam - this.skullWinTeam + this.skullWinOpponent) : 
		    Math.round(svBasedTeam + this.skullWinOpponent - this.skullWinTeam);
		const skullOpponent = (this.attacker == "team") ?
		    Math.round(svBasedOpponent + this.skullWinTeam - this.skullWinOpponent) :
		    Math.round(svBasedOpponent - this.skullWinOpponent + this.skullWinTeam);

		this.skullTeam.innerText = this.formatNumber(skullTeam);
		this.skullOpponent.innerText = this.formatNumber(skullOpponent);

		// Energy cost
		const powerTeam = Math.round((16 + 16 * attackdefOpponent / attackdefTeam) * this.team_power);
		const powerOpponent = Math.round((16 + 16 * attackdefTeam / attackdefOpponent) * this.opponent_power);

		this.powerTeam.innerText = this.formatNumber(powerTeam);
		this.powerOpponent.innerText  = this.formatNumber(powerOpponent);
	}

	formatNumber(num) {
		if(!num || isNaN(num))
			return '0';

		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}
}

const update = e => {
    /*
    Calculates the new values and updates the UI
    */

    // Ignore the accordion checkbox
    if (
        e.target.id.indexOf('accordion') !== -1 || 
        e.target.type &&
        ['select', 'input'].indexOf(e.target.type.toLowerCase()) !== -1
    ) {
        return;
    }

    // Create calculator instance
	const calc = new Calculator();

    calc[e.target.id] = (!isNaN(e.target.value)) ? parseFloat(e.target.value) : e.target.value;
    calc.render();

    // Set hash to share link
    const newHash = e.target.id + '=' + calc[e.target.id];
    const replaceRegex = new RegExp(e.target.id + '=([a-z0-9;.])*', 'gi');
    if (document.location.hash.indexOf(e.target.id + '=') === -1)
        document.location.hash += '&' + newHash;
    else
        document.location.hash = document.location.hash.replace(replaceRegex, newHash)
};

// Attach change event handler for form inputs
document.querySelector('#container').addEventListener('change', update);
