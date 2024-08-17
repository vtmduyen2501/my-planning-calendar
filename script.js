// Fetch calendar data from GitHub
const fetchCalendarData = async () => {
    const url = 'https://github.com/vtmduyen2501/my-planning-calendar/blob/main/calendar.json'; // Replace with your GitHub JSON URL
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch calendar data');
        }
        const data = await response.json();
        renderCalendar(data); // Call renderCalendar with fetched data
    } catch (error) {
        console.error('Error fetching calendar data:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.querySelector('.calendar');
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

    const renderCalendar = (data) => {
        calendarContainer.innerHTML = '';

        const table = document.createElement('table');
        calendarContainer.appendChild(table);

        const caption = document.createElement('caption');
        caption.textContent = `${months[currentMonth]}`;
        table.appendChild(caption);

        const headerRow = document.createElement('tr');
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        daysOfWeek.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        const daysInCurrentMonth = daysInMonth(currentMonth, year);
        let startDay = firstDayOfMonth(currentMonth, year) - 1;
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
                    dayDiv.dataset.date = `${year}-${currentMonth + 1}-${currentDay}`;
                    
                    const dayNumber = document.createElement('div');
                    dayNumber.classList.add('day-number');
                    dayNumber.textContent = currentDay;
                    dayDiv.appendChild(dayNumber);

                    const noteDiv = document.createElement('div');
                    noteDiv.classList.add('note');
                    dayDiv.appendChild(noteDiv);

                    // Retrieve data from fetched data (replace with actual data structure)
                    const dateKey = `${year}-${currentMonth + 1}-${currentDay}`;
                    const savedData = data[dateKey];
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

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveButton.addEventListener('click', () => {
        if (selectedDay) {
            const noteContent = noteInput.value.replace(/\n/g, '<br>');
            selectedDay.querySelector('.note').innerHTML = noteContent;
            
            const dateKey = selectedDay.dataset.date;
            const color = selectedDay.style.backgroundColor;
            const note = noteContent;

            // In a real application, you would save the data back to GitHub using API or manual push
            console.log(`Save data for ${dateKey}: Color - ${color}, Note - ${note}`);
        }
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    fetchCalendarData(); // Fetch calendar data when DOM is loaded

    // Function to handle color selection (to be integrated as per your requirement)
    const handleColorSelection = (color) => {
        if (selectedDay) {
            selectedDay.style.backgroundColor = color;
            const dateKey = selectedDay.dataset.date;
            // In a real application, you would save the data back to GitHub using API or manual push
            console.log(`Selected color for ${dateKey}: ${color}`);
        }
    };
});
