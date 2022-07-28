import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "cycling-in-london.html"
const title = "cycling in London"
const h1 = "Cycling in London for beginners"

const img = (src, href) => m("p.img-cycling-container",
    m("img.img-cycling", {src: src}),
    m("br"),
    m("small", m("a", {href: href}, "source")),
)

export default page(title, h1, [
    m("style", `
        .img-cycling-container{padding:4rem;}
        .img-cycling{width:40vw;box-shadow: 0px 0px 4px 2px #00000045;}
        @media screen and (max-width: 800px){.img-cycling{width:85vw;}}
        @media screen and (max-width: 800px){.img-cycling-container{padding:0;}}
    `),
        m("em",
          [
            "A compilation of tips for people considering/just starting cycling in London. If you want to make a friend and get advice from a real person, try London Cycle Campaign's ",
            m("a", {"href":"https://lcc.org.uk/groups/cycle-buddies/"}, 
              "free buddy scheme"
            ),
            "."
          ]
        ), 
        m("p", 
          "This page is split into the following sections:"
        ), 
        m("ul",
          [
            m("li", 
              m("a", {"href":"#why"}, 
                "Why"
              )
            ),
            m("li", 
              m("a", {"href":"#navigating"}, 
                "Navigating"
              )
            ),
            m("li", 
              m("a", {"href":"#staying-safe"}, 
                "Staying safe"
              )
            ),
            m("li", 
              m("a", {"href":"#getting-a-bike"}, 
                "Getting a bike"
              )
            ),
            m("li", 
              m("a", {"href":"#locking-it-up"}, 
                "Locking it up"
              )
            ),
            m("li", 
              m("a", {"href":"#being-nice"}, 
                "Being nice"
              )
            )
          ]
        ), 
        m("h2#why", 
          "Why?"
        ), 
        m("ul",
          [
            m("li",
                m("b", "Quicker"), " - Door-to-door times will tend to be quicker than any other mode of transport. Think half an hour for most Zone 1 and 2 journeys."
            ),
            m("li",
                m("b", "Cheaper"), " - Obvious, but worth running the numbers on your regular tube/bus journeys vs the cost of bike ownership, you'll probably save a lot of money."
            ),
            m("li",
                m("b", "More pleasant"), " - Cramming yourself on a busy tube sucks, get out in the open! Also, there's far less heavy rain than you might expect - I probably don my rain jacket 5 times a year."
            ),
            m("li", 
              m("b", "Get to know the city"), " - After a few months cycling, central London feels a lot smaller, it feels great to know little cut-throughs between places, notice new shops opening, see people you recognise etc."
            ),
            m("li",
                m("b", "Healthy"), " - It's a ",
                m("a", {"href":"https://www.theguardian.com/environment/bike-blog/2017/sep/17/the-miracle-pill-how-cycling-could-save-the-nhs"}, "'miracle pill'"),
                "."
            )
          ]
        ), 
        m("h2#navigating", 
          "Navigating"
        ), 
        m("p",
            "If you're not in a mad hurry, there are many bits of cycle infrastructure in London that are far more pleasant and safe than the obvious roads. Let's use the example of a journey from Liverpool Street to Angel."
        ), 
        m("p", 
          "Here is Google maps - it will tend to send you direct on busy roads:"
        ), 
        m("p", 
          img("images/cycling/google-maps.png", "https://www.google.com/maps")
        ), 
        m("p",
            "In comparison, ",
            m("a", {"href":"https://cycle.travel"}, 
              "cycle.travel"
            ),
            " sends you on nice cycle infrastructure, it will take a bit more brain power to navigate, but definitely worth it for a regular journey:"
        ), 
        m("p", 
          img("images/cycling/cycle-travel.png", "https://cycle.travel/map?from=London%20Liverpool%20Street&to=Angel&fromLL=51.518043,-0.0817735&toLL=51.5318417,-0.1057137")
        ), 
        m("p", 
          "cycle.travel has a pretty rubbish UI, but you can treat this as an opportunity to learn the nice cycle lanes 🙂."
        ), 
        m("p",
            "To give a flavour of the extent of London's bike paths, here's a section of a (now outdated) cyclist's tube map:",
        ), 
        m("p", 
            img("images/cycling/cycle-tube-map.png", "https://londoncyclenetwork.files.wordpress.com/2017/04/london-cycle-map-e28093-revised-2017-v1-4-1.pdf")
        ), 
        m("h2#staying-safe", 
          "Staying safe"
        ), 
        m("p", 
          "Tips on staying safe:"
        ), 
        m("ul",
            m("li",
                "Be super-duper careful around trucks - considering how few of them there are, a crazy high proportion of bad cycling accidents involve them. ",
                m("ul",
                    m("li",
                        "Don't undertake them. "
                    ),
                    m("li",
                        "Don't plonk yourself right in front of them at the lights."
                    )
                )
            ),
            m("li",
                "Assume everyone else is going to do something dumb at any moment:",
                m("ul",
                    m("li",
                        "If a car is pulling out of a side road, until you've caught their eye, assume they haven't seen you and will pull out any second."
                    ),
                    m("li",
                        "If you're cycling near parked cars, leave a door's width."
                    ),
                    m("li",
                        "If it looks like someone's about to walk into the middle of the road without looking, they probably will."
                    )
                )
            ),
            m("li",
                "Consciously make yourself aware of your surroundings:",
                m("ul",
                    m("li",
                        "Don't wear headphones."
                    ),
                    m("li",
                        "If you're overtaking and there's a gap in traffic, it's likely someone will pull out of a side street into said gap."
                    ),
                    m("li",
                        "Look over your shoulder every few seconds to get a feel of what's around."
                    )
                )
            ),
            m("li", 
              "Take your time - most near misses I see are bikes trying to squeeze through little gaps to shave 3 seconds off their commute."
            )
        ), 
        m("h2#getting-a-bike", 
          "Getting a bike"
        ), 
        m("p",
            "I've heard great things about ",
            m("a", {"href":"https://swapfiets.co.uk/london"}, 
              "Swapfiets"
            ),
            ". You pay monthly and it comes to about £200 a year. The bikes have lights, locks and mudguards built in. If it breaks, they come fix it. If it gets stolen, you pay a small fee for a new one. Simple!"
        ), 
        m("p",
            "After a year or so, you might realise you want to buy your own bike that's quicker/will carry more stuff/will handle ",
            m("a", {"href":"/cycling.html"}, 
              "longer trips"
            ),
            ", you can cross that bridge when you get there."
        ), 
        m("p", 
          "My experience with Boris bikes (Kencycles?)/dockless schemes is that the bikes are cumbersome and the parking faffy. Just get the Swapfiets."
        ), 
        m("h2#locking-it-up", 
          "Locking it up"
        ), 
        m("p", 
          "Personal advice would be:"
        ), 
        m("ul",
            m("li",
                "Get a ",
                m("a", {"href":"https://mobil.abus.com/int/on-road/Highlights/BORDO/Folding-Locks"}, 
                  "folding style"
                ),
                " lock, these are fairly light, fit around most stuff and I've not had a bike knicked while using one for many years 🤞."
            ),
            m("li", 
              "Lock inside where possible (if you work in an office, there will likely be a safe place)."
            ),
            m("li",
                "Some councils have 'cycle hangars' if you don't have storage at home - ",
                m("a", {"href":"https://hackney.gov.uk/cycle-safety-and-security"}, 
                  "Hackney"
                ),
                " in particular seems good for this."
            ),
            m("li",
                "Simply don't have your regular bike be something flashy and expensive."
            )
        ), 
        m("p",
            "My friend Cal did a nice writeup on ",
            m("a", {"href":"https://calpaterson.com/bicycle-threat-model.html"}, 
              "bicycle security"
            ),
            " if you want a longer read."
        ), 
        m("h2#being-nice", 
          "Being nice"
        ), 
        m("p",
            "Don't be that city-boy MAMIL boshing up Bishopsgate shouting at pedestrians. Take your time, give big thumbs up to nice drivers, give priority to pedestrians, whistle as you ride."
        )
])
