# hades

A native macOS desktop app for managing SSH host aliases. Built on the [`sshconfig`](https://github.com/revagomes/sshconfig) library.

![Electron](https://img.shields.io/badge/Electron-39-47848F?logo=electron) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## Features

- **Full CRUD** — add, edit, and remove SSH host aliases from a native GUI
- **Group filtering** — sidebar groups aliases by dot-suffix (e.g. `server.work` → group `work`)
- **Native key file picker** — browse for `IdentityFile` paths via the OS file dialog
- **Auto-init** — creates `~/.ssh/config.d/` on first launch if it doesn't exist
- **Atomic config rebuild** — every change rewrites `~/.ssh/config` safely via the `sshconfig` library

## How it works

hades reads from and writes to `~/.ssh/config.d/` — one file per alias. On every add, edit, or remove it atomically rebuilds `~/.ssh/config` from those files. The renderer process is fully sandboxed; all filesystem access goes through a typed IPC bridge backed by the `sshconfig` library in the main process.

## Requirements

- macOS (Linux build available, Windows not tested)
- Node.js ≥ 18

## Development

```bash
npm install
npm run dev       # start in dev mode with hot reload
npm test          # run all tests (44 tests, Vitest)
npm run build:mac # build distributable .dmg
```

## Architecture

```
src/
  main/
    index.ts      # BrowserWindow, app lifecycle
    ipc.ts        # IPC handlers — all sshconfig calls live here
    handlers.ts   # Pure handler functions (dependency-injected, unit-tested)
  preload/
    index.ts      # contextBridge — exposes typed window.sshconfig API
  renderer/
    src/
      App.tsx
      components/ # GroupFilter, HostList, HostForm, KeyFilePicker, ErrorToast
      store/      # Zustand store (useShellStore)
      lib/        # parser.ts (SSH config ↔ SshHost), types.ts
      test/       # Vitest + React Testing Library
  test/
    handlers.test.ts
```

Three-process model: main process owns all I/O, preload exposes a typed bridge, renderer is a sandboxed React app with zero Node.js access.

## Stack

| Concern | Choice |
|---|---|
| Desktop runtime | Electron 39 |
| Build | electron-vite |
| UI | React 19 + Tailwind CSS + shadcn/ui |
| State | Zustand |
| SSH backend | [`sshconfig`](https://github.com/revagomes/sshconfig) |
| Tests | Vitest + React Testing Library |
| Language | TypeScript |

## Related

- [`sshconfig`](https://github.com/revagomes/sshconfig) — the Node.js library hades uses as its backend
