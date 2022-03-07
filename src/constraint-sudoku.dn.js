import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "constraint-sudoku.html"
const title = "sudoku constraint solver"
const h1 = "Solving sudoku with a constraint solver"

export default page(title, h1, [
    m("p", "Let's solve a sudoku by writing and then using a backtracking constaint solver."),
    m("p", "The resulting interface we want is:"),
    python(`solution = next(solutions(game))`),
    m("p", "Where a game might be:"),
    python(`game = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
]`),
    m("p", "And the resulting solution we expect to be:"),
    python(`expected = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
]`),
    m("p", "Here's the code, we can save this as ", inline("sudoku.py")),
    python(`from functools import partial
from typing import Iterator

from solver import Problem, yield_solutions

Coordinate = tuple[int, int]
Value = int
Game = list[list[Value]]
Assignments = dict[Coordinate, Value]


def all_different(group: list[Coordinate], assignments: Assignments) -> bool:
    seen = set()
    for v in (assignments[k] for k in group if k in assignments):
        if v in seen:
            return False
        seen.add(v)
    return True


rows = [[(i, j) for j in range(9)] for i in range(9)]
cols = [[(i, j) for i in range(9)] for j in range(9)]
boxes = [[(i + k * 3, j + l * 3) for i in range(3) for j in range(3)] for k in range(3) for l in range(3)]


def solutions(game: Game) -> Iterator[Game]:
    sudoku = Problem[Coordinate, Value]()

    for i in range(9):
        for j in range(9):
            if game[i][j] > 0:
                sudoku.add_variable((i, j), [game[i][j]])
            else:
                sudoku.add_variable((i, j), [1, 2, 3, 4, 5, 6, 7, 8, 9])

    for group in rows + cols + boxes:
        for cell in group:
            sudoku.add_constraint(cell, partial(all_different, group))

    for s in yield_solutions(sudoku):
        yield [[s[i, j] for j in range(9)] for i in range(9)]`),
    m("p", "In summary, we describe the problem as:"),
    m("ul",
        m("li", "There are 81 coordinates - ", inline("(i, j)"), ". If the coordinate already has a value in ", inline("game"),", it can only be that value, else it could be any of 1, 2, 3, 4, 5, 6, 7, 8, 9."),
        m("li", "In each row/column/box, all the values must be different."),
    ),

    m("hr"),
    m("p", "What about ", inline("solver.py"), "? Turns out a generic backtracking solver is not crazy crazy complicated:"),
    python(`from dataclasses import dataclass, field
from json import loads
from typing import Any, Callable, Generic, Hashable, Iterator, TypeVar

K = TypeVar('K', bound=Hashable)  # these are "variables"
V = TypeVar('V')  # these are "values"
Assignments = dict[K, V]
Constraint = Callable[[Assignments[K, V]], bool]

@dataclass
class KProperties(Generic[K, V]):
    domain: list[V]
    constraints: list[Constraint[K, V]]


@dataclass
class Problem(Generic[K, V]):
    map: dict[K, KProperties[K, V]] = field(default_factory=dict)

    def add_variable(self, k: K, domain: list[V]) -> None:
        self.map[k] = KProperties(domain=domain, constraints=[])

    def add_constraint(self, k: K, constraint: Constraint[K, V]) -> None:
        self.map[k].constraints.append(constraint)


def yield_solutions(problem: Problem[K, V]) -> Iterator[Assignments[K, V]]:
    q: list[Assignments[K, V]] = [{}]
    while q:
        assignments = q.pop()
        for local in _possible(problem, assignments):
            if set(problem.map) - set(local):  # if any unassigned
                q.append(local)
            else:
                yield local


def _possible(problem: Problem[K, V], assignments: Assignments[K, V]) -> Iterator[Assignments[K, V]]:
    def key(v: K) -> tuple[int, int]:
        return -len(problem.map[v].constraints), len(problem.map[v].domain)

    unassigned = [k for k in problem.map if k not in assignments]
    if not unassigned:
        return []
    # pick k with the (highest number of constraints, smallest domain)
    k = sorted(unassigned, key=key)[0]
    for v in problem.map[k].domain:
        local = {**assignments, k: v}
        if all(constraint(local) for constraint in problem.map[k].constraints):
            yield local`),
    m("p"),

    m("hr"),
    m("p", "Interestingly, we can generate arbitrary completed sudokus like:"),
    python(`next(solutions([[0] * 9] * 9))`),


])
