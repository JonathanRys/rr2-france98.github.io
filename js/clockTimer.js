const updateTimerUi = (hour, minute, updateHash=true) => {
    /*
    Updates the hour and minute and the url

    @param hour: hours left
    @param minute: minutes left
    */

    inputs = [
        {id: 'time_hour', value: hour},
        {id: 'time_minute', value: minute},
        {id: 'time_slider', value: hour * 60 + +minute}
    ];

    for (const input of inputs) {
        document.querySelector(`#${input.id}`).value = input.value;
        update({target: input}, updateHash);
    }
};

'use strict';

const setIcon = (hour) => {
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

const makeClockTimer = (hour, minute, callback) => {
    /*
    Creates a closure and returns a function intended for use in an interval.
    Decrements minutes every time the function is called.
    
    @param hour: hours left
    @param minute: minutes left
    @param callback: function to be called every interval
    
    returns func: An anonymous function to be used in a timeout or interval
    */

    return () => {
        if (hour || minute) {
            // Call the callback
            if (callback && typeof callback === 'function') {
                callback(hour, minute);
            }

            // Decrement the hour counter and reset minutes if needed
            if (!minute) {
                minute = 60;
                hour--;
            }
            minute--;
        } else {
            // Out of time
            if (callback && typeof callback === 'function') {
                callback(null, null);
            }
            // intervalId needs to be in the parent scope since the
            // curried function is called before intervalId exists.
            clearInterval(intervalId);
        }
    }
}

const updateEveryFiveSeconds = () => {
    /*
    Event handler to make the clock count down every 5 seconds
    */

    const timer = document.querySelector('#timer');
    let interval = 11;
    clockIntervalId = setInterval(() => {
        setIcon(interval--);
        if (interval < 0) {
            clearInterval(clockIntervalId);
        }
    }, 5000);

    return clockIntervalId;
};

const updateEveryMinute = () => {
    /*
    Event handler to count down and update the UI every minute.
    */

    // Disable button
    document.querySelector('#timer').disabled = true;
    // Enable button after 200ms
    setTimeout(() => document.querySelector('#timer').disabled = false, 200);

    if (timer_running) {
        // toggle the timer off
        timer_running = false;
        clearInterval(intervalId);
        clearInterval(clockIntervalId);
        setIcon(null);
        return;
    }

    timer_running = true

    // One minute is 60000 milliseconds
    const MINUTE = 60000;

    const startHour =  document.querySelector('#time_hour').value;
    const startMinute = document.querySelector('#time_minute').value;

    // Set the icon
    setIcon(0);
    clockIntervalId = updateEveryFiveSeconds();

    const clockHandler = (hour, minute) => {
        updateTimerUi(hour, minute);
        clockIntervalId = updateEveryFiveSeconds();
    };

    intervalId = setInterval(makeClockTimer(startHour, startMinute, clockHandler), MINUTE);
}
