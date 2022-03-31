import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "leet.html"
const title = "interview patterns"
const h1 = "Interview patterns in Python"

export default page(title, h1, [
    m("p", "Not necessarily fastest, but hopefully neatest. Recursive problems can be converted to while loops."),
    m("details", {id: "top"}, m("summary", "Variable naming conventions."),
        python(`x  y  z      # values
i  j  k      # corresponding indices
xs ys zs     # lists of values
t            # a target to aim for
w            # the path to something
a            # something we accumulate
f            # a function used for recursion
n            # a node in a tree or graph
b            # a place to mark things we've already done
l            # an input list
s            # an input string
p            # an input pattern
.v .l .r .n  # the value, left, right, next of a node in a tree
.._prev      # the previous of something
.._next      # the next of something
.._new       # a new version of something
`)),
    m("details", m("summary", "Imports required to run the examples."),
        python(`from __future__ import annotations
from collections import defaultdict
from dataclasses import dataclass
from functools import cache  # a lot of the \`f(...)\` below can be memoized
from itertools import count
from types import SimpleNamespace`)
    ),
    m("br"),
    m("#root"),
    m("style", `
.tag{margin:0.25rem 0.5rem 0.25rem 0;padding:0.25rem 0.5rem 0.25rem 0.5rem;}
.tag-selected{font-weight:bold;}
.problem{margin-top:4rem;}
.no-border{border:none;}
.description{padding:1rem;}
`),
    m("script", {src: "33-line-react.js"}),
    m("script", {src: "leet.js"}),
])
