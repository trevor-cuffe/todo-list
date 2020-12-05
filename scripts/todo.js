// document.addEventListener("DOMContentLoaded", function() {
    //*** variable declarations ***//
    const themeToggle = document.querySelector("#light-dark-toggle");
    const allTodos = document.querySelector("#all-todos");
    const todosLists = document.querySelectorAll(".todos-list");
    const newTodoInput = document.querySelector(".todo-new form");
    const filterButtons = document.querySelectorAll(".todos-filter > .todos-filter-list > .todo-footer-button");
    

    //*** event listeners ***//
    //Toggle Theme
    themeToggle.addEventListener('click', toggleTheme);

    //Checkbox on/off
    for (list of todosLists) {
        list.addEventListener('click', function(event) {
            let targetElement = event.target;
            let selector = 'todo-checkbox';
            if(targetElement.classList.contains(selector)) {
                const todo = targetElement.parentElement;
                todo.classList.toggle("todo-complete");
            }
        });
    }

    //New Todo Submit
    newTodoInput.addEventListener('submit', function(e) {
        //prevent default event response
        e.preventDefault();
        const todoElement = this.parentNode.parentNode;
        const todoTitleElement = this.querySelector(".todo-input");
        const completed = todoElement.classList.contains("todo-complete");
        const title = todoTitleElement.value;

        //create new todo
        const newTodo = createTodo(title, completed);

        //append new todo
        allTodos.appendChild(newTodo);

        //clear input form
        todoTitleElement.value = "";
        todoElement.classList.remove("todo-complete");

    });

    // filter buttons
    for(button of filterButtons) {
        button.addEventListener('click', function() {
            filterButtonPressed.call(this);
        });
    }


    // RUN ON LOAD
    init();




    //*** methods ***//
    function init() {
        initTheme();
    }

    function initTheme() {
        if(matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    // toggle light vs. dark
    function toggleTheme() {

        if (document.documentElement.getAttribute('data-theme') === 'light' ) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    function setTheme(input) {
        if (!['light','dark'].includes(input)) {
            console.error("invalid color theme for method setTheme");
            return;
        }

        document.documentElement.setAttribute('data-theme', input);

        if(input === 'light') {
            themeToggle.setAttribute('src', 'images/icon-moon.svg');
        } else {
            themeToggle.setAttribute('src', 'images/icon-sun.svg');
        }

    }

    // add new todo elements
    function createTodo(title, completed) {
        
        //create todo element
        let newTodo = document.createElement('li');
        newTodo.classList.add("todo");
        //set completion status
        if(completed) newTodo.classList.add("todo-complete");

        //create checkbox element
        let checkbox = document.createElement('button');
        console.dir(checkbox);
        checkbox.classList.add("todo-checkbox");
        checkbox.role = "checkbox";
        //add checkbox to todo
        newTodo.appendChild(checkbox);

        //create content element
        let todoContent = document.createElement('div');
        todoContent.classList.add("todo-content");
        //create title element
        let todoTitle = document.createElement('span');
        todoTitle.classList.add('todo-title');
        todoTitle.innerText = title;
        //add title to content
        todoContent.appendChild(todoTitle);
        //add content to todo
        newTodo.appendChild(todoContent);

        return newTodo;
    }

    // functionality for footer-buttons
    //should be called by a filter button
    function filterButtonPressed() {
        //set selected status/style to filter buttons
        for (button of filterButtons) {
            if (button === this) {
                button.classList.add("selected");
            } else if (button.classList.contains("selected")) {
                button.classList.remove("selected");
            }
        }

        //perform filter
        const filter = this.dataset.filter;
        filterTodos(filter);
    }

    //filter todos
    function filterTodos(filter) {
        if (!['all', 'complete', 'incomplete'].includes(filter)) return false;
        console.log(filter);


        const todos = allTodos.querySelectorAll(".todo");
        for (todo of todos) {
            if (filter === 'all') {
                todo.classList.remove("filter-hide");
            } else if (filter === 'complete') {
                if (todo.classList.contains("todo-complete")) {
                    todo.classList.remove("filter-hide");
                } else {
                    todo.classList.add("filter-hide");
                }
            } else {
                if (todo.classList.contains("todo-complete")) {
                    todo.classList.add("filter-hide");
                } else {
                    todo.classList.remove("filter-hide");
                }
            }
        }
        return true;

    }



// })