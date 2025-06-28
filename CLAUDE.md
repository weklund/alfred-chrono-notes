# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Alfred Workflow for macOS that provides quick access to Obsidian periodic notes (daily, weekly, monthly, quarterly, and annual notes). The workflow is built in TypeScript and compiles to JavaScript in the `workflow/` directory for Alfred to execute.

## Architecture

The codebase follows a clean architecture pattern with dependency injection:

- **Entrypoint.ts**: Main workflow handler that orchestrates the entire flow
- **ChronoNote**: Core domain model representing time-based notes with intervals (Daily, Weekly, Monthly, Quarterly, Annually) and ordinals (Current, Next, Previous)  
- **ConfigProvider**: Handles environment variable configuration with a driver pattern
- **FileProvider**: Manages file system operations with security validation
- **Custom Exceptions**: Specific exception types for different failure scenarios

The workflow uses Luxon for date manipulation and the `open` package to launch Obsidian URLs.

## Development Commands

### Package Management
- `bun install` - Install dependencies using Bun
- `bun install --frozen-lockfile` - Install dependencies with exact versions

### Build and Development
- `bun run build` - Compile TypeScript to JavaScript in workflow/ directory
- `bun run dev` - Watch mode compilation with TypeScript
- `bun tsc` - Direct TypeScript compilation via Bun

### Testing
- `bun test` - Run test suite using Bun's built-in test runner
- `bun run coverage` - Run tests with coverage report
- Tests ignore the `workflow/` directory and require 90% coverage thresholds

### Code Quality
- `bun run lint` - Run ESLint via Bun
- `bun run fix-lint` - Run ESLint with auto-fix via Bun
- `bun run check-format` - Check Prettier formatting via Bun
- `bun run format` - Apply Prettier formatting via Bun

### Alfred Workflow Management
- `bun run postinstall` - Initialize Alfy (Alfred workflow helper)
- `bun run preuninstall` - Cleanup Alfy configuration

## Configuration

The workflow uses environment variables for configuration, prefixed by interval type:
- `{INTERVAL}_FILE_FORMAT` - Luxon date format token for file names
- `{INTERVAL}_FOLDER_PATH` - Path to the folder containing notes  
- `{INTERVAL}_TEMPLATE_PATH` - Path to the template file for new notes
- `OBSIDIAN_VAULT_NAME` - Name of the Obsidian vault

Example: `DAILY_FILE_FORMAT`, `WEEKLY_FOLDER_PATH`, etc.

## Key Files Structure

- `src/Main.ts` - Application entry point, creates and handles entrypoint
- `src/Entrypoint.ts` - Core workflow logic and Obsidian integration
- `src/Utils/Chrono/ChronoNote.ts` - Time-based note domain model
- `src/Utils/Config/ConfigProvider.ts` - Configuration management with driver pattern
- `src/Utils/File/FileProvider.ts` - File operations with security validation
- `src/Exceptions/` - Custom exception classes for error handling
- `workflow/` - Compiled JavaScript output for Alfred (generated, do not edit)
- `info.plist` - Alfred workflow configuration

## Release Process

### NPM Release Flow
The project uses an automated release process triggered by successful CI runs on the `main` branch:

1. **Trigger**: Code pushed to `main` → CI workflow runs (lint, test, coverage, format)
2. **Release**: If CI succeeds → Release workflow automatically triggers
3. **Versioning**: Semantic Release analyzes conventional commits for version bumps
4. **Build**: `prepublishOnly` runs `bun run build` to compile TypeScript → JavaScript
5. **Publish**: Package published to npm with compiled files only

### Published Package Contents
- `workflow/**/*.js` - Compiled JavaScript (Alfred runtime files)
- `info.plist` - Alfred workflow configuration
- `icon.png` - Workflow icon
- **Note**: Source TypeScript files are NOT published

### Installation Flow
When users install via npm:
1. Package downloads with compiled JS files
2. `postinstall` runs `alfy-init` (registers workflow with Alfred)
3. Alfred can discover and execute the workflow

### Dual Package Nature
This package serves as both:
- **NPM package** - Distributed through npm registry
- **Alfred workflow** - Integrates with Alfred via `info.plist` and `alfy`

The `workflow/` directory contains the runtime JavaScript that Alfred executes, while `src/` contains the development TypeScript source.

## Development Notes

- TypeScript compiles to ESM modules in the `workflow/` directory
- File paths must be validated for security (only user home directory access)
- Environment variables are validated before use
- The workflow creates notes from templates if they don't exist
- All file operations include comprehensive error handling with custom exceptions
- Uses dependency injection pattern for testability