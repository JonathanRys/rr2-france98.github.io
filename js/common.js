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

// Create calculator instance
const calc = new Calculator();
// Flag for the clock timer
let timer_running = false;
// Interval for the clock timer
let intervalId;
// i18n filename prefix
const i18n_file = "conquest";

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
    return true;
  }

  calc[e.target.id] = (!isNaN(e.target.value)) ? parseFloat(e.target.value) : e.target.value;
  calc.render();

  // Set hash to share link
  const newHash = e.target.id + '=' + calc[e.target.id];
  const replaceRegex = new RegExp(e.target.id + '=([a-z0-9;.])*', 'gi');
  if (document.location.hash.indexOf(e.target.id + '=') === -1) {
    document.location.hash += '&' + newHash;
  } else {
    document.location.hash = document.location.hash.replace(replaceRegex, newHash)
  }

  if (e.target.form) {
    e.target.form.checkValidity()
  }

  return false;
};
