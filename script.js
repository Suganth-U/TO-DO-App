const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box"),
addBtn = document.getElementById('icon');

flatpickr("#dueDateTime", {
    enableTime: true,
    dateFormat: "d-m-Y H:i", 
});


let editId,
isEditTask = false,
todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let liTag = "";
    if(todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                        liTag += `<li class="task">
                                        <label for="${id}">
                                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                            <p class="${completed}">${todo.name}</p>
                                            <p class="due-datetime">${todo.dueDateTime}</p> <!-- Add this line for due datetime -->
                                        </label>
                                        <div class="settings">
                                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                            <ul class="task-menu">
                                                <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                                <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                            </ul>
                                        </div>
                                    </li>`;


            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    let dueDateTime = document.getElementById("dueDateTime").value;
    if(e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending", dueDateTime: dueDateTime };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
            todos[editId].dueDateTime = dueDateTime;
        }
        taskInput.value = "";
        document.getElementById("dueDateTime").value = ""; 
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});


    function addTasks() {
        let userTask = taskInput.value.trim();
        let dueDateTime = document.getElementById("dueDateTime").value;
        if (userTask && dueDateTime) {
            if (!isEditTask) {
                todos = !todos ? [] : todos;
                let taskInfo = { name: userTask, status: "pending", dueDateTime: dueDateTime };
                todos.push(taskInfo);
            } else {
                isEditTask = false;
                todos[editId].name = userTask;
                todos[editId].dueDateTime = dueDateTime;
            }
            taskInput.value = "";
            document.getElementById("dueDateTime").value = ""; 
            localStorage.setItem("todo-list", JSON.stringify(todos));
            showTodo(document.querySelector("span.active").id);
        }
    }
    
