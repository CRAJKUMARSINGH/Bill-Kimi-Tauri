# Bill Generator Kimi

A modern desktop application for generating and managing bills, built with Tauri, React, and TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

## Getting Started

### Quick Start (Windows)
1. Double-click on `run.bat` in the project root
2. The script will automatically install dependencies and start the application

### Manual Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run tauri dev
   ```

3. For production build:
   ```bash
   npm run tauri build
   ```

## Features

- Upload and process bill files (PDF, PNG, JPG, JPEG)
- Intuitive drag-and-drop interface
- Modern and responsive UI
- Cross-platform support

## Project Structure

- `/src` - React application source code
- `/src-tauri` - Tauri (Rust) backend code
- `/public` - Static assets

## Development

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) 
  - [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
  - [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## License

This project is licensed under the MIT License.
