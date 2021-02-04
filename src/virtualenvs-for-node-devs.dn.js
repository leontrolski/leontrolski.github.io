import { page, inline, python, bash, js, html, css } from "./base.dn.js"

export const filename = "virtualenvs-for-node-devs.html"
const virtualenv = inline("virtualenv")
const title = "virtualenvs for Node devs"
const h1 = ["Python ", virtualenv, "s for Node devs"]

export default page(title, h1, [
    m("p", `You've started doing some Python while working with another team, and they've told you to do everything in `, virtualenv,`s as it's the right way. You've also been told Python's packaging system is a bit of a mess, let's try tame it somewhat.`),
    m("p", "We're going to compare ", inline("npm"), ` to the "modern classic" Python equivalent. I'm going to ignore more recent developments like `, m("a", {href: "https://python-poetry.org/"}, "poetry"), " and friends."),

    m("p", "First, do you have the right Python version installed? We're going to use ", m("a", {href: "https://asdf-vm.com"}, "asdf"), " which supports Node, Ruby, Python, etc. Steps to install for me were:"),
    bash(`brew install asdf
echo -e "\\n. $(brew --prefix asdf)/asdf.sh" >> ~/.zshrc
# switch to a new shell window at this point
asdf plugin-add python
asdf install python 3.9.1
asdf global python 3.9.1
which python3  # should give you ~/.asdf/shims/python3
python3 --version # should give you 3.9.1`),
    m("p", "OK, so we've got a Python version that seems sane, let's set up a ", virtualenv, " with the equivalent of ", inline("npm init"), "."),
    bash("python3 -m venv .env"),
    m("p", "We now have a new folder in our current directory called ", inline(".env"), " that contains symlinks to the Python that we just ran:"),
    bash(`.env
├── bin
│   ├── Activate.ps1
│   ├── activate
│   ├── activate.csh
│   ├── activate.fish
│   ├── easy_install
│   ├── easy_install-3.9
│   ├── pip
│   ├── pip3
│   ├── pip3.9
│   ├── python -> python3
│   ├── python3 -> ~/.asdf/installs/python/3.9.1/bin/python3
│   └── python3.9 -> python3
├── include
├── lib
│   └── python3.9
│       └── site-packages
│           ├── __pycache__
│           ├── easy_install.py
│           ├── pip
│           ├── pip-20.2.3.dist-info
│           ├── pkg_resources
│           ├── setuptools
│           └── setuptools-49.2.1.dist-info
└── pyvenv.cfg`),

    m("p", "We could always run ", inline(".env/bin/python"), " or ", inline(".env/bin/pip install flask"), " or whatever, but ", virtualenv, "s come with a special trick file to add ", inline(".env/bin"), " to ", inline("bash"), "'s PATH. Let's run it:"),
    bash("source .env/bin/activate"),
    m("p", "Now everything should be set up. Let's try:"),
    bash(`(.env) ➜ echo $PATH
/Users/user/src/my-special-project/.env/bin:/usr/local/bin:/usr/bin:/bin
(.env) ➜ which python
/Users/user/src/my-special-project/.env/bin/python
(.env) ➜ which pip
/Users/user/src/my-special-project/.env/bin/pip
(.env) ➜ python --version
Python 3.9.1`),
    m("p", "The main difference from ", inline("npm"), " here is we don't have to run anything with ", inline("npm run ..."), " as we've hacked with the PATH."),

    m("h2#installing-stuff", "Installing stuff"),
    m("p", "Let's install ", inline("flask"), ":"),
    bash("pip install flask"),
    m("p", "Now our directory should look like:"),
    bash(`.env
├── bin
│   ├── python -> python3
│   ├── flask
│   └── ...
├── lib
│   └── python3.9
│       └── site-packages
│           ├── click
│           ├── flask
│           └── ...`),
    m("p", "As you can see, ", inline(".env/lib/python3.9/site-packages"), " is a lot like ", inline("node_modules"), ". We can see all the library's files:"),
    bash(`(.env) ➜ ls .env/lib/python3.9/site-packages/flask
__init__.py     _compat.py      cli.py          debughelpers.py json            signals.py      views.py
__main__.py     app.py          config.py       globals.py      logging.py      templating.py   wrappers.py
__pycache__     blueprints.py   ctx.py          helpers.py      sessions.py     testing.py`),

    m("p", "Now, what is the equivalent to the following in a ", inline("package.json"), "?"),
    js(`{
    ...
    "dependencies": {
      "express": "^4.17.1"
    }
}`),
    m("p", "Python is a fair bit different from Node in that only one version of a package can be installed in a ", virtualenv, " at a time. This means you tend to have abstract requirements (that is to say with very limited version pinning) listed in ", inline("setup.py|requirements.in|pyproject.toml"), " and pinned requirements (for testing/deployent if you're working on a service) in a ", inline("requirements.txt"), "."),
    m("p", "You can install a set of requirements with:"),
    bash("pip install -r requirements.txt"),
    m("p", "Or whatever file it is you want to install from. This is the equivalent of ", inline("npm install"), "."),
    m("p", "In terms of pinning requirements in your own project a la ", inline("yarn lock"), " or whatever the flavour of the month is, I've always been a fan of ", m("a", {href: "https://github.com/jazzband/pip-tools"}, "pip-tools"), " - using this means you can safely ignore the last few years of Python packaging excitement and get on with your life."),
])