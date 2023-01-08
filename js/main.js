const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}



checkEmptyList();

form.addEventListener('submit', addTask)

tasksList.addEventListener('click', deleteTask);

tasksList.addEventListener('click', editTask);

tasksList.addEventListener('click', doneTask);

// Функции

function addTask(event) {
     // Отменяем отправку формы
     event.preventDefault();
    

     // Получаем значение из поля ввода
     const taskText = taskInput.value;


     const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
     }

     tasks.push(newTask);

     saveToLocalStorage();
    

     renderTask(newTask);
 
 
     // Очищаем поле ввода
 
     taskInput.value = "";
     taskInput.focus();
 
 
     // Удаляем надпись "Список дел пуст"
     checkEmptyList();

     
     
}



// Функция для удаления задачи

function deleteTask(event) {



    if(event.target.dataset.action !== "delete") return;
    
        const parentNode = event.target.closest(".list-group-item");

        const id = parentNode.id;

        // const index = tasks.findIndex((task) => task.id == id);

        // tasks.splice(index, 1);

        // Удаление задачи через фильтрацию массива

        tasks = tasks.filter((task) => task.id != id);

        saveToLocalStorage();

        parentNode.remove();

        checkEmptyList();
        
}


// Функция редактирования задачи

function editTask(event) {
    if(event.target.dataset.action !== "edit") return;

    const parentNode = event.target.closest(".list-group-item");
    const taskTitle = parentNode.querySelector(".task-title");
    const taskTitleText = taskTitle.textContent;
    const id = parentNode.id;

    const task = tasks.find((task) => task.id == id);
    const index = tasks.indexOf(task);
    

    const editInputHTML = `<input type="text" class="form-control" id="taskInputEdit" value="${task.text}" required> <span id="confim-edit" class="confim-edit" data-action="edit-ok">ОК</span>`;
    taskTitle.innerHTML = editInputHTML;

    parentNode.addEventListener('click', (event) => {
        if(event.target.dataset.action !== "edit-ok") return;
        const editInput = document.querySelector("#taskInputEdit");
        taskTitle.innerHTML = editInput.value;
        tasks[index].text = editInput.value;
        saveToLocalStorage();
    })

}


// Функция для завершенной задачи

function doneTask(event) {

    if(event.target.dataset.action !== "done") return;

    const parentNode = event.target.closest(".list-group-item");

    const id = parentNode.id;
    const task = tasks.find((task) => task.id == id);

    task.done = !task.done;

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");

    }


// Проверка наличия задач в массиве

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>
        `;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } 
    if(tasks.length > 0) {
        const emptyListEl = document.querySelector("#emptyList");
        emptyListEl ? emptyListEl.remove() : null; 
    }
}

// Сохраняем данные в Local storage

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}




function renderTask(task){
    // Формируем class

    const cssClass = task.done ? "task-title task-title--done" : "task-title";
 
    // HTML разметка

    const taskHTML= `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="done" width="18" height="18">
                        </button>
                        <button type="button" data-action="edit" class="btn-action">
                            <img src="./img/edit.png" alt="edit" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="delete" width="18" height="18">
                        </button>
                        
                    </div>
                </li>
    `;

    // Добавляем задачу на страницу
 
    tasksList.insertAdjacentHTML('beforeend', taskHTML);

}