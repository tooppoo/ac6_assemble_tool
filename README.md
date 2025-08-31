# AC6 ASSEMBLE TOOL

[![Lighthouse](https://github.com/tooppoo/ac6_assemble_tool/actions/workflows/ci-lighthouse.yml/badge.svg)](https://github.com/tooppoo/ac6_assemble_tool/actions/workflows/ci-lighthouse.yml)
[![Lint](https://github.com/tooppoo/ac6_assemble_tool/actions/workflows/ci-lint.yml/badge.svg)](https://github.com/tooppoo/ac6_assemble_tool/actions/workflows/ci-lint.yml)
[![Test](https://github.com/tooppoo/ac6_assemble_tool/actions/workflows/ci-test.yml/badge.svg)](https://github.com/tooppoo/ac6_assemble_tool/actions/workflows/ci-test.yml)
[![codecov](https://codecov.io/gh/tooppoo/ac6_assemble_tool/graph/badge.svg?token=ehRpqiJfjJ)](https://codecov.io/gh/tooppoo/ac6_assemble_tool)

## URL / Deployment

Application is running on <https://ac6-assemble-tool.philomagi.dev/>

This app is deployed via Cloudflare Pages.

- Production URL: https://ac6-assemble-tool.philomagi.dev/
- Deployment: executed by Cloudflare Pages on pushes to the default branch

Environment variables are configured in Cloudflare Pages Project settings:

- `PUBLIC_REPORT_BUG_URL`
- `PUBLIC_REPORT_REQUEST_URL`
- `PUBLIC_LOG_LEVEL`
- `PUBLIC_SITE_URL`

## Local Development

```shell
npm i
npm run dev
```

## Build

```shell
npm run build
```

## Release

```shell
# i.e. minor
npm version minor

# i.e. release as v1.2.3
git push origin v1.2.3

# publish release v1.2.3 on GitHub UI
```
