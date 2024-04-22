# alfred-chrono-notes [![CI](https://github.com/weklund/alfred-chrono-notes/actions/workflows/ci.yml/badge.svg)](https://github.com/weklund/alfred-chrono-notes/actions/workflows/ci.yml) [![Coverage Status](https://coveralls.io/repos/github/weklund/alfred-chrono-notes/badge.svg?t=2QlVvG)](https://coveralls.io/github/weklund/alfred-chrono-notes) ![GitHub License](https://img.shields.io/github/license/weklund/alfred-chrono-notes) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/9b2850b09fd3468da7569d46ca2d75c2)](https://app.codacy.com/gh/weklund/alfred-chrono-notes/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)[![Release date][release-date-image]][release-url]

Alfred Workflow for easy access to your Obsidian Periodic Notes.

If you use Alfred AND Obsidian as part of your daily work flow, then this is for you! ❇️

### What is a Chrono Note?

If you’re an Obsidian user, chances are you have some form of periodic notes.  You might have a note for your daily tasks, a review for the week, or even taxes to handle every year.  It's difficult to manage and navigate to your notes in Obsidian, with the process of making new notes and applying the right template being just too tedious.

Chrono Notes is a way to navigate to any type of periodic note within 4 keystrokes.  With `ocd`, you can access your daily planner, even if you haven’t created the note for today yet.  Check `opd` to view yesterday’s tasks and avoid repeating them today.  Use `ocw` to review your weekly goals and determine what you can pull from that list.  You’re also curious about how the year is going so far, so you look at annual goals with `ocy`.

With a few simple keystrokes, staying organized becomes a breeze using this approach.  


### Requirements

1. [node>=13](https://nodejs.org/en/download)
1. [npm>=6.12](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
1. [Obsidian](https://obsidian.md/)
1. [Periodic Notes Plugin(Optional)](https://github.com/liamcain/obsidian-periodic-notes)

### Setup

#### Install

```sh
npm install alfred-chrono-notes
```

#### Usage

Here are the default Alfred keywords to open notes in Obsidian, which you can change to your heart's content

**Daily Notes**

`ocd`: Open current (today's) daily note.  

`ond`: Open next (tomorrow's) daily note.  

`opd`: Open previous (yesterday's) daily note.  

**Weekly Notes**

`ocw`: Open current (this week's) weekly note. 

`onw`: Open next (next week's) weekly note. 

`opw`: Open previous (last week's) weekly note. 

**Monthly Notes** 

`ocm`: Open current monthly note. 

`onm`: Open next monthly note. 

`opm`: Open previous monthly note. 

**Quarterly Notes** 

`ocq`: Open current quarterly note.  

`onq`: Open next quarterly note.  

`opq`: Open previous quarterly note. 

**Annual Notes**

`ocy`: Open current annual note.  

`ony`: Open next annual note.  

`opy`: Open previous annual note.  


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



#### Configure

Current onboarding is painful, a better config onboarding is coming soon!

For now, users will onboard their ChronoNote Types by adding environment variables for each Interval:

- FILE_FORMAT
- PATH
- TEMPLATE_PATH

If you are a user of [Obsidian Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes), these should be familiar to you already.

Each of these environment variables will be prefixed by the Interval. For example:

Environment Variable Name:

- `DAILY_FILE_FORMAT`: 'yyyy'
- `DAILY_PATH`: '~/my-obsidian/my-vault/my-daily-folder'
- `DAILY_TEMPLATE_PATH`: '~/my-obsidian/my-vault/my-daily-folder'

![Alfred Environment Variables](./docs/env-var.jpg)

### Testing

There are unit tests, but there currently isn't a way to an integrate test with an alfred environment. All PRs need to have a screenshot or gif of it working

### Future improvements

0. Better onboarding experience

1. Right now you can only open one template for an interval at a time.  Upcoming feature you can you have multiple templates (Like annual goals and annual tax planning) and you select which template within Alfred search bar.

2. Move core business logic to a full Obsidian plugin, and make this Alfred workflow just a pass-through client.

<!-- Links -->

[release-date-image]: https://img.shields.io/github/release-date/weklund/alfred-chrono-notes
[release-url]: https://github.com/weklund/alfred-chrono-notes/releases
