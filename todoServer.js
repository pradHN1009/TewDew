const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");
const port = 3000;

const app = express();

let todosList = [];

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/todos", (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) {
            console.log("error while reading Todos")
            res.status(404).send();
        } else {
            let todos = JSON.parse(data)
            res.send(todos);
        }
    })
})

app.get("/todos/:id", (req, res) => {
    let getId = req.params.id;
    let found = 0;
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) {
            console.log("Error while reading Todos")
            res.status(404).send();
        } else {
            let todos = JSON.parse(data)
            todos.forEach((todo) => {
                if (getId.toString() == todo.id) {
                    res.status(200).send(todo);
                    found = 1;
                }
            })
            if (!found) {
                res.status(404).send("Error 404 : Requested Todo not found");
            }
        }
    })

})

app.post("/todos", (req, res) => {
    let todoBody = req.body;
    let uniqueId = new Date().getTime().toString();
    let todoObj = {
        id: uniqueId,
        title: todoBody.title,
        completed: todoBody.completed,
        description: todoBody.description
    }
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) {
            console.log("Error while reading Todos")
            res.status(404).send();
        } else {
            let todos = JSON.parse(data);
            todos.push(todoObj);
            fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                if (err) {
                    console.log("error writing to file");
                    res.status(401).send();
                } else {
                    res.status(201).send(JSON.stringify(todos))
                }
            })
        }
    })
})


app.put("/todos/:id", (req, res) => {
    let getId = req.params.id;
    let todoBody = req.body;
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) {
            console.log("Error while reading Todos")
            res.status(404).send();
        } else {
            let todos = JSON.parse(data);
            const index = todos.findIndex(todo => todo.id === getId)
            if (index === -1) {
                res.status(404).send("Error 404 : Requested Todo not found");
            } else {
                Object.assign(todos[index], todoBody);
                fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                    if (err) {
                        console.log("error writing to file");
                        res.status(401).send();
                    } else {
                        res.status(200).send("Succesfully Updated!")
                    }
                })

            }
        }
    })

})

app.delete("/todos/:id", (req, res) => {
    let getId = req.params.id;
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) {
            console.log("Error while reading Todos")
            res.status(404).send();
        } else {
            let todos = JSON.parse(data);
            const index = todos.findIndex(todo => todo.id === getId)
            if (index == -1) {
                res.status(404).send("Error 404 : Requested todo not found");
            } else {
                todos.splice(index, 1);
                fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                    if (err) {
                        console.log("error writing to file");
                        res.status(401).send();
                    } else {
                        res.status(200).send("Succesfully Deleted!")
                    }
                })
            }
        }
    })
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("*", (req, res) => {
    res.status(404).send("Error : Route not available")
})
app.listen(port, () => { console.log("Listening on port 3000") });

module.exports = app;