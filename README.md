# PedroNauta

A personal blog by [Pedro Vieira](https://github.com/pedro-vlps), built to share
what I learn, document projects, and reflect on software development alongside
my interests in investing, games, and football.

## Why I built it

I wanted a place of my own to turn studies and experiences into something I
could revisit and share. Writing about what I learn helps me organize ideas,
explain technical decisions, and keep a record of how my thinking develops.

Building the blog also gives me a practical product to improve over time:
from the reading experience and content workflow to testing and deployment.
It serves as an initial experiment in AI-assisted development, with explicit
code guidelines and human approval of commits.

## The reading experience

The interface is designed around finding and reading posts:

- A chronological archive grouped by year and month, with category filters.
- Post summaries with titles, subtitles, dates, and topic tags.
- Individual reading pages with shareable links and formatted code examples.
- Responsive layouts, keyboard navigation, and light and dark themes.

The blog's interface and current posts are in Brazilian Portuguese.

## Technical decisions

**Content lives with the code.** Posts are Markdown files with YAML metadata,
reviewed and tracked in Git. A Node.js script validates the content and generates
post data before the application is built. This keeps publishing straightforward
without requiring a separate content management service.

**A static architecture fits the product.** React provides the interface, while
posts are bundled at build time. There is no runtime API or database to maintain
for a site whose primary purpose is publishing and reading articles.

**Quality checks cover behavior and content.** Jest and Testing Library cover
navigation, category filters, post rendering, and theme preferences. Node.js tests
cover content validation and Markdown generation.

**Production has a dedicated runtime.** A multi-stage Docker build compiles the
application with Node.js and serves the resulting static files through Nginx.
The runtime supports a configurable port for hosting environments such as Railway.

## Stack

React · JavaScript · CSS · Markdown · YAML · Node.js · Jest · Testing Library · Docker · Nginx

## About the author

I'm Pedro Vieira, a developer who has been programming since 2021. This project
brings together my interest in building software, sharing knowledge, and exploring
how AI can support development while keeping technical decisions under human review.

Explore my work and get in touch through [my GitHub profile](https://github.com/pedro-vlps).
