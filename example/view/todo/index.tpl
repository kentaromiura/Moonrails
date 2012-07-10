<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Template � TodoMVC</title>
    <link rel="stylesheet" href="{base.css}">
    <!-- CSS overrides - remove if you don't need it -->
    <link rel="stylesheet" href="{app.css}">
    <!--[if IE]>
    <script src="{ie.js}"></script>
    <![endif]-->
</head>
<body>
<section id="todoapp">
    <header id="header">
        <h1>todos</h1>

        <form action="{action.add}">
            <input id="new-todo" name="todo" placeholder="What needs to be done?" autofocus>
        </form>
    </header>
    <!-- This section should be hidden by default and shown when there are todos -->
    <section id="main">
        <form action="{action.toggleAll}">
            <input id="toggle-all" type="submit" value="»" class="toggleall" />
            <label for="toggle-all">Mark all as complete</label>
        </form>
        <ul id="todo-list">

            <!-- These are here just to show the structure of the list items -->
            <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->

                   <li class="completed">
                       <div class="view">
                           <form action="toggle/0">
                            <input class="toggle checked" type="submit" value="✔" />
                           </form>
                           <label>Create a TodoMVC template</label>
                           <form action="clear/0">
                               <button class="destroy" type="submit" />
                           </form>
                       </div>
                       <input class="edit" value="Create a TodoMVC template">
                   </li>
                   <li>
                       <div class="view">
                           <form action="toggle/1">
                            <input class="toggle" type="submit" value="✔" />
                           </form>
                           <label>Rule the web</label>
                           <form action="clear/1">
                            <button class="destroy" type="submit" />
                           </form>
                       </div>
                       <input class="edit" value="Rule the web">
                   </li>

        </ul>
    </section>
    <!-- This footer should hidden by default and shown when there are todos -->
    <footer id="footer">
        <!-- This should be `0 items left` by default -->
        <span id="todo-count"><strong>1</strong> item left</span>
        <!-- Remove this if you don't implement routing -->
        <ul id="filters">
            <li>
                <a class="selected" href="#/">All</a>
            </li>
            <li>
                <a href="#/active">Active</a>
            </li>
            <li>
                <a href="#/completed">Completed</a>
            </li>
        </ul>
        <form action="{action.clearCompleted}">
            <button id="clear-completed" type="submit">Clear completed (1)</button>
        </form>
    </footer>
</section>
<footer id="info">
    <p>Double-click to edit a todo</p>

    <p>Template by <a href="http://github.com/sindresorhus">Sindre Sorhus</a></p>
    <!-- Change this out with your name and url ? -->
    <p>Created by <a href="http://github.com/kentaromiura">Cristian Carlesso (@kentaromiura)</a></p>

    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
<!-- Scripts here. Don't remove this ? -->
<script src="{base.js}"></script>
<script src="{app.js}"></script>
</body>
</html>