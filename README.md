# pr-ops

本项目将介绍如何开发一个基于 GitHub 的 PR 机器人，以及如何在 GitHub Actions 中使用这个机器人。
机器人主要功能是在pr被合并时，触发订阅更新提醒，将pr更新的md摘要发送指定tag的api。
除此之外，根据当前pr的tag，机器人还会将pr的更新内容发送到该api。

## subscribe.yaml

```yaml
name: Subscribe to updates

on:
  pull_request:
    types:
      - closed
    branches:
      - 'main'
    paths:
      - '**.md'
#主要有四个tag:'web'、'安全'、'科协'、'AI'。根据即将合并pr的tag通过get请求特定tag订阅链接api，附带本次pr更新的md内容的摘要
jobs:
  subscribe:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2

      - name: Get PR info
        id: pr_info
        run: |
          PR_NUMBER=$(echo $GITHUB_REF | awk 'BEGIN { FS = "/" } ; { print $3 }')
          echo "PR_NUMBER=$PR_NUMBER" >> $GITHUB_ENV
          echo "::set-output name=number::$PR_NUMBER"

      - name: Check PR labels and Send updates
        uses: octokit/request-action@v2.x
        with:
          route: GET /repos/{owner}/{repo}/pulls/{pull_number}
          owner: ${{ github.repository_owner }}
          repo: ${{ github.repository }}
          pull_number: ${{ steps.pr_info.outputs.number }}
          token: ${{ secrets.GITHUB_TOKEN }}
        id: pr_data

      - name: Send POST request
        run: |
          LABELS=$(echo '${{ steps.pr_data.outputs.data }}' | jq -r '.labels[].name')
          for LABEL in $LABELS
          do
            case $LABEL in
            "web")
              API_ENDPOINT="http://your-api.com/web-update"
              ;;
            "安全")
              API_ENDPOINT="http://your-api.com/security-update"
              ;;
            "科协")
              API_ENDPOINT="http://your-api.com/science-update"
              ;;
            "AI")
              API_ENDPOINT="http://your-api.com/ai-update"
              ;;
            esac

            if [ ! -z "$API_ENDPOINT" ]; then
              curl -X POST $API_ENDPOINT \
              -H "Content-Type: application/json" \
              -d '{ "message": "New update in PR #'$PR_NUMBER'" }'
            fi
          done
```