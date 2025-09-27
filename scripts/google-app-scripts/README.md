# お問い合わせフォーム用 Google Apps Script

# build

```shell
ISSUE_POST_TOKEN=1234 REPO_NAME=test/1234 TARGET=bug-report pnpm run build
```

# release
git tag push によってデプロイされる
```
git tag google-app-scripts/request/{version}
git push origin google-app-scripts/request/{version}

git tag google-app-scripts/bug-report/{version}
git push origin google-app-scripts/bug-report/{version}
```
