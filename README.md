# pr-ops

本项目将介绍如何开发一个基于 GitHub 的 PR 机器人，以及如何在 GitHub Actions 中使用这个机器人。
机器人主要功能是在pr被合并时，触发订阅更新提醒，将pr更新的md摘要发送指定tag的api。
除此之外，根据当前pr的tag，机器人还会将pr的更新内容发送到该api。

## 机器人开