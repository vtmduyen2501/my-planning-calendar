document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.querySelector('.calendar');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const noteInput = document.getElementById('noteInput');
    const saveButton = document.getElementById('saveButton');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let currentMonth = 0;
    let selectedDay;

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
    const year = 2024;

    const renderCalendar = (month) => {
        calendarContainer.innerHTML = '';

        const table = document.createElement('table');
        calendarContainer.appendChild(table);

        const caption = document.createElement('caption');
        caption.textContent = `${months[month]}`;
        table.appendChild(caption);

        const headerRow = document.createElement('tr');
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        daysOfWeek.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        const daysInCurrentMonth = daysInMonth(month, year);
        let startDay = firstDayOfMonth(month, year) - 1;
        if (startDay < 0) startDay = 6;  // Adjust if the month starts on Sunday

        let currentDay = 1;
        for (let i = 0; i < 6; i++) { // 6 rows to cover all possible days
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if ((i === 0 && j < startDay) || currentDay > daysInCurrentMonth) {
                    cell.textContent = '';
                } else {
                    const dayDiv = document.createElement('div');
                    dayDiv.classList.add('day');
                    dayDiv.dataset.date = `${year}-${month + 1}-${currentDay}`;
                    
                    const dayNumber = document.createElement('div');
                    dayNumber.classList.add('day-number');
                    dayNumber.textContent = currentDay;
                    dayDiv.appendChild(dayNumber);

                    const noteDiv = document.createElement('div');
                    noteDiv.classList.add('note');
                    dayDiv.appendChild(noteDiv);

                    const savedData = JSON.parse(localStorage.getItem(`${year}-${month + 1}-${currentDay}`));
                    if (savedData) {
                        if (savedData.color) {
                            dayDiv.style.backgroundColor = savedData.color;
                        }
                        if (savedData.note) {
                            noteDiv.innerHTML = savedData.note;
                        }
                    }
                    
                    cell.appendChild(dayDiv);
                    currentDay++;
                }
                cell.addEventListener('click', () => {
                    selectedDay = cell.querySelector('.day');
                    noteInput.value = selectedDay.querySelector('.note').innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
                    modal.style.display = 'block';
                });
                row.appendChild(cell);
            }
            table.appendChild(row);
            if (currentDay > daysInCurrentMonth) break;
        }
    };

    prevButton.addEventListener('click', () => {
        if (currentMonth > 0) {
            currentMonth--;
            renderCalendar(currentMonth);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentMonth < 11) {
            currentMonth++;
            renderCalendar(currentMonth);
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveButton.addEventListener('click', () => {
        if (selectedDay) {
            const noteContent = noteInput.value.replace(/\n/g, '<br>');
            selectedDay.querySelector('.note').innerHTML = noteContent;
            
            const date = selectedDay.dataset.date;
            const color = selectedDay.style.backgroundColor;
            const note = noteContent;

            localStorage.setItem(date, JSON.stringify({ color, note }));
        }
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', (event) => {
            if (selectedDay) {
                selectedDay.style.backgroundColor = getLightColor(event.target.classList[1]);
                
                const date = selectedDay.dataset.date;
                const color = getLightColor(event.target.classList[1]);
                const note = selectedDay.querySelector('.note').innerHTML;

                localStorage.setItem(date, JSON.stringify({ color, note }));
            }
        });
    });

    const getLightColor = (color) => {
        switch (color) {
            case 'green':
                return 'lightgreen';
            case 'yellow':
                return 'lightyellow';
            case 'red':
                return 'lightcoral';
            default:
                return color;
        }
    };

    renderCalendar(currentMonth);
});
