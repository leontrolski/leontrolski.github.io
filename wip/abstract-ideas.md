# Against Abstract Ideas

In software, in the broader world, in our own lives, we have problems to surmount and projects to build. It's tempting to rely on lofty abstract ideas to think about how we achieve these goals, instead, choose the concrete.

Is this just a rubbish rehashing of some Popper?

## Definitions

What is an "abstract idea" as opposed to a "concrete" one? It's tempting otherwise to choose "abstract" ideas as simply "ideas one disagrees with". Our definition should aim for [falsifiability](https://en.wikipedia.org/wiki/Karl_Popper#Philosophy_of_science) and avoid true Scotsmen.

Example abstract idea
- This quality
- This quality
Example concrete idea
- This quality
- This quality

How do we avoid filing useful ideas into the former category? Are maths and phsyics not abstract? And vice versa, are there not useful theories in sociology and literary criticism?

# Software

## Low level

[OO](cmd-click-manifesto.html)
Take a single function definition, here

```python
def do_something(data, f: Callable[...]):
    f(data)  # I can't CMD-click f
```

```python
def do_something(data):
    if data.kind == Kind.A:
        g(data)  # I can CMD-click g
    ...
```

Is [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) some rephrasing of Popper?


## Architecture level

Scalability

Design patterns
Agile coaches

I've spent some time trying to [drill into the concrete weeds](manipleservices.html) of microservices, this is the kind of approach should take...

[Async](https://techspot.zzzeek.org/2015/02/15/asynchronous-python-and-databases/)
[Micro](https://danluu.com/simple-architectures/).
Linked meters, state machines

# Philosophy

Flicking through [A History of Western Philosophy](https://en.wikipedia.org/wiki/A_History_of_Western_Philosophy), amongst the concrete ethics, moral, political and analytic philosophy, there's an awful lot of [abstract metaphysics](https://en.wikipedia.org/wiki/Metaphysics#Criticism) - much of this is of the [Ship of Theseus variety](https://en.wikipedia.org/wiki/Ship_of_Theseus). We know from writing software that categorizing and defining things is always [ephemeral](Rich Hickey simple link), and only as _true_ as it is _useful_ for the problem at hand.


Let's compare two passages about a classic problem of philosophy - the nature of [consciousness](consciousness.html).

> In immediate self-consciousness the simple ego is absolute object, which, however, is for us or in itself absolute mediation, and has as its essential moment substantial and solid independence. The dissolution of that simple unity is the result of the first experience; through this there is posited a pure self-consciousness, and a consciousness which is not purely for itself, but for another, i.e. as an existent consciousness, consciousness in the form and shape of thinghood. Both moments are essential, since, in the first instance, they are unlike and opposed, and their reflexion into unity has not yet come to light, they stand as two opposed forms or modes of consciousness. [etc, etc].

[Hegel in The Phenomenology of Spirit](https://en.wikiquote.org/wiki/Georg_Wilhelm_Friedrich_Hegel#The_Phenomenology_of_Spirit_(1807)) - never one for [Orwell's 6 rules](https://sites.duke.edu/scientificwriting/orwells-6-rules/).


...


> I use the term consciousness inclusively. It refers both to the information about which I am aware and to the process of being aware of it. In this scheme, consciousness is the more general term and awareness the more specific. Consciousness encompasses the whole of personal experience at any moment, whereas awareness applies only to one part, the act of experiencing. [...] How knowledge can be encoded in the brain is not fundamentally mysterious, but how we become aware of the information is. Whether I am aware of myself as a person, or aware of the feel of a cool breeze, or aware of a color, or aware of an emotion, the awareness itself is the mystery to be explained, not the specific knowledge about which I am aware.

[Graziano in Consciousness and the Social Brain](https://www.amazon.co.uk/Consciousness-Social-Brain-Michael-Graziano/dp/0190263199)




# Politics

Here's Marx (admittedly on a bad day) defining communism in the abstract:

> Communism is the genuine resolution of the antagonism between man and nature and between man and man; it is the true resolution of the conflict between existence and essence, objectification and self-affirmation, freedom and necessity, individual and species. It is the riddle of history solved and knows itself as the solution.

[Marx](https://en.wikiquote.org/wiki/Karl_Marx#Economic_and_Philosophic_Manuscripts_of_1844).

Similarly to the Hegel, there is some cutesy self-reference at the end, but it's hard to know what to make of this passage, let alone how one should act upon it. Drilling down, there is only further abstraction - how to define "essence" in this context?

Another Karl ([Popper](https://en.wikipedia.org/wiki/Karl_Popper)) is best known for his philosophy of science - good scientific theories are those that are concretely refutable, bad theories contort themselves to accomodate all new evidence. He applies this same method of thinking to politics - good politics is the piecemeal fixing of concrete problems, bad politics is revolution in the aim of abstract utopian ideas.

> The Utopian politician may present his case in the following way: "We must determine our ultimate political aim, the Ideal State, before taking any political action whatever. Only when this ultimate aim is determined, in broad outlines at least, only when we are in the possession of something like a blueprint of the society at which we aim, only then can we consider the best ways and means of its realization [...]". This is in brief the approach [...] of the Utopian social engineer. It is convincing and attractive; but this makes it in my opinion only the more dangerous, and its criticism the more imperative.

[Karl Popper](popper-reality.html)


# Day-to-day

"I'm not X kind of person".
Theories of mind/body.

# Wrapping Up

???
