import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "cycling.html"
const title = "cycling in the south east"
const h1 = "Cycling day-trips from Central London"

const img = (src, href) => m("p",
    m("img.img-cycling", {src: src}),
    m("br"),
    m("small", m("a", {href: href}, "source")),
)

export default page(title, h1, [
    m("style", `
        .img-cycling{width:40vw;}
        @media screen and (max-width: 800px){.img-cycling{width:85vw;}}
    `),

    m("p", "I like to go on one-day cycling trips on the weekend, both road bike and mountain bike. My priorities are:"),
    m("ul",
        m("li", "Nice countryside"),
        m("li", "Steep hills"),
        m("li", "Low traffic"),
        m("li", "Not too long to get to from central London by train"),
        m("li", "Gnar-y gnar (for the mountain bike trips)"),
    ),


    m("p", "Having done tens (hundreds?) of these trips, I thought I'd summarise the best places to go for people that share my priorities. The destinations are somewhat ordered from best to worst."),

    m("br"),

    m("p", "Firstly though, here's why you should invest in an Ordnance Survey subscription for decent route planning. Here's a semi-random bit of countryside near Sevenoaks in Google maps:"),
    img("images/cycling/google.png", "https://maps.google.com"),
    m("p", "And the same area in 1:50,000 Ordnance survey:"),
    img("images/cycling/os.png", "https://explore.osmaps.com/"),
    m("p", "Let's consider all the useful things we can now see:"),
    m("ul",
        m("li", "A much better idea of how busy the roads are going to be."),
        m("li", "Where the hills are and how steep there are."),
        m("li", "Bridleways (thick dashed green lines) - throw your roadbike down these - could be a smooth farm track, could be a muddy ditch. Roll the dice."),
        m("li", "All the pubs (PH)."),
        m("li", "Where the big blue ducks are."),
    ),

    m("br"),
    m("p", "Now, on to the destinations..."),

    m("h2", "Road"),
    m("h3", "Western Chilterns"),
    m("p", "Easily the nicest countrside in the South East, rolling hills, nice villages, sheep, tiny low-traffic gravel-strewn roads."),
    img("images/cycling/hambleden.jpeg", "https://thecuriouspixie.com/chiltern-hills-hambleden-valley/"),
    m("p", "Most people that visit the Chilterns seem to go around the Tring area - avoid this bit - the roads are busier and the countryside is pretty meh. Stick to the area west of Marlow/north of Henley, you won't regret. Bridleways are pretty dull on a mountain bike, but fun on a road bike - although they can turn to chalky mush if it's been raining."),
    m("p", "Rail options:"),
    m("ul",
        m("li", "Take the weirdo back route out of High Wycombe. Trains take less than half an hour from Marylebone and are frequent.", m("a", {href: "https://explore.osmaps.com/route/11738569/high-wycombe-v2"}, "Example route.")),
        m("li", "If you want to get straight in on the action, wait for a Saunderton train (also from Marylebone), these are much slower/less frequent though.", m("a", {href: "https://explore.osmaps.com/route/6622506/saunderton-v5-some-bridez"}, "Example route.")),
        m("li", "If you're near Paddington, you're best either changing for Marlow, or taking the cookie National Cycle Network route out of Maidenhead.", m("a", {href: "https://cycle.travel/map/journey/300203"}, "cycle.travel route."), "This will become slightly more practical when full Crossrail finally drops."),
    ),

    m("h3", "North Downs near Sevenoaks"),
    m("p", "Quick and frequent access from London Bridge, monster hills (for the south east of England), minimal traffic if you plan well. What's not to like?"),
    img("images/cycling/ide-hill.jpeg", "https://anerleybc.org/tuesday-ride-16th-october-2018/"),

    m("p", "The North Downs ridge just west of Sevenoaks has the best climbs, famous hills include:"),
    m("ul",
        m("li", "Toys hill - I think the biggest bottom to top, lovely steep bit at the end."),
        m("li", "York's hill - super duper steep gravelly mess of a road."),
        m("li", "Ide hill - nice swoopy descent, great pub up top to get a coke in the summer."),
    ),
    m("p", "Around Chiddingstone, Hever and Penshurst is nice quiet riding. Go too far from there and the roads get busier. The High Weald may look tempting, but is pretty crap for cycling as there are basically just a few nasty B roads that cross it. Tunbridge Wells is a lovely town and the valley to the west of it is really cute."),
    m("p", "A nice way to see the a big chunk of the area is to ", m("a", {href: "https://explore.osmaps.com/route/11153702/tonbridge-to-sevenoaks-v1"}, "ride from Tonbridge to Sevenoaks.")),



    m("h3", "Surrey Hills"),
    m("p", "Do you like suspiciously clean bikes and stupid sunglasses? Perfect, the Surrey Hills are for you."),
    img("images/cycling/sunglasses.jpeg", "https://guides.wiggle.co.uk/cycling-eyewear-buying-guide"),
    m("p", "After you've been overtaken by some weekend warriors on Box Hill, there are plentiful climbs on both the North Downs ridge and the main Surrey Hills ridge. The former being slightly less well trodden 'classic English countryside', the latter a pine-covered sandy ridge with some pretty villages. There's a fair amount of traffic here versus the rest of the list, both vehicular and other bikes (there really are a lot a lot of roadies)."),
    m("p", "Get a train to Guildford or Dorking (quick and frequent), or if you don't mind sitting for ages, a chugger to Westhumble to get straight in on the action.", m("a", {href: "https://explore.osmaps.com/route/11153702/tonbridge-to-sevenoaks-v1"}, "Example loop from Guildford.")),


    m("h3", "South East Kent"),
    m("p", "Check out ", m("a", {href: "https://cycle.travel"}, "cycle.travel"), " for the National Cycle Network routes (all pretty flat, but often quiet). Routes around Canterbury in particular make an easy summer's day out and can be combined with plenty of local cider. HS1 is quick (it's all in the name) and surprisingly you can just throw your bike on."),

    m("h3", "Around Salisbury"),
    m("p", "Lots of historical villages, hill forts etc. plus Salisbury itself is lovely. Countryside/cycling-wise though, good as a one-off, but too far for what you get in return."),

    m("h3", "Essex, Hertfordshire"),
    m("p", "Too flat, often way more traffic than you'd expect (excepting some of the National Cycle Network routes)."),

    m("br"),
    m("br"),
    m("h2", "Mountain Bike"),

    m("h3", "Peaslake (Surrey Hills)"),
    m("p", "As far as I know, the only really good purpose-built trails in the south east (forget Swinley forest - it's way too flat). Look on Trailforks for routes, but also try trudging through Strava segments - things change fast and there's lots of secret bits."),
    img("images/cycling/peaslake.jpeg", "https://www.mbr.co.uk/mountain-bike-routes/south-east-england/surrey-hills-gps-route-download-2-324674"),
    m("p", "Get the train to Guildford or Dorking (both pretty frequent and quick) and take whatever bridleways you fancy - they're all prety decent. If you want a big day out, do one to the other, joining up trails. For some reason, the ticket inspectors seem happy if you have a return to either station."),

    m("h3", "Cwmcarn (Wales)"),
    m("p", "Definitely not in the South East, but Newport is only 1 hour 40 away from Paddington (although you have to book bike slots), so it's feasible to do a day trip. Cwmcarn has two really excellent and long purpose-built trails, you can ride to the start and do both in 5-7 hours. There's also some off-piste stuff (trawl through Strava segments)."),
    img("images/cycling/cwmcarn.jpeg", "https://www.mbuk.com/trails/cwmcarn/"),
    m("p", "From Newport to the trails is around an hours ride - either a nice ride along the canal or straight up into the woods from the Cwmbrân side - both are very pleasant!"),

    m("h3", "Olympic-Park MTB track, Stratford"),
    m("p", "About 20 minutes of medium level fun to be had - always more knackering than I remember. There are two parts to it - not just the bit directly next to the Velodrome!"),

    m("h3", "South Downs"),
    m("p", "You can get Thameslink to Hassocks and ride to the south downs within 15 minutes. Bridleways in the area are OK, but maybe a bit tame - maybe this is what they came up with gravel bikes for? Doing the whole of the South Downs Way (Winchester to Eastbourne) is a very long day - maybe one for the bucket list. I've done a big chunk of it and there are  nice views + it was super cool to not really do any roads for a whole day."),


])
