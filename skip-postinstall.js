#!/usr/bin/env node

// We have to do this because there isn't a good way to skip postinstall during CI, but
// still have access to other scripts

if (!process.env.SKIP_POSTINSTALL) process.exit(1);