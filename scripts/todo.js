// document.addEventListener("DOMContentLoaded", function() {
    //*** variable declarations ***//
    //Local Variables
    let dragging, draggedOver;

    //Dom Variables
    const themeToggle = document.querySelector("#light-dark-toggle");
    const allTodos = document.querySelector("#all-todos");
    const todosLists = document.querySelectorAll(".todos-list");
    const newTodoInput = document.querySelector(".todo-new form");
    const remainingTodosCount = document.querySelector("#remainingTodos");
    const filterButtons = document.querySelectorAll(".todos-filter > .todos-filter-list > .todo-footer-button");
    const clearCompletedButton = document.querySelector("#clearCompleted");
    

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
            
            //update item count
            setItemCount();
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
    
    // clear completed button
    clearCompletedButton.addEventListener('click', clearCompleted);


    // RUN ON LOAD
    init();




    //*** methods ***//
    function init() {
        initTheme();
        setItemCount();
        initDraggableItems();
    }

    function initTheme() {
        //check whether the browser prefers dark mode        
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
        //guard - check for appropriate input
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

        //make the new todo draggable and droppable
        setDraggable(newTodo);
        setDroppable(newTodo);

        //update item count
        setItemCount();

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

    //clear completed todos
    function clearCompleted() {
        const todos = allTodos.querySelectorAll(".todo");
        for (todo of todos) {
            if(todo.classList.contains("todo-complete")) {
                //if active button is selected, simply delete the item
                if(filterButtons[1].classList.contains("selected")) {
                    todo.remove();

                // otherwise, fade the item out, then remove it
                } else {
                    //delete item after it has faded out
                    fadeOut(todo);
                }
            }
        }
    }

    function fadeOut(todo) {
        todo.addEventListener('transitionend', function() {
            this.remove();
        })
        todo.classList.add("fadeOut");
    }

    //refresh item count whenever items are added or removed
    function setItemCount() {
        const todos = allTodos.querySelectorAll(".todo:not(.todo-complete)");
        const numItemsLeft = todos.length;
        remainingTodosCount.innerText = numItemsLeft;
    }


    // *** Set Up Dragging Methods *** //
    function initDraggableItems() {
        const todos = allTodos.querySelectorAll(".todo");
        const placeholder = allTodos.querySelector(".placeholder");

        //make todos draggable and droppable
        for (todo of todos) {
            setDraggable(todo);
            setDroppable(todo);
        }
        //only make placeholder droppable
        setDroppable(placeholder);
    }

    function setDraggable(node) {
        node.draggable = true;
        node.addEventListener('dragstart', dragStart);
        node.addEventListener('dragend', dragEnd);
    }

    function setDroppable(node) {
        node.addEventListener('dragover', dragOver);
        node.addEventListener('drop', dropItem);
    }

    function dragStart(e) {
        console.log(e.target);
        dragging = e.target;
        dragging.classList.add('dragging');
    }

    function dragOver(e) {
        e.preventDefault();

        // if dragging is not defined, do nothing
        if (!dragging) return;

        //skip if this is a child element
        if (e.target.parentElement.id !== 'all-todos') return;

        draggedOver?.classList.remove("draggedOver");
        draggedOver = e.target;
        draggedOver.classList.add("draggedOver");
    }

    function dropItem(e) {
        // if dragging is not defined, do nothing
        if (!dragging) return;

        insertAfter(dragging, draggedOver);

        //dragEnd will fire next
    }

    //this fires when esc key is pressed, or after an item is dropped
    function dragEnd(e) {
        // if dragging is not defined, do nothing
        if (!dragging) return;

        dragging.classList.remove('dragging');
        draggedOver.classList.remove("draggedOver");
        dragging = undefined;
        draggedOver = undefined;
    }


    // *** General Methods *** //

    function insertBefore(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }


// })