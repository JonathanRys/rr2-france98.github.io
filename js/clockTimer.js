'use strict';

const updateTimerUi = (hour, minute, updateHash=true) => {
    /*
    Updates the hour and minute and the url

    @param hour: hours left
    @param minute: minutes left
    */

    const inputs = [
        createTarget('time_hour', hour),
        createTarget('time_minute', minute),
        createTarget('time_slider', hour * 60 + +minute)
    ];

    for (const input of inputs) {
        document.querySelector(`#${input.id}`).value = input.value;
        update(input, updateHash);
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
            // Decrement the hour counter and reset minutes if needed
            if (!minute) {
                minute = 60;
                hour--;
            }
            minute--;

            // Call the callback
            if (callback && typeof callback === 'function') {
                callback(hour, minute);
            }
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
    // clear any running intervals before setting a new one
    clearInterval(clockIntervalId);
    clockIntervalId = setInterval(() => {
        if (interval < 0) {
            clearInterval(clockIntervalId);
            return;
        }
        setIcon(interval--);
    }, 5000);
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
        return resetTimer();
    }

    timer_running = true

    // One minute is 60000 milliseconds
    const MINUTE = 60000;

    const startHour = document.querySelector('#time_hour').value;
    const startMinute = document.querySelector('#time_minute').value;

    // Set the icon
    setIcon(0);
    updateEveryFiveSeconds();

    const clockHandler = (hour, minute) => {
        updateTimerUi(hour, minute);
        clearInterval(clockIntervalId);
        updateEveryFiveSeconds();
    };

    intervalId = setInterval(makeClockTimer(startHour, startMinute, clockHandler), MINUTE);
}
