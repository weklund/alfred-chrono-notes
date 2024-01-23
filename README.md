# alfred-chrono-notes
Alfred Workflow for easy access to your Obsidian Periodic Notes.

## Getting Started

### Requirements
1. [node>=13](https://nodejs.org/en/download)
1. [npm>=6.12](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
1. [Obsidian](https://obsidian.md/)
1. [Periodic Notes Plugin](https://github.com/liamcain/obsidian-periodic-notes)


## TODOS

- [x] Current Day flow
- [x] Next Day flow
- [x] Current Week flow
- [x] Next Week flow
- [ ] Unit Tests
- [ ] Basic Configuration builder for Env Vars setup
- [ ] https://semantic-release.gitbook.io/semantic-release/
- [ ] Update Readme for users
- [ ] Check for Periodic Notes plugin install
- [ ] Generic configuration loader 
  - Configuration builder builds Environment Variables
  - Configuration builder pulls from Periodic Notes plugin
- [ ] Support any date format
- [ ] Pull date format from plugin
- [ ] Periodic Note Plugin: Pull enabled interval types
- [ ] Design generic source of truth for config (Instead of tight coupling with Periodic Notes plugin)
- [ ] Validate configuration values in entrypoint.ts
- [ ] Make action design generic enough that it's only one file that handles
  - interval (day/week), 
  - context?(current/next/previous)
  - interval date format token (yyyy m dd)