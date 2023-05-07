const state = {
  todos: [],
};

const todoInput = document.getElementById("text__input");
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
    newLi.todoObj = todo;

    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    // newCheckbox = document.createAttribute("id", "todo.id");
    newCheckbox.checked = todo.done;
    newCheckbox.setAttribute("id", todo.id);

    //----------------------------------------------------------------//

    newCheckbox.addEventListener("change", () => updateTodo(todo));

    //-----------------------------------------------------------------//

    // newLabel = document.createAttribute("id", "todo__li");
    const newLabel = document.createElement("label");
    const todoTxt = document.createTextNode(todo.description);
    newLabel.setAttribute("for", todo.id);

    newLabel.appendChild(todoTxt);

    newLi.append(newCheckbox, newLabel);
    todoList.appendChild(newLi);
  });
}
//==================================================================================//
//============================Add Button=========================================//
addBtn.addEventListener("click", () => {
  event.preventDefault();

  if (
    state.todos.some(
      (todo) => todo.description.toLowerCase() === todoInput.value.toLowerCase()
    )
  ) {
    window.alert("todo existiert bereits");
  } else {
    const newTodoTxt = todoInput.value;
    const newTodo = {
      description: newTodoTxt.trim(),
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
  }
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
//===========================Radios=Filter===============================//

const radiosFilterForm = document.getElementById("radio__btn");

radiosFilterForm.addEventListener("change", (event) => {
  const radioValue = event.target;
  //   console.log(radioValue);
  state.filter = radioValue.id;
  // updateTodo();
  filterTodos(radioValue.id);
});

function filterTodos(filterSelect) {
  const listArr = todoList.childNodes;
  listArr.forEach((listItem) => {
    const checkStatus = listItem.todoObj.done;
    switch (filterSelect) {
      case "all":
        listItem.removeAttribute("hidden", "");
        break;
      case "open":
        checkStatus
          ? listItem.setAttribute("hidden", "")
          : listItem.removeAttribute("hidden", "");
        break;
      case "done":
        !checkStatus
          ? listItem.setAttribute("hidden", "")
          : listItem.removeAttribute("hidden", "");
        break;
    }
  });
}
