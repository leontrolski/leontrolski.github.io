import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "sane-config.html"
const title = "stop doing mad config"
const h1 = ["Stop doing mad config"]

export default page(title, h1, [
    m("p", "People do all sorts of wild and wonderful things in Python to get configuration from files/the environment, then even stranger things attaching said config to applications."),
    m("p", "Here's how everyone should do it, in a way that's (in vague order of importance):"),
    m("ul",
        m("li", "Easy to test."),
        m("li", "Can be used from web apps, cron jobs, message processors, you name it."),
        m("li", "Well typed."),
        m("li", "Simple and well-understood."),
        m("li", "Quick."),
    ),
    python(`from dataclasses import dataclass
from functools import lru_cache
import os
from pathlib import Path


@dataclass
class Config:
    DB_URL: str
    NUMBER_OF_WORKERS: int
    COMPLICATED_THING: dict


@lru_cache(None)
def get_config() -> Config:
    complicated_path = Path(__file__).parent / "some-file.json"
    return Config(
        DB_URL=os.environ["DB_URL"],
        NUMBER_OF_WORKERS=int(os.environ.get("N_WORKERS", 4)),
        COMPLICATED_THING=json.loads(complicated_path.read_bytes()),
    )`),
    m("p", "When you want to use it, do:"),
    python(`from my_service import config

def create_application():
    engine = Engine(url=config.get_config().DB_URL)
    ...`),
    m("p", "When you want to test it, do:"),
    python(`@pytest.fixture
def dummy_config(monkeypatch):
    monkeypatch.setattr(config, "get_config", lambda: Config(...))

def test_thingie(dummy_config):
    ...`),
    m("p", "Now no more funny stuff OK."),
])