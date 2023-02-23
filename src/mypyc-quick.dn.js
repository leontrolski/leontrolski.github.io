import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "mypyc-quick.html"
const title = "mypyc is quick"
const h1 = [inline("mypyc"), " is quick"]

export default page("", h1, [
    m("p", m("a", {href: "https://mypyc.readthedocs.io/en/latest/"}, "mypyc"), "doesn't get a huge amount of attention, but it's easy to use and can make well-typed Python really fast. No one likes benchmarks, but here's one anyways."),
    m("p", "Save the following as ", inline("lib.py")),
    python(`from dataclasses import dataclass

@dataclass
class Row:
    name: str
    age: int

def make() -> list[Row]:
    return [Row(name=f"name-{i}", age=i) for i in range(1_000_000)]

def mult(rows: list[Row]) -> None:
    for row in rows:
        row.name = row.name.upper()
        row.age *= 3`),

    m("p", "And the following as ", inline("prof.py")),
    python(`import time
import lib

before  = time.time()
d = lib.make()
print(f"took {time.time() - before:.2f} seconds")

before  = time.time()
lib.mult(d)
print(f"took {time.time() - before:.2f} seconds")`),

    m("p", "Now ", inline("python prof.py")),
    m("p", "On my laptop, ", inline("make()"), "runs in 1.95s, ", inline("mult()"), "runs in 0.87s."),
    m("br"),
    m("p", "Now compile it, ", inline("pip install mypy"), ", ", inline("mypyc lib.py")),
    m("p", "On my laptop, ", inline("make()"), "runs in 1.40s, ", inline("mult()"), "runs in 0.03s."),
    
    m("br"),
    m("p", "Quick huh!"),
    m("p", "This could be quite an exciting development in the Python ecosystem. Imagine writing interpreted code all day (zero compile times, breakpoints, etc), then compiling for production. Imagine a well-typed and compiled stdlib, flask, SQLAlchemy, etc. It's gonna be great ☀️."),
])
