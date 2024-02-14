# alfred-chrono-notes [![CI](https://github.com/weklund/alfred-chrono-notes/actions/workflows/tests.yml/badge.svg)](https://github.com/weklund/alfred-chrono-notes/actions/workflows/tests.yml) [![Coverage Status](https://coveralls.io/repos/github/weklund/alfred-chrono-notes/badge.svg?t=2QlVvG)](https://coveralls.io/github/weklund/alfred-chrono-notes) ![GitHub License](https://img.shields.io/github/license/weklund/alfred-chrono-notes)
Alfred Workflow for easy access to your Obsidian Periodic Notes.

## Getting Started

### Requirements
1. [node>=13](https://nodejs.org/en/download)
1. [npm>=6.12](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
1. [Obsidian](https://obsidian.md/)
1. [Periodic Notes Plugin](https://github.com/liamcain/obsidian-periodic-notes)


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

We have unit tests, but there currently isn't a way to an integrate test with an alfred environment.  All PRs need to have a screenshot or gif of it working

## TODOS

- [x] Current Day flow
- [x] Next Day flow
- [x] Current Week flow
- [x] Next Week flow
- [x] Luxon support
  - [x] Convert moment from periodic notes to luxon date format tokens
  - [ ] Determine whether an env var is using moment or luxon to convert
- [ ] Unit Tests
- [ ] `pnpm dlx depcheck` during ci
- [ ] Race condition on when file doesn't exist?
- [ ] Support any date format
- [ ] Basic Configuration builder for Env Vars setup
- [ ] https://semantic-release.gitbook.io/semantic-release/
- [ ] Update Readme for users
- [ ] Husky for prettier
- [ ] Eslint
- [ ] Check for Periodic Notes plugin install
- [x] Generic configuration loader 
  - Configuration builder builds Environment Variables
  - Configuration builder pulls from Periodic Notes plugin
- [ ] Support user config on locale date format
- [ ] Pull date format from plugin
- [ ] Periodic Note Plugin: Pull enabled interval types
- [ ] Design generic source of truth for config (Instead of tight coupling with Periodic Notes plugin)
- [ ] Validate configuration values in Entrypoint.ts
- [x] Make action design generic enough that it's only one file that handles
  - interval (day/week), 
  - context?(current/next/previous)
  - interval date format token (yyyy m dd)
- [ ] Make an Obsidian plugin that defines your templates (either date based note or misc note template), then have workflow pull that config to make generic mapping of keywords to new note by template
