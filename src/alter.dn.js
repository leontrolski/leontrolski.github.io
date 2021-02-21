import { page, inline, python, js, bash, html, css } from "./base.dn.js"

export const filename = "alter.html"
const title = "containing mutable data"
const h1 = ["Can we contain mutable data in imperative languages?"]
// ", m("a", {href: ""}, ""), "
// ", inline(""), "
export default page(title, h1, [
m("p", "Using immutable data confers all sorts of advantages, in practice, the main ones are:"),
m("ul",
    m("li", "It removes nasty \"action at a distance\" bugs."),
    m("li", "It opens the door for easy comparison of values."),
    m("li", "It can make concurrent programming easier."),
),
m("p", "This post briefly surveys the territory, then proposes a small syntactic addition to Javascript that would help constrain mutability, while having a clear transition path from existing code (no funky FP stuff). The examples are in Javascript, but the same concept could be ported to Python and other high level languages with mutable data."),
m("em", "If you're already familiar with immutable libraries in Javascript, feel free to jump to the ", m("a", {href: "#proposal"}, "proposal"), "."),

m("h2", "What do we have now?"),
m("p", "The most well known ", m("a", {href: "https://github.com/immutable-js/immutable-js"}, "immutable library"), " gives us a smorgasbord of new data structures, using them in practice can be a bit clunky:"),
js(`const map1 = Map({a: 1, b: 2, c: 3})
const map2 = map1.set('b', 50)`),
m("p", "Once you start updating large data nested structures, more gnarliness ensues. In introducing a non-native data-type we lose a number of syntactic/typing niceties - it seems that for most people, using new exotic data-types is not worth this hassle."),
m("p", "A more recent library that aims to solve these problems is ", m("a", {href: "https://immerjs.github.io/immer/docs/introduction"}, "immer"), ", immer is really neat as it sidesteps the need for new data-types. ", m("em", "I even wrote a ", m("a", {href: "https://github.com/leontrolski/immerframe"}, "half baked Python port"), " of it"), "."),
m("p", "The example above becomes:"),
js(`const map1 = { a: 1, b: 2, c: 3 }
const map2 = produce(map1, draft => {
    draft.b = 50
})`),
m("p", "Immer is a really cool idea and is designed well to work with contemporary frontend patterns, but suffers from two flaws:"),
m("ul",
    m("li", inline("draft"),  "is a mega magicy proxy object, its website lists a number of ", m("a", {href: "https://immerjs.github.io/immer/docs/pitfalls"}, "pitfalls"), " resulting from this."),
    m("li", "Immer can only go so far with structural sharing of data."),
),


m("details",
    m("summary", "Some detail on that second point."),
    m("p", "With a library that deals in built-in data types, it's only possible to structurally share data that's passed around by reference (basically objects and arrays, not strings or numbers). If we do:"),
    js(`const foo = { some massive nested object }
const array1 = [foo]
const array2 = produce(array1, draft => {
    array1.push(42)
})`),
    m("p", "Then ", inline("array2[0]"), m("em", " is "), inline("foo"), ", we didn't have to duplicate anything in memory. Under the hood, ", inline("array2"), " is: some reference to ", inline("foo"), ", and the atomic value ", inline("42"), "."),
    m("p", "However, if we did:"),
    js(`const array1 = [1, 2, 3, etc, 9999999]
const array2 = produce(array1, draft => {
    array1.push(42)
})`),
    m("p", "Then under the hood ", inline("array2"), " is ", m("em", "not"), " a reference to ", inline("array2"), " with ", inline("42"), " tacked on the end, it is a whole new array ", inline("[1, 2, 3, etc, 9999999, 42]"), "."),
    m("p", "With the kind of data used in most frontend applications, this is not so much of a problem. If however we were writing a library that did involve mucking around with rather long arrays, this is a big problem vis-a-vis memory usage."),
),
m("p", "As a thought experiment, let's imagine what would happen if we baked the immer concept into the language..."),


m("h2#proposal", "Syntax proposal"),
m("p", "The proposed syntax consists of one new keyword, ", inline("alter"), ":"),
js(`const map1 = { a: 1, b: 2, c: 3 }
const map2 = alter (map1) {
    map1.b = 50
}`),
m("h2", "The rules"),
m("ul",
    m("li", "Everything we do to mutate ", inline("map1"), " within the ", inline("alter"), " block applies only within the lexical scope of that block."),
    m("li", "The block evaluates to the final value of ", inline("map1"), "."),
),
m("p", "The first rule is important, let's imagine we've added a ", inline("--disallow-mutating"), " flag to node and attempted to run the following:"),
js(`function nastyMutator(m){
    m.b += 1
}
const map1 = { a: 1, b: 2, c: 3 }
const map2 = alter (map1) {
    nastyMutator(map1)
}`),
m("p", "The interpreter would raise an error for the second line at parse time."),
m("em", "Note that we're still allowing reassignment, so the following is permissable:"),
js(`let map1 = { a: 1, b: 2, c: 3 }
map1 = alter (map1) {
    map1.b = 50
}`),


m("h3", "Other syntax"),
m("p", "The block can just be the next single statement, as with ", inline("if"), " and ", inline("for"), ":"),
js("map1 = alter (map1) map1.b = 50"),
m("p", "Standard unpacking syntax would enable doing many things at once:"),
js(`[c, d] = alter ([a, b]) {
    c.foo = 1
    b.bar = 2
}`),


m("h1", "What do we win?"),
m("p", "We solve the problems we had with using specialist data types and with immer:"),
m("ul",
    m("li", "We can stick to boring objects and arrays and keep all our typing."),
    m("li", "Within the ", inline("alter"), " block, the variable we specified at the beginning is just a plain 'ol value - no pitfalls resulting from proxy magic."),
    m("li", "A clever interpreter would be able to do lots of structural sharing, so the following would be memory efficient:",
        js(`const array1 = [1, 2, 3, etc, 9999999]
const array2 = alter (array1) {
    array1.push(42)
}`)
    ),
),
m("p", "Now let's think long term, let's imagine uptake is high - there's no need to install any libraries and converting existing code is easy, so why not - what happens then?"),
m("p", "We can reach the stage where all the mutating in our codebase is contained within ", inline("alter"), " blocks - we can check this by running with our ", inline("--disallow-mutating"), " flag from earlier. (Maybe we add a ", inline("mutate"), " keyword for specific circumstances so we can do eg: ", inline("mutate this.linepos += 1"), ")."),
m("p", "Now all our data outside of ", inline("alter"), " blocks is immutable, we can:"),
m("ul",
    m("li", "Reason more easily about the code - no mutation at a distance."),
    m("li", "Do efficient comparisons on stuff, this opens the door for objects in sets and as keys in maps."),
    m("li", "The interpreter can now do various performance tricks."),
),

m("h2", "Application to global-state-styley frontends"),
m("p", "As the syntax is lifted straight from immer, we can trivially update ", m("a", {href: "https://immerjs.github.io/immer/docs/example-reducer"}, "their reducer pattern example"), ":"),
js(`const byId = (state, action) => alter (state) {
    switch (action.type) {
        case RECEIVE_PRODUCTS:
            action.products.forEach(product => {
                state[product.id] = product
            })
    }
}`),


m("h2", "Python equivalent"),
m("p", "The Python version would look the same, just with Python's block syntax:"),
python(`const array1 = [1, 2, 3, etc, 9999999]
const array2 = alter array1:
    array1.push(42)`),

m("details",
    m("summary", "Aside on semantics of updating deeply nested values in FP languages."),
    m("p", "Clojure has the concept of ", m("a", {href: "https://clojure.org/reference/transients"}, "transients"), " that feel somewhat similar to `alter`, I should play around with these more."),
    m("p", "Haskellers (often it seems) use the ", m("a", {href: "lens"}, "https://hackage.haskell.org/package/lens"), " library for making deep changes to objects. I've seen the Python equivalent used and the resulting code has always been reverted back to a \"native\" style at some point as it can be tricksy to read and doesn't play well with modern typed Python. An open question for me is:"),
    m("quote", "Is there a pure-FP-ish way to doing deep updates that's always as \"natural\" as the classic mutational way?"),
    m("p", "Here's a contrived example of something that to me \"feels natural\" in an imperative style, but it could just be my unfamiliarity."),
    js(`const stateAfter = alter (state) {
    const unflagged = []
    for (const message of state.messages){
        if (message.flagged){
            state.flaggedMessages.push(message)
            state.totalCount -= 1
            delete state.visibleUserIds[message.userId]
        }
        else unflagged.push(message)
    }
    state.messages = unflagged
}`),
)
])