# alfred-chrono-notes
Alfred Workflow for easy access to your Obsidian Periodic Notes.

## Getting Started

### Requirements
1. [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. [Obsidian](https://obsidian.md/)
3. [Periodic Notes Plugin](https://github.com/liamcain/obsidian-periodic-notes)


## TODOS

- [x] Current Day flow
- [x] Next Day flow
- [x] Current Week flow
- [x] Next Week flow
- [ ] Unit Tests
- [ ] Check for Periodic Notes plugin install
- [ ] Generic configuration loader 
  - Configuration builder builds Environment Variables
  - Configuration builder pulls from Periodic Notes plugin
- [ ] Pull date format from plugin
- [ ] Support any date format
- [ ] Periodic Note Plugin: Pull enabled interval types
- [ ] Design generic source of truth for config (Instead of tight coupling with Periodic Notes plugin)
- [ ] Validate configuration values in entrypoint.ts
- [ ] Make action design generic enough that it's only one file that handles
  - interval (day/week), 
  - context?(current/next/previous)
  - interval date format token (yyyy m dd)