const form = document.querySelector("form");
const input = document.querySelector("#txtTaskName");
const btnDeleteAll = document.querySelector("#btnDeleteAll");
const taskList = document.querySelector("#task-list");
let todos;

loadItems();
eventListeners();

function eventListeners() {
    form.addEventListener("submit", addNewItem);
    taskList.addEventListener("click", deleteItem);
    btnDeleteAll.addEventListener("click", deleteAll);
}

function loadItems() {
    todos = getItemsFromLS();
    todos.forEach(function (item) {
        createItem(item);
    });
}

function getItemsFromLS() {
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function setItemToLS(text) {
    todos = getItemsFromLS();
    todos.push({ text: text, completed: false });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTaskStatusInLS(taskText, isCompleted) {
    let todos = getItemsFromLS();
    todos.forEach(function (todo) {
        if (todo.text === taskText) {
            todo.completed = isCompleted;
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function createItem(task) {
    if (typeof task === "string") {
        task = { text: task, completed: false };
    }

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "mr-2";
    checkbox.checked = task.completed;

    if (task.completed) {
        li.classList.add("completed");
    }

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            li.classList.add("completed");
        } else {
            li.classList.remove("completed");
        }
        updateTaskStatusInLS(task.text, checkbox.checked);
    });

    const taskText = document.createTextNode(task.text);
    const a = document.createElement("a");
    a.classList = "delete-item float-right";
    a.setAttribute("href", "#");
    a.innerHTML = '<i class="fas fa-times"></i>';

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(a);
    taskList.appendChild(li);
}

function addNewItem(e) {
    e.preventDefault();
    if (input.value.trim() === "") {
        alert("Add new item");
        return;
    }

    createItem(input.value);
    setItemToLS(input.value);
    input.value = "";
}

function deleteItem(e) {
    if (e.target.className === "fas fa-times") {
        if (confirm("Are you sure?")) {
            e.target.parentElement.parentElement.remove();
            deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        }
    }
}

function deleteTodoFromStorage(deletetodo) {
    let todos = getItemsFromLS();
    todos.forEach(function (todo, index) {
        if (todo.text === deletetodo.trim()) {
            todos.splice(index, 1);
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteAll(e) {
    if (confirm("Are you sure to delete all tasks?")) {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        localStorage.clear();
    }
}
