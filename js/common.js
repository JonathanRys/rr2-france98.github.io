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
// Flag for the clock timer
let timer_running = false;
// Interval for the clock timer
let intervalId;
// Interval for the clock timer icon
let clockIntervalId = null;
// i18n filename prefix
const i18n_file = "conquest";

const update = (e, updateHash=true) => {
  /*
  Calculates the new values and updates the UI
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
      document.location.hash = document.location.hash.replace(replaceRegex, newHash)
    }
  }

  if (e.target.form) {
    e.target.form.checkValidity()
  }

  return false;
};
