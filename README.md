# expo-aliyun-push

React Native Expo 阿里云推送插件包。

## 安装

```shell
npx expo install expo-aliyun-push expo-build-properties
```

## 配置

所有配置均在 `app.config.js` 中完成，无需手动修改原生工程。请先安装 `expo-build-properties`（用于 Android Maven 仓库与 ProGuard 规则）。

**proguard-rules.txt**

```txt
# 阿里云推送
-keepclasseswithmembernames class ** {
    native <methods>;
}
-keepattributes Signature
-keep class sun.misc.Unsafe { *; }
-keep class com.taobao.** {*;}
-keep class com.alibaba.** {*;}
-keep class com.alipay.** {*;}
-keep class com.ut.** {*;}
-keep class com.ta.** {*;}
-keep class anet.**{*;}
-keep class anetwork.**{*;}
-keep class org.android.spdy.**{*;}
-keep class org.android.agoo.**{*;}
-keep class android.os.**{*;}
-keep class org.json.**{*;}
-dontwarn com.taobao.**
-dontwarn com.alibaba.**
-dontwarn com.alipay.**
-dontwarn anet.**
-dontwarn org.android.spdy.**
-dontwarn org.android.agoo.**
-dontwarn anetwork.**
-dontwarn com.ut.**
-dontwarn com.ta.**

# 小米通道
-keep class com.xiaomi.** {*;}
-dontwarn com.xiaomi.**

# 华为通道
-keep class com.huawei.** {*;}
-dontwarn com.huawei.**

# 荣耀通道
-ignorewarnings
-keepattributes *Annotation*
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes Signature
-keepattributes SourceFile,LineNumberTable
-keep class com.hihonor.push.**{*;}

# vivo 通道
-keep class com.vivo.** {*;}
-dontwarn com.vivo.**

# OPPO 通道
-keep public class * extends android.app.Service

# GCM/FCM 通道
-keep class com.google.firebase.**{*;}
-dontwarn com.google.firebase.**
```

**app.config.js**

```javascript

/** @type {import("expo/config").ExpoConfig} */
export default {
  expo: {
    name: "my-app",
    slug: "my-app",
    ios: {
      bundleIdentifier: "com.example.myapp",
      // 启用推送能力；生产环境改为 "production"
      entitlements: {
        "aps-environment": "development",
      },
    },
    android: {
      package: "com.example.myapp",
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            extraProguardRules: /*把上面的proguard-rules.txt的内容放到这里*/,
            extraMavenRepos: [
              "https://maven.aliyun.com/nexus/content/repositories/releases/",
              "https://developer.huawei.com/repo/",
              "https://developer.hihonor.com/repo/",
            ],
          },
        },
      ],
      [
        "expo-aliyun-push",
        {
          // 必填：阿里云推送
          androidAliyunAppKey: "your-android-app-key",
          androidAliyunAppSecret: "your-android-app-secret",
          iosAliyunAppKey: "your-ios-app-key",
          iosAliyunAppSecret: "your-ios-app-secret",

          // 可选：厂商通道（不填则不启用对应通道）
          xiaomiAppId: "",
          xiaomiAppKey: "",
          huaweiAppId: "",
          honorAppId: "",
          vivoAppId: "",
          vivoAppKey: "",
          oppoAppKey: "",
          oppoAppSecret: "",
          meizuAppId: "",
          meizuAppKey: "",
          fcmSendId: "",
          fcmAppId: "",
          fcmProjectId: "",
          fcmApiKey: "",

          // 可选：自定义通知铃声（复制到 android/res/raw 与 ios 工程目录）
          notificationSoundSourcePaths: ["assets/music/ringtong.wav"],

          // 可选：第三方推送配置文件
          extraAndroidThirdPartyPushConfigFiles: {
            "assets/google-services.json": "/app",
            "assets/agconnect-services.json": "/app",
          },
          extraIOSThirdPartyPushConfigFiles: [
            "assets/GoogleService-Info.plist",
          ],
        },
      ],
    ],
  },
};
```

### Config Plugin 配置项说明

| 配置项                                  | 必填 | 说明                                                                     |
| --------------------------------------- | ---- | ------------------------------------------------------------------------ |
| `androidAliyunAppKey`                   | 是   | Android 阿里云 AppKey                                                    |
| `androidAliyunAppSecret`                | 是   | Android 阿里云 AppSecret                                                 |
| `iosAliyunAppKey`                       | 是   | iOS 阿里云 AppKey                                                        |
| `iosAliyunAppSecret`                    | 是   | iOS 阿里云 AppSecret                                                     |
| `xiaomiAppId`                           | 否   | 小米推送 AppId                                                           |
| `xiaomiAppKey`                          | 否   | 小米推送 AppKey                                                          |
| `huaweiAppId`                           | 否   | 华为推送 AppId                                                           |
| `honorAppId`                            | 否   | 荣耀推送 AppId                                                           |
| `vivoAppId`                             | 否   | vivo 推送 AppId                                                          |
| `vivoAppKey`                            | 否   | vivo 推送 AppKey                                                         |
| `oppoAppKey`                            | 否   | OPPO 推送 AppKey                                                         |
| `oppoAppSecret`                         | 否   | OPPO 推送 AppSecret                                                      |
| `meizuAppId`                            | 否   | 魅族推送 AppId                                                           |
| `meizuAppKey`                           | 否   | 魅族推送 AppKey                                                          |
| `fcmSendId`                             | 否   | Firebase 推送 SendId                                                     |
| `fcmAppId`                              | 否   | Firebase 推送 AppId                                                      |
| `fcmProjectId`                          | 否   | Firebase 推送 ProjectId                                                  |
| `fcmApiKey`                             | 否   | Firebase 推送 ApiKey                                                     |
| `notificationSoundSourcePaths`          | 否   | 自定义铃声源文件路径列表，prebuild 时复制到原生工程                      |
| `extraAndroidThirdPartyPushConfigFiles` | 否   | Android 第三方配置文件映射，`key` 为源路径，`value` 为 `"/"` 或 `"/app"` |
| `extraIOSThirdPartyPushConfigFiles`     | 否   | iOS 第三方配置文件路径列表                                               |

厂商通道字段留空或不填时，插件不会启用对应通道。包名须与阿里云控制台一致，否则初始化会失败。

### Android 推送角标

华为、荣耀、vivo 厂商通道需在清单中声明角标权限，插件已自动配置。服务端下发规则见 [官方文档](https://help.aliyun.com/document_detail/2841265.html)。本地修改角标可使用 `setBadgeNumber`。

## 使用

```typescript
import ExpoAliyunPush from "expo-aliyun-push";
import { useEvent } from "expo";
```

### 初始化

#### `initAliyunPush()`

```typescript
initAliyunPush(): Promise<void>
```

初始化阿里云推送 SDK。应在应用启动时调用，且只需调用一次。

**返回值：** 无。

---

#### `initThirdPush()`

```typescript
initThirdPush(): Promise<void>
```

初始化第三方厂商推送通道。**仅 Android 需要调用**，在 `initAliyunPush()` 之后调用。

**返回值：** 无。

---

#### `getDeviceId()`

```typescript
getDeviceId(): Promise<string>
```

获取当前设备的推送 DeviceId，用于服务端定向推送。

**返回值：** 设备 ID 字符串。

---

### 日志

#### `setAliyunLogLevel(logLevel)`

```typescript
setAliyunLogLevel(logLevel: AliyunPushLogLevel): Promise<string>
```

设置阿里云推送 SDK 日志级别。

| 参数       | 类型                                    | 说明     |
| ---------- | --------------------------------------- | -------- |
| `logLevel` | `'off' \| 'error' \| 'info' \| 'debug'` | 日志级别 |

**返回值：** 操作结果字符串。

---

### Android 通知通道

#### `createAndroidNotificationChannel(channelInfo)`

```typescript
createAndroidNotificationChannel(
  channelInfo: AndroidNotificationChannel,
): Promise<void>
```

创建 Android 8.0+ 通知通道。推送前需先创建通道，并在阿里云控制台配置相同的 `channelId`。

| 参数                           | 类型                                                       | 必填 | 说明                                                  |
| ------------------------------ | ---------------------------------------------------------- | ---- | ----------------------------------------------------- |
| `channelInfo.id`               | `string`                                                   | 是   | 通道 ID，推送时使用                                   |
| `channelInfo.name`             | `string`                                                   | 是   | 通道名称（用户可见）                                  |
| `channelInfo.importance`       | `'none' \| 'min' \| 'low' \| 'default' \| 'high' \| 'max'` | 否   | 重要程度，默认 `default`                              |
| `channelInfo.description`      | `string`                                                   | 否   | 通道描述                                              |
| `channelInfo.group`            | `string`                                                   | 否   | 通道分组 ID                                           |
| `channelInfo.allowBubbles`     | `boolean`                                                  | 否   | 是否允许气泡通知                                      |
| `channelInfo.enableLights`     | `boolean`                                                  | 否   | 是否启用指示灯                                        |
| `channelInfo.lightColor`       | `number`                                                   | 否   | 指示灯颜色                                            |
| `channelInfo.showBadges`       | `boolean`                                                  | 否   | 是否在启动器显示角标                                  |
| `channelInfo.enableVibration`  | `boolean`                                                  | 否   | 是否振动                                              |
| `channelInfo.vibrationPattern` | `number[]`                                                 | 否   | 振动模式（毫秒）                                      |
| `channelInfo.soundPath`        | `string`                                                   | 否   | 铃声：`res/raw` 资源名（如 `ringtong`）或本地绝对路径 |
| `channelInfo.soundUsage`       | `number`                                                   | 否   | `AudioAttributes` Usage，默认系统通知用法             |
| `channelInfo.soundContentType` | `number`                                                   | 否   | `AudioAttributes` ContentType                         |
| `channelInfo.soundFlag`        | `number`                                                   | 否   | `AudioAttributes` Flags                               |

**自定义铃声示例：**

```typescript
// app.config.js 中配置 notificationSoundSourcePaths: ["assets/music/ringtong.wav"]
await ExpoAliyunPush.createAndroidNotificationChannel({
  id: "my-channel",
  name: "My Channel",
  importance: "high",
  description: "带自定义铃声的通道",
  soundPath: "ringtong",
});
```

**返回值：** 无。

---

### 账号与手机号绑定

#### `bindAccount(account)`

```typescript
bindAccount(account: string): Promise<string>
```

将当前设备绑定到指定账号，用于按账号推送。

| 参数      | 类型     | 说明     |
| --------- | -------- | -------- |
| `account` | `string` | 账号标识 |

**返回值：** 操作结果字符串。

---

#### `unbindAccount()`

```typescript
unbindAccount(): Promise<string>
```

解绑当前设备的账号。

**返回值：** 操作结果字符串。

---

#### `bindPhoneNumber(phoneNumber)`

```typescript
bindPhoneNumber(phoneNumber: string): Promise<string>
```

将当前设备绑定到手机号。

| 参数          | 类型     | 说明   |
| ------------- | -------- | ------ |
| `phoneNumber` | `string` | 手机号 |

**返回值：** 操作结果字符串。

---

#### `unbindPhoneNumber()`

```typescript
unbindPhoneNumber(): Promise<string>
```

解绑当前设备的手机号。

**返回值：** 操作结果字符串。

---

### 标签与别名

#### `bindTag(target, tags, alias)`

```typescript
bindTag(
  target: AliyunTagTarget,
  tags: string[],
  alias: string | undefined | null,
): Promise<string>
```

为目标绑定标签。

| 参数     | 类型                               | 说明                              |
| -------- | ---------------------------------- | --------------------------------- |
| `target` | `'device' \| 'account' \| 'alias'` | 绑定目标：本设备 / 本账号 / 别名  |
| `tags`   | `string[]`                         | 标签列表                          |
| `alias`  | `string \| undefined \| null`      | 当 `target` 为 `alias` 时传入别名 |

**返回值：** 操作结果字符串。

---

#### `unbindTag(target, tags, alias)`

```typescript
unbindTag(
  target: AliyunTagTarget,
  tags: string[],
  alias: string | undefined | null,
): Promise<string>
```

为目标解绑标签。参数同 `bindTag`。

**返回值：** 操作结果字符串。

---

#### `listTags(target)`

```typescript
listTags(target: AliyunTagTarget): Promise<string>
```

查询当前目标已绑定的标签。

| 参数     | 类型                               | 说明     |
| -------- | ---------------------------------- | -------- |
| `target` | `'device' \| 'account' \| 'alias'` | 查询目标 |

**返回值：** 标签列表 JSON 字符串。

---

#### `addAlias(alias)`

```typescript
addAlias(alias: string): Promise<string>
```

为当前设备添加别名。

| 参数    | 类型     | 说明 |
| ------- | -------- | ---- |
| `alias` | `string` | 别名 |

**返回值：** 操作结果字符串。

---

#### `removeAlias(alias)`

```typescript
removeAlias(alias: string): Promise<string>
```

移除当前设备的别名。

| 参数    | 类型     | 说明         |
| ------- | -------- | ------------ |
| `alias` | `string` | 要移除的别名 |

**返回值：** 操作结果字符串。

---

#### `listAlias()`

```typescript
listAlias(): Promise<string>
```

查询当前设备已绑定的别名列表。

**返回值：** 别名列表 JSON 字符串。

---

### 角标

#### `setBadgeNumber(number)`

```typescript
setBadgeNumber(number: number): Promise<string>
```

设置应用角标数字。

| 参数     | 类型     | 说明     |
| -------- | -------- | -------- |
| `number` | `number` | 角标数量 |

**返回值：** 操作结果字符串。

---

### iOS 前台通知

#### `setIOSForegroundNotificationOptions(options)`

```typescript
setIOSForegroundNotificationOptions(
  options: IOSNotificationForegroundOptions[],
): Promise<void>
```

设置 iOS 应用在前台收到推送时的展示选项。**仅 iOS 有效。**

| 参数      | 类型                                                      | 说明           |
| --------- | --------------------------------------------------------- | -------------- |
| `options` | `('sound' \| 'badge' \| 'alert' \| 'list' \| 'banner')[]` | 前台通知展示项 |

**返回值：** 无。

---

### 通知权限

#### `getNotificationPermissionStatus()`

```typescript
getNotificationPermissionStatus(): Promise<NotificationPermissionStatus>
```

获取当前通知权限状态。

**返回值：** `'granted'` \| `'denied'` \| `'undetermined'`。

---

#### `jumpToNotificationSettings()`

```typescript
jumpToNotificationSettings(): Promise<void>
```

跳转到系统通知设置页面。

**返回值：** 无。

---

### 事件

通过 `useEvent` 或 `addListener` 监听推送事件：

| 事件名                              | 回调参数                          | 说明                 |
| ----------------------------------- | --------------------------------- | -------------------- |
| `onNotification`                    | `NotificationEventPayload`        | 收到通知             |
| `onNotificationReceivedInApp`       | `NotificationEventPayload`        | 应用内收到通知       |
| `onNotificationOpened`              | `NotificationEventPayload`        | 用户点击通知打开应用 |
| `onMessage`                         | `MessageEventPayload`             | 收到透传消息         |
| `onNotificationClickedWithNoAction` | `NotificationEventPayload`        | 点击无动作通知       |
| `onNotificationRemoved`             | `NotificationRemovedEventPayload` | 通知被移除           |

**`NotificationEventPayload`**

| 字段      | 类型     | 说明     |
| --------- | -------- | -------- |
| `title`   | `string` | 通知标题 |
| `summary` | `string` | 通知摘要 |
| `ext`     | `any`    | 扩展字段 |

**`MessageEventPayload`**

| 字段      | 类型     | 说明     |
| --------- | -------- | -------- |
| `title`   | `string` | 消息标题 |
| `content` | `string` | 消息内容 |

**`NotificationRemovedEventPayload`**

| 字段        | 类型     | 说明                |
| ----------- | -------- | ------------------- |
| `messageId` | `string` | 被移除通知的消息 ID |

```typescript
import { useEvent } from "expo";

const onNotification = useEvent(ExpoAliyunPush, "onNotification");
```

## 注意事项

- 本插件仅支持 Android 和 iOS。Web 平台可调用 API，但不会有实际效果。
- 阿里云推送账号中的包名须与应用 `bundleIdentifier` / `package` 一致，否则初始化失败。
- iOS 生产包请将 `aps-environment` 设为 `production`。

## 已知问题

厂商通道配置过程中，华为通道需将 AppGallery Connect 的 `agconnect-services.json` 放入 Android 原生项目 `/app` 目录。可通过 config plugin 的 `extraAndroidThirdPartyPushConfigFiles` 自动复制，例如：

```javascript
extraAndroidThirdPartyPushConfigFiles: {
  "assets/agconnect-services.json": "/app",
},
```

## 联系我

QQ 群：682911244
