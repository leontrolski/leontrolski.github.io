#!/bin/bash

trim() {
    local str="$*"
    str="${str#"${str%%[![:space:]]*}"}"
    str="${str%"${str##*[![:space:]]}"}"
    printf '%s' "$str"
}

escape-html() {
    sed -e "s/&/\&amp;/g" -e "s/</\&lt;/g" -e "s/>/\&gt;/g"
}

article-title() {
    local f="$1"
    local title_html
    title_html="$(sed -n '\:<h1>.*</h1>:p' "$f" | head -n 1)"
    local TITLE_REGEX='<h1>(.*)</h1>'
    if [[ "$(trim "$title_html")" =~ $TITLE_REGEX ]]
    then
        local title="${BASH_REMATCH[1]}"
        echo "$title"
    fi
}

article-date() {
    local f="$1"
    local date
    date="$(git log -1 --format='%ad' --date=rfc2822-local "$f")"
    echo "$date"
}

article-body() {
    local f="$1"
    sed -n '/<body.*>/,/<\/body>/p' "$f"
}

gen-item() {
    local f="$1"
    local title
    local date
    title="$(article-title "$f" | escape-html)"
    date="$(article-date "$f")"
    local link="https://leontrolski.github.io/$f"
    if [ -z "$title" ]
    then
        return
    fi
    cat <<EOF
        <item>
            <title>$title</title>
            <pubDate>$date</pubDate>
            <link>$link</link>
            <guid>$link</guid>
            <description>
$(article-body "$f" | escape-html)
            </description>
        </item>
EOF
}

gen-rss() {
    cat <<EOF
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Leon Trolski</title>
        <description>The website of Leon Trolski</description>
        <link>https://leontrolski.github.io</link>
        <atom:link href="https://leontrolski.github.io/leontrolski.rss" rel="self" type="application/rss+xml" />
        <image>
            <title>Leon Trolski</title>
            <url>https://leontrolski.github.io/pic.png</url>
            <link>https://leontrolski.github.io</link>
        </image>
$(for f in *.html; do gen-item "$f"; done)
    </channel>
</rss>
EOF
}

gen-rss > leontrolski.rss
