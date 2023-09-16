const input = document.querySelector("input");
const btn = document.querySelector("button");
const todoItems = document.querySelector("ul");
const select = document.querySelector(".todo__options");

let arrOfTaskObjects =
  localStorage.getItem("arrOfTaskObjects") !== null
    ? JSON.parse(localStorage.getItem("arrOfTaskObjects"))
    : [];

let tasksId =
  localStorage.getItem("id") !== null ? +localStorage.getItem("id") : 0;

const renderTasks = (arrOfTaskObjects) => {
  todoItems.innerHTML = "";

  for (let taskObject of arrOfTaskObjects) {
    const task = document.createElement("li");
    task.classList.add(
      "todo__item",
      taskObject.completed ? "completed" : "active"
    );
    todoItems.append(task);
    const taskText = document.createElement("span");
    taskText.classList.add("todo__task");
    task.append(taskText);
    taskText.innerText = taskObject.value;
    task.dataset.id = taskObject.id;
    task.innerHTML += `
      <div class="todo__date">${taskObject.date}</div>
      <span class="todo__action todo__action_complete"></span>`;
    const deleteBtn = document.createElement("span");
    deleteBtn.classList.add("todo__action", "todo__action_delete");
    task.append(deleteBtn);
  }
};

const createNewTask = (event) => {
  event.preventDefault();

  select.value = "all";

  if (input.value.trim() !== "") {
    const taskObject = {
      value: input.value,
      date: new Date().toLocaleString().slice(0, -3),
      completed: false,
      id: tasksId,
    };

    arrOfTaskObjects.push(taskObject);
    renderTasks(arrOfTaskObjects);
    tasksId++;
    input.value = "";

    localStorage.setItem("id", tasksId);
    localStorage.setItem("arrOfTaskObjects", JSON.stringify(arrOfTaskObjects));
  }
};

btn.addEventListener("click", createNewTask);

const deleteTask = (task) => {
  arrOfTaskObjects = arrOfTaskObjects.filter(
    (taskObj) => taskObj.id !== +task.dataset.id
  );
  renderTasks(arrOfTaskObjects);
  localStorage.setItem("arrOfTaskObjects", JSON.stringify(arrOfTaskObjects));
};

const completeTask = (task) => {
  arrOfTaskObjects = arrOfTaskObjects.map((taskObject) =>
    taskObject.id === +task.dataset.id
      ? {
          value: taskObject.value,
          date: taskObject.date,
          completed: !taskObject.completed,
          id: taskObject.id,
        }
      : taskObject
  );
  renderTasks(arrOfTaskObjects);
  localStorage.setItem("arrOfTaskObjects", JSON.stringify(arrOfTaskObjects));
};

todoItems.addEventListener("click", (event) => {
  if (event.target.classList.contains("todo__action_delete")) {
    deleteTask(event.target.parentNode);
  }

  if (event.target.classList.contains("todo__action_complete")) {
    completeTask(event.target.parentNode);
  }
});

const filterActiveTasks = (arr) => {
  let arrOfActiveTasks = [];
  arrOfActiveTasks = arr.filter((task) => !task.completed);
  return arrOfActiveTasks;
};

const filterCompletedTasks = (arr) => {
  let arrOfCompletedTasks = [];
  arrOfCompletedTasks = arr.filter((task) => task.completed);
  return arrOfCompletedTasks;
};

select.addEventListener("click", (event) => {
  if (event.target.value === "all") {
    renderTasks(arrOfTaskObjects);
  } else if (event.target.value === "active") {
    renderTasks(filterActiveTasks(arrOfTaskObjects));
  } else if (event.target.value === "completed") {
    renderTasks(filterCompletedTasks(arrOfTaskObjects));
  }
});

renderTasks(arrOfTaskObjects);
