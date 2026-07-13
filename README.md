# @fiduswriter/bibliography-manager

Fidus Writer bibliography manager.

This package implements the bibliography management UI: the overview table, the
entry form and field editors, import/export filters, and the client-side
bibliography database connector.

## Build

```bash
npm install
npm run build
```

## Status

This is an initial extraction from the main Fidus Writer Django app. The code is
still JavaScript and will be migrated to TypeScript over time. The bibliography
logic depends on `bibliojson` (previously published as `biblatex-csl-converter`).
