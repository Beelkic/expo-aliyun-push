# Changelog

## Unreleased

## 0.5.0 - 2025-06-16

- 新增荣耀的 MavenRepo #3 by [@Beelkic](https://github.com/Beelkic)

## 0.2.0 — 2025-06-13

### 🎉 New features

- Config Plugin 支持通过 `notificationSoundSourcePaths` 在 prebuild 时自动复制自定义通知铃声：Android 复制到 `android/app/src/main/res/raw/`，iOS 复制到工程目录并注册到 Xcode 项目。
- Config Plugin 支持通过 `extraAndroidThirdPartyPushConfigFiles` 自动复制 Android 第三方推送配置文件（如 `google-services.json`、`agconnect-services.json`）到 `android/` 或 `android/app/`。
- Config Plugin 支持通过 `extraIOSThirdPartyPushConfigFiles` 自动复制 iOS 第三方推送配置文件（如 `GoogleService-Info.plist`）并注册到 Xcode 项目。
- `createAndroidNotificationChannel` 的 `soundPath` 支持 `res/raw` 资源名（如 `ringtong`），无需在原生代码中手动配置 `R.raw`。

### 💡 Others

- 拆分 Android / iOS 通知相关 Config Plugin 逻辑（`withAndroidNotification`、`withIOSNotification`）。
- 移除 Config Plugin 中的 `apsEnvironment` 配置项，改由 Expo 标准的 `ios.entitlements["aps-environment"]` 配置推送环境。
