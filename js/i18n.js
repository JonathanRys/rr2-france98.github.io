'use strict';

const isDev = false;

let lang = 'en';
let curTranslate = null;

const replaceText = (el) => {
	const key = el.dataset.i18nKey;
	el.innerHTML = curTranslate[key] || key;
}

const loadLang = (lang='en') => {
	if (['en', 'fr', 'es'].indexOf(lang) === -1)
		lang = 'en';

	fetch(`/i18n/${i18n_file}-${lang}.json`).then(
		response => response.json()
	).then(
	    translate => {
		    curTranslate = translate;
    		document.querySelectorAll("[data-i18n-key]").forEach(el => replaceText(el));
	    }
	);
}

try {
    const userLang = navigator.language || navigator.userLanguage;
    const wantLang = localStorage.getItem('wantLang');
    const [uLang, uCountry] = userLang.split('-');

	lang = wantLang || uLang;
	if (lang === 'en' && uCountry === 'US') {
		lang = 'us';
	}
} catch(error) {
	if (isDev) {
    	console.log(error);
    }
}
