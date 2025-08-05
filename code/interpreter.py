from __future__ import annotations
from dataclasses import dataclass
from typing import Callable, Union

@dataclass(frozen=True)
class Symbol:
    value: str

@dataclass
class List:
    is_macro: bool
    values: list[Node]

Atom = int
Node = Union[Atom, Symbol, List]
Value = Union[int, Node, Callable[..., int], None]
Scope = dict[Symbol, Value]

is_whitespace = lambda c: c in " \n"
is_number = lambda c: c.isdigit()
is_symbol = lambda c: c not in " \n()"

i = 0
def parse(source: str) -> Node:
    global i
    def gobble(f: Callable[[str], bool]) -> str:
        global i
        value = ""
        while f(source[i]):
            value += source[i]
            i += 1
        return value

    gobble(is_whitespace)
    if is_number(source[i]):
        return int(gobble(is_number))
    if is_symbol(source[i]):
        return Symbol(gobble(is_symbol))
    if source[i] == "(":
        i += 1  # gobble (
        is_macro = source[i] == "#"
        if is_macro:
            i += 1  # gobble #
        items = List(is_macro, [])
        while source[i] != ")":
            items.values.append(parse(source))
            gobble(is_whitespace)
        i += 1  # gobble )
        return items
    raise RuntimeError("Unknown character")

def block(scope: Scope, *nodes: Node) -> Value:
    local_scope = scope.copy()
    values = [interpret(local_scope, child) for child in nodes]
    return values[-1]  # blocks evaluate to the final value

def assign(scope: Scope, *nodes: Node) -> Value:
    symbol, node = nodes
    scope[symbol] = interpret(scope, node)
    return None

def function(scope: Scope, *nodes: Node) -> Value:
    local_scope = scope.copy()
    vars, node = nodes
    return lambda *args: interpret(local_scope | dict(zip(vars.values, args)), node)

builtins = {
    Symbol("{"): block,
    Symbol("="): assign,
    Symbol("=>"): function,
    Symbol("print"): lambda *args: print(*args),
    Symbol("-"): lambda a: -a,
    Symbol("*"): lambda a, b: a * b,
    Symbol("+"): lambda a, b: a + b,
}

def interpret(scope: Scope, node: Node) -> Value:
    if isinstance(node, int):
        return node
    if isinstance(node, Symbol):
        return scope[node]
    if node.is_macro:
        f, *args = node.values
        f = interpret(scope, f)
        return f(scope, *args)
    f, *args = [interpret(scope, child) for child in node.values]
    return f(*args)

source = """
(#{
    (#= make-adder
        (#=> (a) (#=> (b) (+ a b))))
    (#= add-one (make-adder 1))
    (print (add-one 3))

    (#= x 5)
    (#= f
        (#=> (a b) (#{
            (#= c (+ a b))
            (* (- c) x)
        ))
    )
    (print (f 1 3))
)
"""
interpret(builtins, parse(source))
