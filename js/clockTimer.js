const updateTimerUi = (hour, minute) => {
    /*
    Updates the hour and minute and the url

    @param hour: hours left
    @param minute: minutes left
    */

    inputs = [
        {'target': {'id': 'time_hour', 'value': hour}},
        {'target': {'id': 'time_minute', 'value': minute}}
    ];

    for (input of inputs) {
        const target = input.target;
        document.querySelector(`#${target.id}`).value = target.value;
        update(input);
    }
};

const setIcon = (hour) => {
    /*
    Sets the timer icon on an element with the id "timer"

    @param hour: hours left
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

const updateEveryMinute = () => {
    /*
    Event handler to count down and update the UI every minute.
    */

    // Disable button
    document.querySelector('#timer').disabled = true;
    // Enable button after 200ms
    setTimeout(() => document.querySelector('#timer').disabled = false, 200);

    if (timer_running) {
        timer_running = false;
        clearInterval(intervalId);
        setIcon(null);
        return;
    }

    timer_running = true

    // One minute is 60000 milliseconds
    const MINUTE = 60000;

    const startHour =  document.querySelector('#time_hour').value;
    const startMinute = document.querySelector('#time_minute').value;

    // Set the icon
    setIcon(startHour);

    const clockHandler = (hour, minute) => {
        updateTimerUi(hour, minute);
        setIcon(hour);
    };

    intervalId = setInterval(makeClockTimer(startHour, startMinute, clockHandler), MINUTE);
}
