'use strict';

window.onload = () => {
    // populate language dropdown
    if (lang !== "fr") {
        loadLang(lang);
        // switch the data and icon to US English
        if (lang === 'us') {
            languageData[1].lang = lang;
            document.querySelector('#lang-flag').src = `./img/${lang}.png`
        }
    }

    // Create a map for the main label of the language dropdown
    const languageMap = languageData.map(item => {
        return {[item.lang]: item.label}
    }).reduce((acc, x) => Object.assign(acc, x), {});

    const languageDropdown = document.querySelector('#language-dropdown');
    const languageDropdownOptions = document.querySelector('#language-dropdown-options');

    languageDropdown.addEventListener('click', e => {
        e.preventDefault();

        if (e.target.classList.contains('dropdown-item')) {
            const lang = e.target.dataset.lang;

            languageDropdown.dataset.selectedLang = lang;
            const label = `<img src="./img/${lang}.png" alt="${lang}" width="32" height="21" /> ${languageMap[lang]}`;
            languageDropdown.querySelector('a.dropdown-toggle').innerHTML = label;
            
            if (lang){
                loadLang(lang);
                if (window.localStorage) {
                    localStorage.setItem('wantLang', lang);
                }
            }
        }

        return false;
    });

    const container = new DocumentFragment();
    
    languageData.forEach(option => {
        // Create DOM elements
        const item = document.createElement('li');
        const label = document.createElement('a');
        const flag = document.createElement('img');

        // Assign label properties
        label.id = `lang-option-${option.lang}`;
        label.classList.add('dropdown-item');
        label.dataset.lang = option.lang;
        label.href = '#';

        // Assign img properties
        flag.src = `./img/${option.lang}.png`;
        flag.alt = option.lang;
        flag.width = '32';
        flag.height = '21';

        label.appendChild(flag);
        label.appendChild(document.createTextNode(` ${option.label}`));

        item.appendChild(label);

        container.appendChild(item);
    });
    
    languageDropdownOptions.appendChild(container);

    // Attach change event handler for form inputs
    document.querySelector('#container').addEventListener('change', update);

    // attacker / defender toggle
    const attackerToggle = document.querySelector('#attacker-toggle');
    attackerToggle.addEventListener('click', e => {
        const attacker = document.querySelector('#attacker');
        const newValue = attacker.value === 'team' ? 'opponent' : 'team';

        // Update the UI
        resetTeam(newValue)

        if (calc) {
            calc['attacker'] = newValue;
            calc.render();
        }
    });

    // Timer
    const timerButton = document.querySelector('#timer');
    timerButton.addEventListener('click', updateEveryMinute);

    // Slider
    const slider = document.querySelector('#time_slider');
    const hourInput = document.querySelector('#time_hour');
    const minuteInput = document.querySelector('#time_minute');

    // Update the inputs when the slider changes
    const handleSliderInput = (e) => {
        const hours = Math.floor(slider.value / 60);
        const minutes = slider.value - hours * 60;

        hourInput.value = hours;
        minuteInput.value = minutes;
        updateTimerUi(hours, minutes, false);
        resetTimer();
    };

    // Update the inputs when the slider changes
    const handleSliderChange = (e) => {
        const hours = Math.floor(slider.value / 60);
        const minutes = slider.value - hours * 60;

        hourInput.value = hours;
        minuteInput.value = minutes;
        updateTimerUi(hours, minutes);
    };

    // Update the slider when the input values change
    const handleTimeChange = () => {
        const hours = hourInput.value;
        const minutes = minuteInput.value;
        
        slider.value = hours * 60 + +minutes;
        updateTimerUi(hours, minutes);
        resetTimer();
    };

    slider.addEventListener('input', handleSliderInput);
    slider.addEventListener('change', handleSliderChange);
    hourInput.addEventListener('input', handleTimeChange);
    minuteInput.addEventListener('input', handleTimeChange);

    // Form buttons
    document.querySelector('#tech-form').addEventListener('reset', (e) => {
        calc.resetTech();
    });

    document.querySelector('#calc-form').addEventListener('reset', (e) => {
        calc.resetCalc();
    });
};
