var apiKey = "8cab48e15607c91caeeaa01a8942b7446b96ce55c222228dd5bba17de163702f";

// Load existing ToDos
var listRequest = new XMLHttpRequest();
listRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var todos = JSON.parse(this.responseText);
        console.log(todos);
        // display ToDos on page
        for (var index = 0; index < todos.length; index++) {
            renderTodo(todos[index]);
        }
    } else if (this.readyState == 4) {
        console.log(this.responseText);
    }
}
listRequest.open("GET", "https://api.kraigh.net/todos", true);
listRequest.setRequestHeader("x-api-key", apiKey);
listRequest.send();

// Handle new Todo form submit
document.getElementById("new-todo-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Submit ToDo to API
    var data = {
        text: newTitle.value
    }

    var createRequest = new XMLHttpRequest();
    createRequest.onreadystatechange = function() {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            // parse JSON response
            renderTodo(JSON.parse(this.responseText));
        } else if (this.readyState == 4) {
            // this.status !== 200, error from server
            console.log(this.responseText);
        }
    };
    createRequest.open("POST", "https://api.kraigh.net/todos", true);
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.setRequestHeader("x-api-key", apiKey);
    createRequest.send(JSON.stringify(data));
});

function renderTodo(todoData) {
    // create new Todo container
    var todo = document.createElement("article");
    // add id of todo as id of container
    todo.setAttribute("id", todoData.id);
    todo.classList.add("todo");
    if (todoData.completed) {
        todo.classList.add("completed");
    }

    // create complete button
    var completeButton = document.createElement("button");
    completeButton.classList.add("check");
    todo.appendChild(completeButton);

    // add todo text
    var todoText = document.createElement("p");
    todoText.innerText = todoData.text;
    todo.appendChild(todoText)
    // create delete button

    var deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerText = '-';
    todo.appendChild(deleteButton);

    document.getElementById("todos").appendChild(todo);

    completeButton.addEventListener("click", completeTodo);
    deleteButton.addEventListener("click", deleteTodo);

    document.getElementById("newTitle").value = '';
}

function completeTodo(event) {
    // Handle Todo completion
    // API call, PUT to set completed to true
    var todoId = event.target.parentNode.id;
    var data = {
        completed: true
    };
    var completeRequest = new XMLHttpRequest();
    completeRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            event.target.parentNode.classList.add("completed");
        } else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    }
    completeRequest.open("PUT", "https://api.kraigh.net/todos/" + todoId, true);
    completeRequest.setRequestHeader("Content-type", "application/json");
    completeRequest.setRequestHeader("x-api-key", apiKey);
    completeRequest.send(JSON.stringify(data));

}

function deleteTodo(event) {
    // Hanlde Todo deletion
    var todoId = event.target.parentNode.id;
    // API call, DELETE to remove
    var deleteRequest = new XMLHttpRequest();
    deleteRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // event.target.parentNode.remove();
            document.getElementById("todos").removeChild(event.target.parentNode);
        } else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    }
    deleteRequest.open("DELETE", "https://api.kraigh.net/todos/" + todoId, true);
    deleteRequest.setRequestHeader("Content-type", "application/json");
    deleteRequest.setRequestHeader("x-api-key", apiKey);
    deleteRequest.send();
    // remove from page

}




