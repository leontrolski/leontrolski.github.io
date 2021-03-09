import { page, inline, js, python, bash, html, css } from "./base.dn.js"

export const filename = "pratt.html"
const title = "Pratt parsing"
const h1 = ["Writing a Pratt parser for a useful subset of Javascript"]


export default page(title, h1, [
    m("p", "Let's write a Pratt parser and an interpreter for a ", m("a", {href: "https://github.com/leontrolski/dnjs#how-exactly-does-dnjs-extend-json"}, "subset of JS"), " with Python!"),
    m("p", "This type of parser has become fairly popular due to the simplicity with which it handles things like operator precedence. In fact I'm part of a ", m("a", {href:"https://www.oilshell.org/blog/2017/03/31.html"}, "long lineage"), " of bloggers - it's the \"monad is a burrito\" of parsing posts. I thought I'd bother writing up my attempt as I had a fun time writing it and was particularly happy with the brevity of the resulting code - I think this really exposes how lovely a parsing method it is. Thank you thank you ", m("a", {href: "https://andychu.net/"}, "Andy C"), " for bringing it into my life."),
    m("p", "Also, I feel I gained some deeper understanding of JS in writing it, so hopefully you will gain some in reading."),

    m("h2", "Background on why"),
    m("em", "Coming soon..."),

    m("h2", "Tokenising"),
    m("p", "Our tokeniser takes some source code and splits it into tokens, it has one attribute and one method:"),
    python(`.current: Token
.advance() -> None`),
    m("p", "Let's see how they work:"),
    python(`>>> from dnjs import tokeniser

>>> source = '[1, "two", foo]'
>>> t = tokeniser.TokenStream.from_source(source)

>>> t.current
Token(type='[',      value='[',     pos=0,  lineno=1, linepos=0 )

>>> t.advance()
>>> t.current
Token(type='number', value='1',     pos=1,  lineno=1, linepos=1 )

# we keep repeating t.advance(), t.current

Token(type=',',      value=',',     pos=2,  lineno=1, linepos=2 )
Token(type='string', value='"two"', pos=4,  lineno=1, linepos=4 )
Token(type=',',      value=',',     pos=9,  lineno=1, linepos=9 )
Token(type='name',   value='foo',   pos=11, lineno=1, linepos=11)
Token(type=']',      value=']',     pos=14, lineno=1, linepos=14)
Token(type='eof',    value='eof',   pos=16, lineno=2, linepos=0 )`),
    m("p", "Makes sense? Great. I'll leave implementing the tokeniser to your imagination, here's ", m("a", {href: "https://github.com/leontrolski/dnjs/blob/af83ef6a0561618bbc88a79ae7da5f33115702d0/dnjs/tokeniser.py"}, "dnjs"), "'s if you're interested."),
    m("p", "The type of a token is one of the following:"),
    python(`name string number template literal
= => ( ) { } [ ] , : . ... ? === \` import from export default const
eof unexpected`),

    m("h2", "JS lisp"),
    m("p", "All ", m("a", {href: "https://github.com/leontrolski/dnjs/blob/af83ef6a0561618bbc88a79ae7da5f33115702d0/test/test_parser.py"}, "dnjs's parsing tests"), " assert against ", m("a", {href: "https://en.wikipedia.org/wiki/S-expression"}, "S-expression"), " representations of the parsed code. Let's look at some examples - a line of JS followed by a line of equivalent S-expression - hopefully it'll be obvious what's going on."),
    js(`[1, 2, null]

([ 1 2 null)


foo.bar === 4

(=== (. foo bar) 4)


{foo: 2, bar: 3, ...a}

({ (: foo 2) (: bar 3) (... a))


f(3, 4, 5)

($ f (* 3 4 5))


const bar = {}

(const (= bar ({)))


import m from "mithril"

(import (from m "mithril"))


(a) => [42]

(=> (d* a) '([ 42))


const f = (a, b, c) => ({"foo": [1]})

(const (= f (=> (d* a b c) '(( ({ (: "foo" ([ 1)))))))


(a === 3) ? "foo" : 2

(? (( (=== a 3)) '"foo" '2)


const a = \`  hi \${first}\${second}\`

(const (= a (\` \`  hi \${ first }\${ second }\`)))`),

m("p", "So, each S-expression is of the form:"),
python(`(operator child child)`),
m("p", `If we have no child, we have an "atom", one child the operator is "unary", two children is "binary", three children is "ternary" and any number of children is "variadic".`),
m("p", "Some of the S-expressions are quoted like this:"),
python(`'(operator child child)`),
m("p", "This is an instruction to the interpreter not to immediately evaluate the expression (used in the case of function return values and ternary operator return values)."),
m("p", "In memory, we represent the S-expressions by the folowing type:"),
python(`@dataclass
class Node:
    token: t.Token
    is_quoted: bool
    children: List[Node]`),
m("p", "If we do:"),
python(`str(some_node)`),
m("p", "We get the S-expression version."),

m("p", "In general, we just use the token's type as the operator, as you may have noticed, we've invented some artificial operators that weren't returned by the tokeniser, they are:"),

python(`$               -  apply a function to some arguments
*               -  a group of arguments
dname d* d[ d{  -  dumb versions of name * [ {`),

m("p", "Now go back to the examples and check they make sense."),


m("h1", "Parsing"),
m("p", "We're now going to look at a reduced version of dnjs's parser, our aim is going to be to parse a statement like this:"),
python(`source= "foo.bar === [1, 2, 3]"
token_stream = t.TokenStream.from_source(source)
assert str(parse(token_stream, 0)) == "(=== (. foo bar) ([ 1 2 3))"`),
m("p", "The Pratt parsing algorithm is, in essence:"),
python(`def parse(binding_precedence) -> Node
    before = token_stream.current

    if before is an atom:
        node = Node(before)

    elif before is an array, object, etc:
        children = []
        while token_stream.current is not ] or }:
            children.append(parse(binding_precedence))
        node = Node(before, children)

    return infix(binding_precedence, node)


def infix(binding_precedence, left) -> Node:
    before = token_stream.current

    if before is === :
        next_binding_precedence = 2
        if binding_precedence >= next_binding_precedence:
            return left
        right = parse(next_binding_precedence)
        return infix(binding_precedence, Node(before, [left, right])

    elif before is . :
        next_binding_precedence = 3
        ... for all infix operators

    else:
        return left`),


m("p", m("a", {href: "https://github.com/leontrolski/dnjs/blob/af83ef6a0561618bbc88a79ae7da5f33115702d0/test/test_demo.py"}, "Here"), " is the demo parser, (", m("a", {href: "https://github.com/leontrolski/dnjs/blob/af83ef6a0561618bbc88a79ae7da5f33115702d0/dnjs/parser.py"}, "here"), " is the real one), we're going to follow though all the function calls, step-by-step."),

m("p", "Our tokens are as follows:"),
python(`Token(type='name',   value='foo')
Token(type='.',      value='.'  )
Token(type='name',   value='bar')
Token(type='===',    value='===')
Token(type='[',      value='['  )
Token(type='number', value='1'  )
Token(type=',',      value=','  )
Token(type='number', value='2'  )
Token(type=',',      value=','  )
Token(type='number', value='3'  )
Token(type=']',      value=']'  )`),

m("p", "Let's follow this parsing process, step by step:"),

python(`├── parse(rbp=0) before is foo
├── hit number|name branch
│   ├── infix(rbp=0, left=foo) before is .
│   ├── hit . branch
│   │   ├── parse(rbp=3) before is bar
│   │   ├── hit number|name branch
│   │   │   ├── infix(rbp=3, left=bar) before is ===
│   │   │   ├── hit === branch
│   │   │   ├── hit high precedence branch
│   │   │   └── return bar
│   │   └── return bar
│   ├── right = bar
│   │   ┌── infix(rbp=0, left=(. foo bar)) before is ===
│   │   ├── hit === branch
│   │   │   ├── parse(rbp=2) before is [
│   │   │   ├── hit [ branch
│   │   │   │   ├── parse(rbp=0) before is 1
│   │   │   │   ├── hit number|name branch
│   │   │   │   │   ├── infix(rbp=0, left=1) before is ,
│   │   │   │   │   ├── didn't hit any branch
│   │   │   │   │   └── return 1
│   │   │   │   └── return 1
│   │   │   │   ┌── parse(rbp=0) before is 2
│   │   │   │   ├── hit number|name branch
│   │   │   │   │   ├── infix(rbp=0, left=2) before is ,
│   │   │   │   │   ├── didn't hit any branch
│   │   │   │   │   └── return 2
│   │   │   │   └── return 2
│   │   │   │   ┌── parse(rbp=0) before is 3
│   │   │   │   ├── hit number|name branch
│   │   │   │   │   ├── infix(rbp=0, left=3) before is ]
│   │   │   │   │   ├── didn't hit any branch
│   │   │   │   │   └── return 3
│   │   │   │   └── return 3
│   │   │   │   ┌── infix(rbp=2, left=([ 1 2 3)) before is eof
│   │   │   │   ├── didn't hit any branch
│   │   │   │   └── return ([ 1 2 3)
│   │   │   └── return ([ 1 2 3)
│   │   ├── right = ([ 1 2 3)
│   │   │   ┌── infix(rbp=0, left=(=== (. foo bar) ([ 1 2 3))) before is eof
│   │   │   ├── didn't hit any branch
│   │   │   └── return (=== (. foo bar) ([ 1 2 3))
│   │   └── return (=== (. foo bar) ([ 1 2 3))
│   └── return (=== (. foo bar) ([ 1 2 3))
└── return (=== (. foo bar) ([ 1 2 3))`),

m("h1", "Interpreting"),
m("em", "Coming soon..."),
])
