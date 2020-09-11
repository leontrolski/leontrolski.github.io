import { page, inline, python, js, bash, html, css } from "./base.dn.js"

const py = inline("Python")
const js_ = inline("JS")
const dnjs = inline("dnjs")
const backend = inline("backend")
const classic = inline("classic")
const declarative = inline("declarative")
const file = (path) => m("a", {href: `https://github.com/leontrolski/dnjs/tree/master/${path}`}, inline(path))

export const filename = "semi-isomorphic.html"
const title = "semi-isomorphic apps"
const h1 = ["Evolving backend → frontend rendered ", py, "/", js_, " apps with ", dnjs]

const video = (src) => m("video", {
    src: src,
    controls: true,
    style: `
        margin: auto;
        display: block;
        max-width: calc(min(20em, 100%));
        box-shadow: 0px 0px 6px 2px #0000002b;
        margin-top: 2em;
        margin-bottom: 2em;
    `,
})

export default page(title, h1, [
    m("p", "With very little ceremony  or surprise, ", m("a", {href: "https://github.com/leontrolski/dnjs#dnjs"}, "dnjs"), " lets you ", m("b", "specify configuration"), ", generate ", m("b", "static html/css"), ", and ", m("b", "render html on the backend/frontend"), " across languages. ", m("a", {href: "https://github.com/leontrolski/leontrolski.github.io/tree/master/src/semi-isomorphic.dn.js"}, "This page") , " is even written with it. ", m("em", "A word of warning: the project is still in its development stages.")),


    m("h2", "What's the problem?"),
    m("p", "In most worlds, when you're building a web app, there is a very clear divide between:"),
    m("ol",
        m("li", `"Let's build a backend-rendered page in `, py, "/", js_, "/... rendering the html with some funky templating language. We can sprinkle in some ad-hoc ", js_, ` as we get there."`),
        m("li", `"Let's build a fully frontend-rendered app with `, inline("React"), "/", inline("Vue"), `/..."`),
    ),
    m("p", "A lot of the time, teams plump for option 2, even when the user experience might be worse (slow loading times, lack of hyperlinking, etc), and the developer experience might be worse (lots of client state, hard to test, etc)."),
    m("p", dnjs, " takes the following positions:"),
    m("ul",
        m("li", "Most backend templating languages are clunky, often difficult to compose and missing tooling (eg. linters) available for fully-fledged languages."),
        m("li", "There is a UI-complexity threshold at which one might choose to make part of the app frontend-rendered, this is OK."),
        m("li", "The default ways of constructing DOM nodes in the browser are ", m("a", {href: "dom-syntax.html"}, "inelegant"), "."),
        m("li", "Build chains and compile steps may eventually become necessary, but we'll start with browser-compatible code."),
    ),
    m("p", "It attempts to resolve these with a ", m("a", {href: "https://github.com/leontrolski/dnjs#how-exactly-does-dnjs-extend-json"},  "pure subset of ", js_), " that is ", m("b", "reasonable to implement in host languages"), " and ", m("b", "has a standardised way of describing DOM nodes"), ". Being able to share things across the backend and the frontend means we can evolve our app over time. We can start with simple html forms, then progress to frontend-rendering as the complexity requires - ", m("em", "while reusing previously written components"),  "."),
    m("p", "Let's walk through an example where we span this transition."),


    m("h2", "An example app"),
    m("p", "In this post, we will build the following simple web app, where we can add todos and check them if they're done. The data will be persisted on the backend:"),
    video("videos/basic.webm"),


    m("h2", "The 3 ways we will build it are:"),
    m("ul",
        m("li", "Using just backend rendering and ", inline("<form>"), " elements à la 1995. This we'll refer to as ", backend, "."),
        m("li", "Using a sprinkling of imperative", js_, " to dynamically add the new comment without reloading the page. This we'll refer to as ", classic, "."),
        m("li", "Rendering the entire comment list with a", js_, " library (in this case ", m("a", {href: "https://mithril.js.org/"}, "mithril"), "). This we'll refer to as ", declarative, " because we specify the DOM as a pure function of state."),
    ),
    m("h2", "Aside: running the examples"),
    m("p", "The source for the above can be found in the ", file("examples/todo"), " directory of the ", dnjs, " repo. It has the following structure:"),
    bash(`
        ├── app.py
        ├── shared
        │   ├── components.dn.js
        │   └── style.dn.js
        ├── static
        │   ├── backend.js
        │   ├── classic.js
        │   ├── declarative.js
        │   └── style.css
        └── templates
            └── page.dn.js
    `),
    m("p", "You should be able to run the server with:"),
    bash(`
        git clone git@github.com:leontrolski/dnjs.git
        cd dnjs; python3 -m venv .env; source .env/bin/activate
        pip install dnjs fastapi uvicorn aiofiles python-multipart

        examples/todo/bin/serve
        open 'http://localhost:8000/backend'
    `),


    m("h2", "Building the app with ", backend),
    m("p", "We're going to use the ", py, " library ", m("a", {href: "https://fastapi.tiangolo.com/"}, "FastAPI"), " for our backend. Let's start by looking at the body of the html we want to end up with:"),
    html(`
        <h1 class="todo-bold todo-red">Hello Ms Backend</h1>
        <div id="todo-list">
            <form id="todoListForm" method="POST">
                <ul>
                    <li class="todo-todo">
                        hullo
                        <input class="doneCheckbox" name="doneCheckbox" value="0" type="checkbox" />
                    </li>
                    <li class="todo-todo">
                        goodbye
                        <input class="doneCheckbox" name="doneCheckbox" value="1" type="checkbox" checked />
                    </li>
                </ul>
                <input name="newMessage" value="" placeholder="message" autocomplete="off" />
                <button>add todo</button>
            </form>
        </div>
    `),
    m("p", "As you can see, we're going to render just a normal html ", inline("<form>"), ". When we submit the form, it will POST one ", inline("newMessage"), " with ", inline(`value="some message"`), " and many ", inline("doneCheckbox"), "s, each with ", inline(`value="index"`), " - the indexes of todos that are checked."),

    m("h3", "An aside on html forms"),
    m("p", "Html forms are really not a thing of beauty, they map poorly to json structures, you can't nest them, they can only convey strings, etc. Lots of frontend devs in particular seem to have forgotten the weirdo ins and outs of how they work, for example: that ", inline("<button>"), "s and ", inline(`<input type="checkbox">`), "s have ", inline("(name, value)"), "s ", m("em", "that are only are POSTed when they are clicked/checked.")),
    m("p", m("em", "Despite"), " these shortcomings, they are well worth using for simple forms (that is to say - most forms). Not using any ", js_, " means having basically zero state in the browser, and that makes reasoning about/testing the app way easier. Like way way easier."),

    m("h3", "Back to the app"),
    m("p", "Let's have a look at the ", dnjs, " templating code we use to render the page from", py, ", the base page is in ", file("examples/todo/templates/page.dn.js"), " and looks like:"),
    js(`
        import { TodoList } from "../shared/components.dn.js"

        const title = [classes.bold, classes.red]

        export default (data) => (
            ...
            m("h1", {class: title}, "Hello ", data.username),
            m("#todo-list", TodoList(data.state)),
            ...
        )
    `),
    m("p", "The components for the form itself can be found in ", file("examples/todo/shared/components.dn.js"), " and look a bit like:"),
    js(`
        export const Todo = (todo) => m("li",
            todo.message,
            m("input.doneCheckbox", {name: "doneCheckbox", value: todo.i, checked: todo.done, type: "checkbox"}),
        )

        export const TodoList = (state) => m("form#todoListForm",
            {method: "POST"},
            m("ul", state.todos.map((todo, i) =>Todo({...todo, i: i}))),
            m("input", {name: "newMessage", value: state.new}),
            m("button", "add todo"),
        )
    `),
    m("details", m("summary", "The equivalent handlebars code would look something like this."), html(`
        <h1 class="{{classes.bold}} {{classes.red}}">Hello {{data.username}}</h1>
        <div id="todo-list">
            <form id="todoListForm" method="POST">
                <ul>
                    {{#each state.todos}}
                        <li>
                            {{message}}
                            <input class="doneCheckbox" name="doneCheckbox" value="{{@index}}" {{#if done}}checked{{/if}} type="checkbox" />
                        </li>
                    {{/each}}
                </ul>
                <input name="newMessage" value="{{state.new}}" />
                <button>add todo</button>
            </form>
        </div>
    `)),
    m("p", "We will render the page in ", file("examples/todo/app.py"), " with:"),
    python(`
        @app.get("/backend", response_class=HTMLResponse)
        def get_backend() -> str:
            return dnjs.render(
                templates / "page.dn.js",
                PageData(
                    username="Ms Backend",
                    state=State(todos=_todos.todos, new=""),
                )
            )
    `),
    m("p", "We're rendering the ", dnjs, " (a subset of ", js_, ") with ", py, " ... 🤯"),
    m("p", "In the same file, we handle ", inline("POST"), "s with:"),
    python(`
        @app.post("/backend", response_class=HTMLResponse)
        def post_backend(newMessage: str, doneCheckbox: List[int]) -> str:
            if newMessage:
                _todos.todos.append(Todo(message=newMessage, done=False))

            for i, todo in enumerate(_todos.todos):
                todo.done = i in doneCheckbox

            return render(...)
    `),
    m("em", "Note, for demo purposes, we are storing the todos serverside with an in-memory structure ", inline("_todos"), "."),
    m("p", "In case you can't be bothered to run the example application, here's a video of me clicking around the ", backend, " app with the console on."),
    video("videos/backend.webm"),


    m("h2", "Adding some frontend rendering with ", classic),
    m("p", "The users of our app were posting lots of frequent comments, we decided it wasn't acceptable to have a page reload every time it happened. This means we had to add a sprinkling (23 lines) of", js_, "to:"),
    m("ul",
        m("li", "POST the data to the backed using ", inline("XHR"), "."),
        m("li", "Construct a new ", inline("<li>"), " element from the data."),
        m("li", "Append that element to the existing ", inline("<ul>"), " in the DOM."),
    ),
    m("p", "The bulk of this - ", file("examples/todo/static/classic.js"), " - is as follows:"),
    js(`
        import { Todo } from "../shared/components.dn.js"

        ...

        todoListFormEl.onsubmit = async e => {
            // prevent the <form> from actually submitting
            e.preventDefault()

            ...

            // construct the todo data and send to the backend
            const data = {
                message: newMessageEl.value,
                done: false
            }
            await fetch(
                "/classic/todos",
                {method: 'POST', body: JSON.stringify(data)}
            )

            // make the Todo DOM node and append it to the DOM
            const newTodo = Todo(data, null)
            todoListUlEl.appendChild(m.makeEl(newTodo))

            ...
        }
    `),
    m("p", "The important thing here is that ", m("b", " we were able to reuse the same ", inline("Todo"), " component that we used on the backend on the frontend"), ". Cool huh!"),
    m("h3", "dnjs2dom"),
    m("p", "In the ", classic, " app, we use the teeny ", m("a", {href: "https://github.com/leontrolski/dnjs2dom#dnjs-client-helper"}, "dnjs2dom"), " library to turn the ", inline("m(...)"), " components into actual DOM nodes. This library enables the line ", inline("todoListUlEl.appendChild(m.makeEl(newTodo))"), "."),
    m("p", "Let's show a video of this in action:"),
    video("videos/classic.webm"),

    m("h2", "Going whole-hog frontend rendering with ", declarative),
    m("p", "It's a bit contrived with this simple app, but let's imagine our UI's complexity has tipped over to the point where we want everything super dynamic. To achieve this, we will use the (excellent) ", m("a", {href: "https://mithril.js.org/"}, "mithril"), " - which ", dnjs, " is handily compatible with."),
    m("p", "Here's the line from ", file("examples/todo/static/declarative.js"), " where we mount our components to the DOM with mithirl:"),
    js(`m.mount(todoListEl, {view: () => TodoList(state, actions)})`),
    m("p", "Note again - ", m("b", " we were able to reuse the same ", inline("TodoList"), " component that we used on the backend on the frontend.")),
    m("p", m("a", {href: "https://mithril.js.org/"}, "mithril"), " wraps any ", inline("{onclick: f, onsubmit: g, ...}"), " functions and rerenders the DOM as necessary in similar way to ", inline("React"), ". Below is an example of one of the functions we pass via ", inline(`m("form", {onsubmit: add}, ...)`), "."),
    js(`
        const add = (e) => {
            e.preventDefault()
            if (!state.new) return
            state.todos.push({message: state.new, done: false})
            state.new = ""
            m.request({
                url: "/declarative/todos",
                method: "PUT",
                body: {todos: state.todos}
            })
        }
    `),
    m("em", "Note that if we want to render the same component from the backend, we just pass in ", inline("{onsubmit: None}"), " and it is ignored by ", dnjs, "."),
    m("p", "Let's show a video of our declaratively rendered app in action:"),
    video("videos/declarative.webm"),

    m("h1", "Bonus css ", inline("section")),
    m("p", "Our app has many pages, so we'd like to share/compose/namespace our css. Handily ", dnjs , " can convert from ", file("examples/todo/shared/style.dn.js"), ":"),
    js(`
        const _classes = {
            bold: {
                "font-weight": "bold",
            },
            red: {
                "color": "red",
            },
            ...
        }

        // namespace
        export default Object.fromEntries(
            Object.entries(_classes)
            .map(([k, v], _) => [".{namespace}-{k}", v])
        )
    `),
    m("p", "Via:"),
    bash("dnjs shared/style.dn.js --css > static/style.css"),
    m("p", "To:"),
    css(`
        .todo-bold {
            font-weight: bold;
        }
        .todo-red {
            color: red;
        }
    `),
    m("p", "In ", file("examples/todo/shared/style.dn.js"), " we also export the names themselves of the css classes, so in the rendering code, we can refer to eg: ", inline("style.classes.bold"), " and it will resolve to the name: ", inline(`"todo-bold"`), "."),
    m("p", `Similar to the advantages in html-rendering land, having your css as "just data" means you can easily compose/transform it, again without resorting to a whole new DSL like `, inline("Sass"), "."),

    // Bonus section - css, tachyons
])