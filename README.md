# SGroup Web Backend

Backend for the SGroup system, built with Node.js and TypeScript.

## Project structure

- `src/` : Application source code
- `docs/` : Project documentation
- `.husky/` : Git hooks
- `commitlint.config.js` : Commit lint configuration
- `package.json`, `package-lock.json` : Package management
- `tsconfig.json` : TypeScript configuration
- `.gitignore` : Files and folders ignored by Git

## Installation

```bash
npm install
```

## Run

Start the compiled build:
```bash
npm start
```

Run in development with TypeScript:
```bash
npm run dev
```

## Contributing

To contribute, fork the repository, create a feature branch and open a pull request. Follow the project's commit conventions and run the linters/tests before pushing.

## Commit hooks

This project uses Husky + Commitizen + Commitlint. Use `npm run commit` to create a conventional commit message.

## License

MIT