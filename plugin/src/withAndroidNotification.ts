import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withDangerousMod,
} from "expo/config-plugins";
import ConfigPluginProps from "./ConfigPluginProps";

/// 配置清单文件，写入元数据，以及权限配置
const withChangeAndroidManifest: ConfigPlugin<ConfigPluginProps> = (
  config,
  props,
) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "com.alibaba.app.appkey",
      props.androidAliyunAppKey,
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "com.alibaba.app.appsecret",
      props.androidAliyunAppSecret,
    );
    // 写入小米字段
    if (props.xiaomiAppId && props.xiaomiAppKey) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "XIAOMI_PUSH_APP_ID",
        props.xiaomiAppId,
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "XIAOMI_PUSH_APP_KEY",
        props.xiaomiAppKey,
      );
    }

    if (props.oppoAppKey && props.oppoAppSecret) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "OPPO_PUSH_APP_KEY",
        props.oppoAppKey,
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "OPPO_PUSH_APP_SECRET",
        props.oppoAppSecret,
      );
    }

    if (props.huaweiAppId) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "com.huawei.hms.client.appid",
        props.huaweiAppId,
      );
    }

    if (props.honorAppId) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "com.hihonor.push.app_id",
        props.honorAppId,
      );
    }

    if (props.vivoAppId && props.vivoAppKey) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "com.vivo.push.app_id",
        props.vivoAppId,
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "com.vivo.push.api_key",
        props.vivoAppKey,
      );
    }

    // 添加魅族依赖
    if (props.meizuAppId && props.meizuAppKey) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "MEIZU_PUSH_APP_ID",
        props.meizuAppId,
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "MEIZU_PUSH_APP_KEY",
        props.meizuAppKey,
      );
    }

    if (
      props.fcmAppId &&
      props.fcmProjectId &&
      props.fcmApiKey &&
      props.fcmSendId
    ) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "FIREBASE_PUSH_APP_ID",
        props.fcmAppId,
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "FIREBASE_PUSH_PROJECT_ID",
        props.fcmProjectId,
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "FIREBASE_PUSH_API_KEY",
        props.fcmApiKey,
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "FIREBASE_PUSH_SEND_ID",
        props.fcmSendId,
      );
    }

    // config.modResults.manifest.application[0].receiver
    mainApplication.receiver = mainApplication.receiver || [];
    mainApplication.receiver.push({
      $: {
        "android:name": "expo.modules.aliyunpush.ExpoAliyunPushMessageReceiver",
        "android:exported": "false",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "com.alibaba.push2.action.NOTIFICATION_OPENED",
              },
            },
          ],
        },
        {
          action: [
            {
              $: {
                "android:name": "com.alibaba.sdk.android.push.RECEIVE",
              },
            },
          ],
        },
        {
          action: [
            {
              $: {
                "android:name": "com.alibaba.push2.action.NOTIFICATION_REMOVED",
              },
            },
          ],
        },
      ],
    });

    if (!config.modResults.manifest["uses-permission"]) {
      config.modResults.manifest["uses-permission"] = [];
    }
    config.modResults.manifest["uses-permission"].push(
      {
        $: {
          "android:name":
            "com.hihonor.android.launcher.permission.CHANGE_BADGE",
        },
      },
      {
        $: {
          "android:name": "com.huawei.android.launcher.permission.CHANGE_BADGE",
        },
      },
      {
        $: {
          "android:name": "com.vivo.notification.permission.BADGE_ICON",
        },
      },
    );

    return config;
  });

  return config;
};

const withCopyAndroidSoundFile: ConfigPlugin<ConfigPluginProps> = (
  config,
  props,
) => {
  /// 配置安卓铃声，根据配置，把文件从/assets/xxx复制到android/app/src/main/res/raw/xxx
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      if (props.notificationSoundSourcePaths?.length) {
        const fs = require("fs");
        const path = require("path");

        await Promise.all(
          props.notificationSoundSourcePaths.map(async (sourcePath) => {
            const sourceFullPath = path.join(
              config.modRequest.projectRoot,
              sourcePath,
            );
            const fileName = path.basename(sourcePath);
            const targetDir = path.join(
              config.modRequest.projectRoot,
              "android/app/src/main/res/raw",
            );
            const targetPath = path.join(targetDir, fileName);

            // 确保目标目录存在
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }

            // 复制文件
            if (fs.existsSync(sourceFullPath)) {
              await fs.promises.copyFile(sourceFullPath, targetPath);
              console.log(
                `Copied sound file from ${sourceFullPath} to ${targetPath}`,
              );
            } else {
              console.warn(
                `Warning: Sound file not found at ${sourceFullPath}`,
              );
            }
          }),
        );
      }
      return config;
    },
  ]);

  return config;
};

export const withAndroidNotification: ConfigPlugin<ConfigPluginProps> = (
  config,
  props,
) => {
  // 配置清单文件
  config = withChangeAndroidManifest(config, props);
  // 复制铃声文件
  config = withCopyAndroidSoundFile(config, props);

  return config;
};
