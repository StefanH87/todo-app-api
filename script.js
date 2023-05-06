const state = {
  todos: [],
};

const todoInput = document.querySelector("#text__input");
const addBtn = document.querySelector(".add__btn");
const deleteBtn = document.getElementById("remove__btn");

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((todosFromApi) => {
      state.todos = todosFromApi;
      renderHTML();
    });
}

loadTodos();

function updateTodo(todoData) {
  fetch("http://localhost:4730/todos/" + todoData.id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      description: todoData.description,
      done: !todoData.done, //negitiert Zustand der Checkbox
    }),
  })
    .then((response) => response.json())
    .then((updatedTodoFromApi) => {
      todoData.done = updatedTodoFromApi.done;
      renderHTML();
      // console.log(updatedTodoFromApi);
    });
}
//==================================================================================//
//============================Render=========================================//

const todoList = document.querySelector(".todo__list");

function renderHTML() {
  todoList.innerHTML = "";

  state.todos.forEach((todo) => {
    const newLi = document.createElement("li");

    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    // newCheckbox = document.createAttribute("id", "todo.id");
    newCheckbox.checked = todo.done;

    //----------------------------------------------------------------//

    newCheckbox.addEventListener("change", () => updateTodo(todo));

    //-----------------------------------------------------------------//

    // newLabel = document.createAttribute("id", "todo__li");
    const newLabel = document.createElement("label");
    const todoTxt = document.createTextNode(todo.description);
    newLabel.appendChild(todoTxt);

    newLi.append(newCheckbox, newLabel);
    todoList.appendChild(newLi);
  });
}
//==================================================================================//
//============================Add Button=========================================//
addBtn.addEventListener("click", () => {
  event.preventDefault();
  const newTodoTxt = todoInput.value;
  const newTodo = {
    description: newTodoTxt,
    done: false,
    // id: "",
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then((newTodoFromApi) => {
      state.todos.push(newTodoFromApi);
      renderHTML();
      console.log(newTodoFromApi.id);
    });
});
//==================================================================================//
//============================Delete Button=========================================//
function deleteTodos() {
  event.preventDefault();
  const doneTodos = state.todos.filter((todo) => todo.done === true);
  const fetchDeleteCalls = [];
  for (let doneTodo of doneTodos) {
    fetchDeleteCalls.push(
      fetch("http://localhost:4730/todos/" + doneTodo.id, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      })
    );
  }
  Promise.all(fetchDeleteCalls).then(() => {
    state.todos = state.todos.filter((todo) => todo.done === false);
    renderHTML();
  });
}

deleteBtn.addEventListener("click", deleteTodos);

//=======================================================================//
//===========================Radios================================//

const radiosFilterForm = document.getElementById("radio__btn");

radiosFilterForm.addEventListener("change", (event) => {
  const radioValue = event.target.id;
  //   console.log(radioValue);
  switch (radioValue) {
    case "all":
      console.log("all");
      break;
    case "open":
      //   renderHtml(state.todos.filter((todo) => todo.done === false));
      console.log("open");
      break;
    case "done":
      //   renderHtml(state.todos.filter((todo) => todo.done === true));
      console.log("done");
      break;
    default:
      return;
  }
});
