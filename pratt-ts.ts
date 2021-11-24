const source = `
    {
        "a": {"b": {"c": "d"}},
        "foo": (1 === 2)
            ? "bar"
            : 3 + 4 * 5
    }
`

// ({
//     (: "a" ({ (: "b" ({ (: "c" "d")))))
//     (:
//         "foo"
//         (?
//             (=== 1 2)
//             "bar"
//             (+ 3 (* 4 5)))))

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
    return `(${node.token.type}${args.length ? ' ' : ''}${args})`
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
            tokens[i].type === "," ? i += 1 : node.children.push(parse(2))
        advance()
    }
    else if (token.type === "(") {
        advance()
        node = parse(-1)
        advance()  // advance the ")"
    }
    else {
        throw new Error(`must be atom or object, got: ${JSON.stringify(token)}`)
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

console.log(sexpr(parse(0)))
