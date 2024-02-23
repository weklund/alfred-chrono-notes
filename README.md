# alfred-chrono-notes [![CI](https://github.com/weklund/alfred-chrono-notes/actions/workflows/tests.yml/badge.svg)](https://github.com/weklund/alfred-chrono-notes/actions/workflows/tests.yml) [![Coverage Status](https://coveralls.io/repos/github/weklund/alfred-chrono-notes/badge.svg?t=2QlVvG)](https://coveralls.io/github/weklund/alfred-chrono-notes) ![GitHub License](https://img.shields.io/github/license/weklund/alfred-chrono-notes)

Alfred Workflow for easy access to your Obsidian Periodic Notes.

## Getting Started

### Requirements

1. [node>=13](https://nodejs.org/en/download)
1. [npm>=6.12](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
1. [Obsidian](https://obsidian.md/)
1. [Periodic Notes Plugin(Optional)](https://github.com/liamcain/obsidian-periodic-notes)

## How Alfred Chrono Notes works

### What makes up a ChronoNote?

#### Intervals

- Daily
- Weekly
- Monthly
- Quarterly
- Annually

#### Ordinal

- Current
- Next
- Previous

### Date Format Tokens

https://moment.github.io/luxon/#/formatting?id=table-of-tokens

### Testing

There are unit tests, but there currently isn't a way to an integrate test with an alfred environment. All PRs need to have a screenshot or gif of it working
