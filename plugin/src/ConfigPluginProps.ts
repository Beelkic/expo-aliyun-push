/// 本插件所支持的所有app.json配置
type ConfigPluginProps = {
  androidAliyunAppKey: string;
  androidAliyunAppSecret: string;

  iosAliyunAppKey: string;
  iosAliyunAppSecret: string;

  /// 小米
  xiaomiAppId?: string;
  xiaomiAppKey?: string;

  /// 华为
  huaweiAppId?: string;

  /// 荣耀
  honorAppId?: string;

  /// vivo
  vivoAppId?: string;
  vivoAppKey?: string;

  /// oppo
  oppoAppKey?: string;
  oppoAppSecret?: string;

  /// 魅族
  meizuAppId?: string;
  meizuAppKey?: string;

  /// Firebase
  fcmSendId?: string;
  fcmAppId?: string;
  fcmProjectId?: string;
  fcmApiKey?: string;

  /**
   * 自定义通知铃声的铃声文件路径，注意，是在你项目文件的路径，例如：assets/music/notification.mp3
   * 假设文件名为notification.mp3，则会分别创建android/app/src/main/res/raw/notification.mp3和ios/notification.mp3
   */
  notificationSoundSourcePaths?: string[];

  /**
   * 额外的第三方推送配置文件路径映射
   * key: 源文件路径（相对于项目根目录）
   * value: 目标文件路径（相对于android/目录），只接受"/"和"/app/"
   * 例如: { "assets/google-services.json": "/app" }
   */
  extraAndroidThirdPartyPushConfigFiles?: Record<string, string>;
  /**
   * iOS额外推送配置文件路径列表。会放在ios/
   */
  extraIOSThirdPartyPushConfigFiles?: string[];
};

export default ConfigPluginProps;