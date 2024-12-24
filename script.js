// Show the task form
function showTaskForm() {
    document.getElementById('taskForm').style.display = 'block';
}

// Function to handle the "Enter" key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask();
    }
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {}; // Get tasks from localStorage

    for (const [month, taskList] of Object.entries(tasks)) {
        // Ensure the month section is created for each month that has tasks
        let monthSection = document.getElementById(`task-${month}`);
        if (!monthSection) {
            monthSection = document.createElement('div');
            monthSection.id = `task-${month}`;
            monthSection.className = 'month-task';
            monthSection.innerHTML = `<p class="task-title">${month} Tasks:</p><ul id="list-${month}"></ul>`;
            document.getElementById('taskContainer').appendChild(monthSection);
        }

        // Add each task to the DOM
        taskList.forEach((task) => {
            addTaskToDOM(month, task.text, task.completed); // Add task to the DOM
        });
    }
}

// Save tasks to localStorage
function saveTask(month, text, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (!tasks[month]) tasks[month] = [];
    tasks[month].push({ text, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the updated tasks to localStorage
}

// Remove a task from localStorage
function removeTaskFromStorage(month, text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (tasks[month]) {
        tasks[month] = tasks[month].filter((task) => task.text !== text); // Remove the task from the array
        if (tasks[month].length === 0) delete tasks[month]; // Remove the month if no tasks remain
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the updated tasks to localStorage
    }
}

// Update task status in localStorage
function updateTaskStatus(month, text, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (tasks[month]) {
        const task = tasks[month].find((task) => task.text === text);
        if (task) task.completed = completed; // Update the completed status of the task
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the updated tasks to localStorage
    }
}

// Add a task
function addTask() {
    const month = document.getElementById('monthSelect').value;
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();

    // Validate inputs
    if (!month) {
        alert('Please select a month.');
        return;
    }
    if (!task) {
        alert('Please enter a task.');
        return;
    }

    // Add the task to DOM
    addTaskToDOM(month, task, false);

    // Save the task in localStorage
    saveTask(month, task, false);

    // Clear the task input
    taskInput.value = '';
}

// Add task to DOM
function addTaskToDOM(month, text, completed) {
    // Get or create the month task section
    let monthSection = document.getElementById(`task-${month}`);
    if (!monthSection) {
        monthSection = document.createElement('div');
        monthSection.id = `task-${month}`;
        monthSection.className = 'month-task';
        monthSection.innerHTML = `<p class="task-title">${month} Tasks:</p><ul id="list-${month}"></ul>`;
        document.getElementById('taskContainer').appendChild(monthSection);
    }

    // Add the task as an <li> to the appropriate list
    const taskList = document.getElementById(`list-${month}`);
    
    const listItem = document.createElement('li');
    listItem.className = 'listItemm';
  

    // Add task text
    const taskText = document.createElement('span');
    taskText.textContent = text;
    taskText.style.textDecoration = completed ? 'line-through' : 'none';
    listItem.appendChild(taskText);

    // Add the "tick" button
    const tickButton = document.createElement('button');
    tickButton.textContent = '✔';
    tickButton.className = 'tick-button';

    tickButton.onclick = () => {
        const isCompleted = listItem.style.textDecoration !== 'line-through';
        listItem.style.textDecoration = isCompleted ? 'line-through' : 'none';
        updateTaskStatus(month, text, isCompleted);

        // Check if all tasks for this month are completed
        const remainingTasks = taskList.querySelectorAll('li');
        const allCompleted = Array.from(remainingTasks).every(
            (task) => task.style.textDecoration === 'line-through'
        );

        if (allCompleted) {
            // Display congratulations message with Hurray animation
            showCongratsMessage(month);
        }
    };
    listItem.appendChild(tickButton);

    // Add the "wrong" button
    const wrongButton = document.createElement('button');
    wrongButton.textContent = '✘';
    wrongButton.className = 'wrong-button';
    wrongButton.onclick = () => {
        taskList.removeChild(listItem); // Remove the task from the DOM
        removeTaskFromStorage(month, text); // Remove the task from localStorage

        // Check if the month container still has tasks after deletion
        const remainingTasks = taskList.querySelectorAll('li');
        if (remainingTasks.length === 0) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
            if (!tasks[month] || tasks[month].length === 0) {
                const monthSection = document.getElementById(`task-${month}`);
                if (monthSection) monthSection.remove(); // Remove the month section
            }
        }
    };
    listItem.appendChild(wrongButton);

    // Append the list item to the task list
    taskList.appendChild(listItem);
}

// Function to show congratulations message and remove the task container
function showCongratsMessage(month) {
    // Create the congratulatory message
    const congratsMessage = document.createElement('div');
    congratsMessage.className = 'congrats-message';
    congratsMessage.innerHTML = `🎉 Congratulations! You completed all tasks for <span class="hurray">${month}</span>! 🎉`;

    // Append the message to the body
    document.body.appendChild(congratsMessage);

    // Remove the message after 3 seconds
    setTimeout(() => congratsMessage.remove(), 3000);

    // Remove the month's task container
    const monthSection = document.getElementById(`task-${month}`);
    if (monthSection) {
        setTimeout(() => monthSection.remove(), 3000); // Remove it after the message disappears
    }

    // Clear all tasks from localStorage after the congratulations message
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (tasks[month]) {
        delete tasks[month]; // Remove the tasks for the completed month
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the updated tasks to localStorage
    }
}

// Load tasks when the page is loaded
document.addEventListener('DOMContentLoaded', loadTasks);
