

export type ExpoAliyunPushModuleEvents = {
  onNotification: (params: NotificationEventPayload) => void;
  onNotificationReceivedInApp: (params: NotificationEventPayload) => void;
  onNotificationOpened: (params: NotificationEventPayload) => void;
  onMessage: (params: MessageEventPayload) => void;
  onNotificationClickedWithNoAction: (params: NotificationEventPayload) => void;
  onNotificationRemoved: (params: NotificationRemovedEventPayload) => void;

};

export type NotificationEventPayload = {
  title?: string;
  summary?: string;
  ext: any;
};

export type MessageEventPayload = {
  title?: string;
  content?: string;
}

export type NotificationRemovedEventPayload = {
  messageId: string;
}



/// 小米国际化推送，数据存储区域。Global - 新加坡，Europe - 欧洲德国法兰克福，India - 印度孟买
export type XiaomiInternationalPushRegion = 'global' | 'europe' | 'india'

export type AliyunPushLogLevel = 'off' | 'error' | 'info' | 'debug';

/*
CloudPushService.DEVICE_TARGET：本设备
CloudPushService.ACCOUNT_TARGET：本账号
CloudPushService.ALIAS_TARGET：别名
*/
export type AliyunTagTarget = 'device' | 'account' | 'alias'

/*
    安卓推送的【重要程度】，具体参阅 [Android Developer文档](https://developer.android.com/develop/ui/views/notifications?hl=zh-cn#importance)
    public static final int IMPORTANCE_NONE = 0;
    public static final int IMPORTANCE_MIN = 1;
    public static final int IMPORTANCE_LOW = 2;
    public static final int IMPORTANCE_DEFAULT = 3;
    public static final int IMPORTANCE_HIGH = 4;
    public static final int IMPORTANCE_MAX = 5;
*/

export type AndroidNotificationImportance = 'none' | 'min' | 'low' | 'default' | 'high' | 'max'

/// 创建安卓推送通道所需全部参数
export type AndroidNotificationChannel = {
  id: string;
  name: string;
  importance?: AndroidNotificationImportance;
  description?: string;
  group?: string;
  allowBubbles?: boolean;
  enableLights?: boolean;
  lightColor?: number;
  showBadges?: boolean;
  enableVibration?: boolean;
  vibrationPattern?: number[];
  /**
   * 通道铃声。支持 res/raw 资源名或文件名（如 `ringtong` 或 `ringtong.wav`，需通过 config plugin 的
   * `notificationSoundSourcePaths` 预先复制到 `android/app/src/main/res/raw/`），也支持本地文件绝对路径。
   */
  soundPath?: string;
  soundUsage?: number;
  soundContentType?: number;
  soundFlag?: number;
}

export type IOSNotificationForegroundOptions = 'sound' | 'badge' | 'alert' | 'list' | 'banner'


export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined'