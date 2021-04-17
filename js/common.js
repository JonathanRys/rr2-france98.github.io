'use strict';

// Data for the language selector
const languageData = [{
    lang: 'fr',
    label: 'Français'
}, {
    lang: 'en',
    label: 'English'
}, {
    lang: 'es',
    label: 'Español'
}];

// flag to enable logging
const isDev = false;
// Create calculator instance
const calc = new Calculator();
// i18n filename prefix
const i18n_file = 'conquest';
// Flag for the clock timer
let timer_running = false;
// Interval for the clock timer
let intervalId;
// Interval for the clock timer icon
let clockIntervalId = null;

const createTarget = (target, value) => {
    /*
    Creates a mock event target for running mass updates.
    */
    if (!value && typeof target === 'string') {
        const targetElem = document.querySelector(`#${target}`);
        // How to tell what the value is?
        value = calc.getDefault(target) || 0;
    }

    const kvPair = {};
    kvPair['id'] = target;
    kvPair['value'] = value;

    return {target: {...kvPair}};
}

const createTargets = ids => {
    return ids.map(target => createTarget(target));
}

// Common clock functions
const setIcon = hour => {
    /*
    Sets the timer icon on an element with the id "timer"

    @param hour: hour on the clock face
    */

    const timeIcons = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];
    const timer = document.querySelector('#timer');

    if (hour === null) {
        // set the timer icon to 0
        timer.innerText = '⏲️';
    } else {
        timer.innerText = timeIcons[hour % 12];
    }
};

const resetTeam = (attacker='team') => {
    /*
    Resets the Attacker / Defender
    */
    update(createTarget('attacker', attacker));

    // Reset the attacker / defender UI
    switch (attacker) {
    case 'team':
        team.innerText = 'Attacker';
        opponent.innerText = 'Defender';
        // reset i18n
        team.dataset.i18nKey = 'attacker';
        opponent.dataset.i18nKey = 'defender';
    case 'opponent':    
        team.innerText = 'Defender';
        opponent.innerText = 'Attacker';
        // reset i18n
        team.dataset.i18nKey = 'defender';
        opponent.dataset.i18nKey = 'attacker';
    }
}

const resetTimer = () => {
    /*
    Resets the timer
    */
    timer_running = false;
    clearInterval(intervalId);
    clearInterval(clockIntervalId);
    setIcon(null);
}

// 
const update = (e, updateHash=true) => {
    /*
    Calculates the new values and updates the UI

    @param e: event object
    @param updateHash: bool
    */

    // Ignore the accordion checkbox
    if (
        e.target.id.indexOf('accordion') !== -1 || 
        e.target.type &&
        ['select', 'input'].indexOf(e.target.type.toLowerCase()) !== -1
    ) {
        return true;
    }

    calc[e.target.id] = (!isNaN(e.target.value)) ? parseFloat(e.target.value) : e.target.value;
    calc.render();

    if (updateHash) {
        // Set hash to share link
        const newHash = e.target.id + '=' + calc[e.target.id];
        const replaceRegex = new RegExp(e.target.id + '=([a-z0-9;.])*', 'gi');
        if (document.location.hash.indexOf(e.target.id + '=') === -1) {
            document.location.hash += '&' + newHash;
        } else {
            console.log('updating hash:', newHash)
            document.location.hash = document.location.hash.replace(replaceRegex, newHash)
        }
    }

    if (e.target.form) {
        e.target.form.checkValidity()
    }

    return false;
};
