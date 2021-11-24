import { page, inline, js, python, bash, html, css } from "./base.dn.js"

export const filename = "pratt-example.html"
const title = "Pratt parsing"
const h1 = ["Pratt parser for a subset of JavaScript"]


export default page(title, h1, [
    m("p", "This post presents a Pratt parser for a subset of JavaScript using TypeScript. It's very similar to the one used in ", m("a", {href: "https://github.com/leontrolski/dnjs"}, "dnjs.")),
    m("p", "This type of parser has become fairly popular due to the simplicity with which it handles things like operator precedence. In fact I'm part of a ", m("a", {href:"https://www.oilshell.org/blog/2017/03/31.html"}, "long lineage"), " of bloggers - it's the \"monad is a burrito\" of parsing posts. I thought I'd bother writing up my attempt as I had a fun time writing it and was particularly happy with the brevity of the resulting code - I think this really exposes how lovely a parsing method it is. Thank you thank you ", m("a", {href: "https://andychu.net/"}, "Andy C"), " for bringing it into my life."),
    m("p", "The parser will turn the following source:"),
    js(`{
    "a": {"b": {"c": "d"}},
    "foo": (1 === 2)
        ? "bar"
        : 3 + 4 * 5
}`),
    m("p", "Into the following AST:"),
    js(`({
    (: "a" ({ (: "b" ({ (: "c" "d")))))
    (:
        "foo"
        (?
            (=== 1 2)
            "bar"
            (+ 3 (* 4 5)))))`),
    m("p", "Each S-expression is of the form:"),
    js(`(operator child child ...)`),
    m("p", "Here's le parsing code:"),
    js(`const source = '...'  // see above
const split = source.match(/{|}|:|,|\(|\)|===|:|\?|\+|\*|\d+|(?:"[^"]+")/g)

type Token = {
    type: string
    value: string
}

const tokens: Token[] = (split || []).map(value => ({
    type: value[0] === '"' ? "string" : value.match(/\d+/) ? "number" : value,
    value
}))

type Node_ = {
    token: Token
    children: Node_[]
}

const sexpr = (node: Node_): string => {
    if (node.token.type === "number" || node.token.type === "string")
        return node.token.value
    const args = node.children.map(sexpr).join(" ")
    return \`(\${node.token.type}\${args.length ? ' ' : ''}\${args})\`
}

const infixPrecedences = {"===": 2, "+": 14, "*": 15, ":": 11, "?": 12}
let i = 0
const advance = () => i += 1

const parse = (precedence: number): Node_ => {
    const token = tokens[i]
    let node = {token, children: []}
    if (token.type === "number" || token.type === "string"){
        advance()
    }
    else if (token.type === "{") {
        advance()
        while (tokens[i].type !== "}")
            tokens[i].type === "," ? advance() : node.children.push(parse(2))
        advance()
    }
    else if (token.type === "(") {
        advance()
        node = parse(-1)
        advance()  // advance the ")"
    }
    else {
        throw new Error(\`must be atom or object, got: \${JSON.stringify(token)}\`)
    }
    if (i === tokens.length) return node
    return infix(precedence, node)
}

const infix = (precedence: number, left: Node_): Node_ => {
    const token = tokens[i]
    const nextPrecedence = infixPrecedences[token.type]
    if (nextPrecedence === undefined || precedence >= nextPrecedence) return left

    advance()
    const children = [left, parse(nextPrecedence)]
    if (token.type === "?"){
        advance()  // advance the ":"
        children.push(parse(nextPrecedence))
    }
    return {token, children}
}

console.log(sexpr(parse(0)))`),
])
