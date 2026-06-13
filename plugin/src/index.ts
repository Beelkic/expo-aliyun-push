import { ConfigPlugin, withInfoPlist, withPodfile } from "expo/config-plugins";
import ConfigPluginProps from "./ConfigPluginProps";
import { withAndroidNotification } from "./withAndroidNotification";
import { withIOSNotification } from "./withIOSNotification";

/// 安卓推送插件以及其依赖版本关系：https://help.aliyun.com/document_detail/434659.html?spm=a2c4g.11186623.0.0.64182bef1tJ1wl#topic-1996989
const withAliyunPush: ConfigPlugin<ConfigPluginProps> = (config, props) => {
  config = withAndroidNotification(config, props);
  config = withIOSNotification(config, props);

  // 按需配置安卓三方推送依赖
  // config = withAppBuildGradle(config, (config) => {
  // config.modResults.contents = addDependency(
  //   config.modResults.contents,
  //   "com.aliyun.ams:alicloud-android-third-push:3.9.2"
  // );
  // 添加小米依赖
  // if (props.xiaomiAppId && props.xiaomiAppKey) {
  //   const isInternationalUser = props.xiaomiInternational == true;
  //   if (isInternationalUser) {
  //     config.modResults.contents = addDependency(
  //       config.modResults.contents,
  //       "com.aliyun.ams:alicloud-android-third-push-xiaomi:3.8.8-intel"
  //     );
  //   } else {
  //     config.modResults.contents = addDependency(
  //       config.modResults.contents,
  //       "com.aliyun.ams:alicloud-android-third-push-xiaomi:3.9.2"
  //     );
  //   }
  // }
  // // 添加华为依赖
  // if (props.huaweiAppId) {
  //   config.modResults.contents = addDependency(
  //     config.modResults.contents,
  //     "com.aliyun.ams:alicloud-android-third-push-huawei:3.9.2"
  //   );
  //   config.modResults.contents = addDependency(
  //     config.modResults.contents,
  //     "com.huawei.hms:push:6.12.0.300"
  //   );
  // }
  // 添加荣耀依赖
  // if (props.honorAppId) {
  //   //com.aliyun.ams:alicloud-android-third-push-honor

  //   config.modResults.contents = addDependency(
  //     config.modResults.contents,
  //     "com.aliyun.ams:alicloud-android-third-push-honor:3.9.2"
  //   );
  // }

  // 添加oppo依赖
  // if (props.oppoAppKey && props.oppoAppSecret) {
  //   config.modResults.contents = addDependency(
  //     config.modResults.contents,
  //     "com.aliyun.ams:alicloud-android-third-push-oppo:3.9.2"
  //   );
  // }

  // 添加魅族依赖
  // if (props.meizuAppId && props.meizuAppKey) {
  //   config.modResults.contents = addDependency(
  //     config.modResults.contents,
  //     "com.aliyun.ams:alicloud-android-third-push-meizu:3.9.2"
  //   );
  // }

  // if (
  //   props.fcmAppId &&
  //   props.fcmProjectId &&
  //   props.fcmApiKey &&
  //   props.fcmSendId
  // ) {
  //   config.modResults.contents = addDependency(
  //     config.modResults.contents,
  //     "com.aliyun.ams:alicloud-android-third-push-fcm:3.9.2"
  //   );
  // }

  //   return config;
  // });

  /// 配置iOS
  config = withInfoPlist(config, (config) => {
    config.modResults["ALIYUN_PUSH_APP_KEY"] = props.iosAliyunAppKey;
    config.modResults["ALIYUN_PUSH_APP_SECRET"] = props.iosAliyunAppSecret;
    return config;
  });

  config = withPodfile(config, (config) => {
    const additionalPodSpecs =
      "source 'https://github.com/CocoaPods/Specs.git'\nsource 'https://github.com/aliyun/aliyun-specs.git'\n";
    config.modResults.contents =
      additionalPodSpecs + config.modResults.contents;
    return config;
  });

  return config;
};

export default withAliyunPush;

/**
 * 向build.gradle中动态添加依赖
 * @param buildGradleContents build.gradle文件内容
 * @param dependency 新的依赖
 * @returns 修改后的build.gradle文件内容
 */
function addDependency(buildGradleContents: string, dependency: string) {
  const dependencyLine = `    implementation '${dependency}'`;

  // 如果依赖已经存在，先删除已存在的依赖行，然后重新添加
  if (buildGradleContents.includes(dependencyLine)) {
    buildGradleContents = buildGradleContents.replace(
      dependencyLine + "\n",
      "",
    );
    buildGradleContents = buildGradleContents.replace(dependencyLine, "");
  }

  const dependenciesBlockRegex = /dependencies\s*{([^}]*)}/;
  const match = buildGradleContents.match(dependenciesBlockRegex);

  if (!match) {
    return buildGradleContents + `\ndependencies {\n${dependencyLine}\n}`;
  }

  // 在 dependencies 块的开头插入新的依赖
  const updatedBuildGradle = buildGradleContents.replace(
    dependenciesBlockRegex,
    (match, depsContent) => {
      return `dependencies {\n${dependencyLine}${depsContent}}`;
    },
  );

  return updatedBuildGradle;
}
