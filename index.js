function onPress() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    if (title != "" && description != "") {
        document.getElementById("title").value = ""
        document.getElementById("description").value = ""
        fetch('http://localhost:3000/todos', {
            method: "POST",
            body: JSON.stringify({
                title: title,
                completed: false,
                description: description
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            getTodos().then(displayTodos);;
        })

    } else {
        alert("Enter a TewDew to submit!")
    }

}
async function getTodos() {

    let response = await fetch('http://localhost:3000/todos', {
        method: "GET"
    })
    let todos = await response.json();
    return todos;
}
async function getTodoByID(id) {
    let url = 'http://localhost:3000/todos/' + id;
    let response = await fetch(url, {
        method: "GET"
    });
    let todoItem = await response.json();
    return todoItem;
}

function deleteTodo(id) {
    let url = 'http://localhost:3000/todos/' + id;
    fetch(url, {
        method: "DELETE"
    }).then(response => {
        getTodos().then(displayTodos);
    })
}

function putComplete(id) {
    let url = 'http://localhost:3000/todos/' + id;
    let todoDiv = document.getElementById(id);
    getTodoByID(id).then(todo => {
        if (!todo.completed) {
            todo.completed = true;
        } else {
            todo.completed = false;
        }
        fetch(url, {
            method: "PUT",
            body: JSON.stringify({
                title: todo.title,
                completed: todo.completed,
                description: todo.description
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            getTodos().then(displayTodos);
        })
    })
}
const displayTodos = todos => {
    let parentElement = document.getElementById("todoList")
    parentElement.innerHTML = ""
    todos.forEach(todo => {
        let titleText = todo.title;
        let descriptionText = todo.description;
        let todoItem = document.createElement("div");
        todoItem.id = todo.id;
        todoItem.classList.add("card")
        let todoTitle = document.createElement("h2");
        let todoDescription = document.createElement("p");
        let btnDiv = document.createElement("div");
        btnDiv.classList.add("btn-container");
        let completeButton = document.createElement("button");
        if (todo.completed) {
            completeButton.innerHTML = "Not complete"
            todoItem.classList.add("complete")
        } else {
            completeButton.innerHTML = "Mark complete"
        }
        completeButton.setAttribute("onclick", "putComplete(" + todo.id + ")");
        completeButton.classList.add("btn");
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete"
        deleteButton.setAttribute("onclick", "deleteTodo(" + todo.id + ")");
        deleteButton.classList.add("btn");
        todoTitle.innerText = titleText;
        todoDescription.innerText = descriptionText;
        btnDiv.append(completeButton);
        btnDiv.append(deleteButton);
        todoItem.append(todoTitle);
        todoItem.append(todoDescription);
        todoItem.append(btnDiv);
        parentElement.append(todoItem);
    })
}
getTodos().then(displayTodos);