import { page, inline, python, bash, html, css, js } from "./base.dn.js"

export const filename = "lambda-calculus.html"
const title = "Lambda calculus succinctly"
const h1 = "Lambda calculus succinctly in modern JavaScript"

export default page(title, h1, [
    m("script", m.trust(`const toInt = a => a(n => n + 1)(0)
const toBool = a => a(true)(false)

const True = a => b => a
const False = a => b => b
const not = a => a(False)(True)
const and = a => b => a(b)(a)
const or = a => b => a(a)(b)
// Note someBool ? a : b
// is equivalent to someBool(_ => a)(_ => b)(_)

const _0 = f => a => a
const _1 = f => a => f(a)
const _2 = f => a => f(f(a))
const _3 = f => a => f(f(f(a)))
const inc = n => f => a => f(n(f)(a))
const plus = n => m => n(inc)(m)
const mult = n => m => a => n(m(a))
const isEven = n => n(not)(True)
const isZero = n => n(True(False))(True)

const pair = a => b => f => f(a)(b)
const first = p => p(True)
const second = p => p(False)

const incSecond = p => pair(second(p))(inc(second(p)))
const dec = n => first(n(incSecond)(pair(_0)(_0)))
const minus = n => m => m(dec)(n)
const gte = n => m => isZero(n(dec)(m))
const lt = n => m => not(gte(n)(m))
const eq = n => m => and(gte(n)(m))(gte(m)(n))

const incAndCall = f => p => pair(
    inc(first(p))
)(
    f(first(p))(second(p))
)
const loop = n => m => f => a => second(
    (minus(m)(n))(incAndCall(f))(pair(n)(a))
)

const _ = True
const sum = n => isZero(n)(_ => _0)(_ => plus(n)(sum(dec(n))))(_)

// Y-combinator
const Y = f => (x => f(_ => x(x)))(x => f(_ => x(x)))
// reduces to Y = f => f(_ => Y(f))
const sum2 = Y(g => n => isZero(n)
    (_ => _0)
    (_ => plus(n)(g(_)(dec(n))))
(_))

// Z-combinator
const Z = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)))
// reduces to Z = f => v => f(Z(f))(v)
const sum3 = Z(g => n => isZero(n)
    (_ => _0)
    (_ => plus(n)(g(dec(n))))
(_))
`)),
    m("p", "You can Google 'Lambda calculus' for a deeper description, but in a nutshell it's a very small, Turing-complete, formal system for expressing computation as symbol manipulation."),
    m("p", "This post rewrites some of the fundamental ideas in familiar JavaScript notation which allows us to easily evaluate them. You can try this out in your browser's console - all the assignments below are in global scope."),
    m("br"),
    m("p", "In Lambda calculus notation, you might write something like:"),
    js("(λf.f 4) (λx.x²)"),
    m("p", "Let's cut straight to the Javascript version:"),
    js("(f => f(4))(x => Math.pow(x, 2))"),
    m("p", "Each anonymous function λ takes one argument. When you call a function, you simply replace the argument each time it occurs in the function's body with the value the function was called with."),
    m("p", "It's worth noting that this process (known as β-reduction) is just a dumb mechanical one of symbol replacement - nothing else weird is happening. This is important, the programs are theorems, and by repeatedly applying β-reduction, we ", m("a", {href: "https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence#Natural_deduction_and_lambda_calculus"}, "prove"), " (or disprove) them within the system."),
    m("p", "In the case of the example above:"),
    js("(λf.f 4) (λx.x²)"),
    m("p", "We can β-reduce the ", inline("f"), " away to make:"),
    js("((λx.x²) 4)"),
    m("p", "Then β-reduce the ", inline("x"), " away to make:"),
    js("(4²)"),
    m("p", "Which we know is 16."),
    m("p", "Handily, with JavaScript notation, the interpreter will do the reduction automatically! So:"),
    js("(f => f(4))(x => Math.pow(x, 2))"),
    m("p", "Does the two reductions above and also evaluates to 16."),
    m("p", "Because of this handy time saving property of JavaScript, we'll continue to use that as our Lambda calculus notation."),

    m("hr"),
    m("h2", "Integers"),
    m("p", "In the example above, we had such high level concepts as '4' and 'x²' - these are a bit cheaty, instead, we're going start from nothing except the rules of the calculus."),
    m("p", "For integers, we're going to use a system called 'Church numerals'. These aren't nouns like 'one' and 'two', but adverbs like 'call ", inline("f"), " with ", inline("a"), " one time' or 'call ", inline("f"), " on ", inline("a"), " two times'. If that's a bit abstract, let's define 4 integers:"),
    js(`const _0 = f => a => a
const _1 = f => a => f(a)
const _2 = f => a => f(f(a))
const _3 = f => a => f(f(f(a)))`),
    m("details", m("summary", "Here's a helper function so we can print these as good ol' fashioned JavaScript numbers.", m("br"), m("em", "This section is folded as it isn't written in formal Lambda calculus.")), js(`const toInt = a => a(n => n + 1)(0)`)),
    m("p", "Now let's add in some functions that operate on integers:"),
    js(`const inc  = n => f => a => f(n(f)(a)) // n + 1
const plus = n => m => n(inc)(m)       // n + m
const mult = n => m => a => n(m(a))    // n * m`),
    m("p", "We can test these in our browser's console using the helper from above, try running:"),
    js(`toInt(plus(_1)(_2))`),
    m("p", "Neat?"),
    m("p", "Let's see how that happened by filling in the variables, then repeatedly applying β-reduction:"),
    js(`plus(_1)(_2)                                                   // replace plus, _1, _2
(n => m => n(inc)(m))(f => a => f(a))(f => a => f(f(a)))       // β n
(m => (f => a => f(a))(inc)(m))(f => a => f(f(a)))             // β m
(f => a => f(a))(inc)(f => a => f(f(a)))                       // replace inc
(f => a => f(a))(n => f => a => f(n(f)(a)))(f => a => f(f(a))) // β first f
(a => (n => f => a => f(n(f)(a)))(a))(f => a => f(f(a)))       // β first a
(n => f => a => f(n(f)(a)))(f => a => f(f(a)))                 // β n
f => a => f((f => a => f(f(a)))(f)(a))                         // β second f
f => a => f((a => f(f(a)))(a))                                 // β second a
f => a => f(f(f(a)))
`),
    m("p", "Phewph, that was long, but we did end up with ", inline("f => a => f(f(f(a)))"), ", which is the Church numeral for '3', so we've ", m("b", "proven"), " 1 + 2 = 3, yay!"),
    m("p", "We can see intuitively how we came up with some of the definitions. Remember earlier, we said the Church numeral 2 is the adverb 'call ", inline("f"), " on ", inline("a"), " two times', the definition for ", inline("plus"), " should make sense with that in mind:"),
    js(`const plus = n => m => n(inc)(m)`),
    m("p", "Just says 'call ", inline("inc"), " on ", inline("m"), " ", inline("n"), " times'"),

    m("h2", "Booleans"),
    m("p", "Now we have a representation of integers based just on the calculus, let's define True and False:"),
    js(`const True  = a => b => a
const False = a => b => b`),
    m("p", "These are, like our integers, very abstract. It's important to consider that the choice is somewhat arbitrary - we're just going to do β-reduction on expressions involving these, and if an expression reduces to ", inline("a => b => a"), " then we consider it True."),
    m("details", m("summary", "Here's a helper function so we can print these as good ol' fashioned JavaScript booleans."), js(`const toBool = a => a(true)(false)`)),
    m("p", "Now let's add some functions that operate on boolean values:"),
    js(`const not = a => a(False)(True)
const and = a => b => a(b)(a)
const or  = a => b => a(a)(b)`),
    m("p", "Again, try them in your browser's console like:"),
    js(`toBool(or(False)(True))`),
    m("br"),
    m("details", {id: "ternary"}, m("summary", "Aside on the ternary operator."), [
        m("p", "The ternary operator in JavaScript looks like"),
        js(`someBool ? a : b`),
        m("p", "Note that neither ", inline("a"), " nor ", inline("b"), " are actually evaluated until the truthiness of ", inline("someBool"), " has been evaluated. For example, when running:"),
        js(`false ? console.log(1) : console.log(2)`),
        m("p", "Only ", inline("2"), " gets logged."),
        m("p", "This means for the equivalent in our Lambda calculus, we need to do:"),
        js(`const _ = True  // stands in for 'any value'

someBool(_ => a)(_ => b)(_)`),
        m("p", "In a language like Haskell, we don't need to do this as every expression is 'lazy' like the ternary expression is in JavaScript."),
    ]),
    m("br"),
    m("p", "We're also going to define some functions that take an integer and return a boolean:"),
    js(`const isEven = n => n(not)(True)
const isZero = n => n(True(False))(True)`),

    m("h2", "Composite data"),
    m("p", "Let's create a function to bundle two pieces of data into one, similar to what we might do with an Array in JavaScript."),
    js(`const pair = a => b => f => f(a)(b)`),
    m("p", "That's great, but how do we get anything out of it?"),
    js(`const first  = p => p(True)
const second = p => p(False)`),
    m("p", "Try this in your browser's console:"),
    js(`const myPair = pair(_2)(_0)
toInt(second(myPair))`),
    m("p", "We're in effect using the ", inline("pair"), "function's closure to store information."),
    m("br"),
    m("p", "What can we do that's useful with this? We already have ", inline("inc"), " that returns the next integer, let's write a ", inline("dec"), " that returns the previous integer."),
    js(`const incSecond = p => pair(second(p))(inc(second(p)))
const dec       = n => first(n(incSecond)(pair(_0)(_0)))`),
    m("p", "Huh? Let's consider just ", inline("n(incSecond)(pair(_0)(_0))")),
    m("p", "This says 'call ", inline("incSecond"), " on ", inline("pair(_0)(_0)"), " ", inline("n"), " times'"),
    m("p", "So if ", inline("n"), " were 3, then ", inline("incSecond(incSecond(incSecond(pair(_0)(_0))))")),
    m("p", "Let's run through that (you might want to write your own helper function to ", inline("console.log"), " ", inline("pair"), "s):"),
    js(`incSecond(pair(_0)(_0))                        // pair(_0)(_1)
incSecond(incSecond(pair(_0)(_1)))             // pair(_1)(_2)
incSecond(incSecond(incSecond(pair(_1)(_2))))  // pair(_2)(_3)`),
    m("p", "Then we take the ", inline("first"), " of ", inline("pair(_2)(_3)"), " which is ", inline("_2"), " - groovy!"),

    m("br"),
    m("p", "Now we've got all the pieces to add a few other useful functions:"),
    js(`const minus = n => m => m(dec)(n)
const gte   = n => m => isZero(n(dec)(m))
const lt    = n => m => not(gte(n)(m))
const eq    = n => m => and(gte(n)(m))(gte(m)(n))`),
    m("br"),
    m("hr"),
    m("h2", "Loops"),
    m("p", "We've got a load of handy bits and bobs, now we can start making something that looks like a useful bit of code. In this case, we're going to recreate this JavaScript looping construct using just Lambda calculus:"),
    js(`const loop = (n, m, f, a) => {
    let k = a
    for (let i = n; i < m; i++){
        k = f(i, k)
    }
    return k
}`),
    m("p", "I'll leave it to the reader to work out the meaning of it:"),
    js(`const incAndCall = f => p => pair(
    inc(first(p))
)(
    f(first(p))(second(p))
)

const loop = n => m => f => a => second(
    (minus(m)(n))(incAndCall(f))(pair(n)(a))
)`),
    m("br"),
    m("hr"),
    m("h2", "Combinators"),
    m("p", "Now for a sum function, in conventional JavaScript:"),
    js(`const sum = (n) => {
    if (n == 0) return 0
    else return sum(n - 1) + n
}`),
    m("p", "And in (nearly) pure Lambda calculus:"),
    js(`const sum = n => isZero(n)(_ => _0)(_ => plus(n)(sum(dec(n))))(_)`),
    m("em", inline("_ = True"), " and stands for 'any variable', we use it because of the reasons outlined ", m("a", {href: "#ternary"}, "above"), "."),

    m("p", "This works, but is only 'nearly' pure Lambda calculus because ", inline("sum"), " is referred to within the ", inline("sum"), " function itself. It only works because that's how our JavaScript interpreter works, and is not built in syntax of the Lambda calculus."),
    m("p", "To make it work without refering to itself, we define the 'Y-combinator':"),
    js(`const Y = f => (x => f(_ => x(x)))(x => f(_ => x(x)))`),
    m("em", "Note again the ", inline("_ =>"), m("a", {href: "#ternary"}, "faff"), " to avoid infinite recursion."),
    m("p", "If you work through the β-reduction, this is equivalent to:"),
    js(`Y = f => f(_ => Y(f))`),
    m("p", "Now we're able to redefine ", inline("sum"), " without self-reference as:"),
    js(`const sum = Y(g => n => isZero(n)
    (_ => _0)
    (_ => plus(n)(g(_)(dec(n))))
(_))`),
])
