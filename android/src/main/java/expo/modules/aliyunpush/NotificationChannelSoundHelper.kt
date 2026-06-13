package expo.modules.aliyunpush

import android.content.Context
import android.net.Uri
import java.io.File
import androidx.core.net.toUri

object NotificationChannelSoundHelper {
    /**
     * 将 soundPath 解析为可用于 NotificationChannel.setSound 的 Uri。
     * 支持：
     * 1. 本地文件绝对路径
     * 2. res/raw 资源名或文件名（如 ringtong 或 ringtong.wav，对应 config plugin 复制到 res/raw 的铃声）
     */
    fun resolveSoundUri(context: Context, soundPath: String): Uri? {
        val trimmed = soundPath.trim()
        if (trimmed.isEmpty()) {
            return null
        }

        val file = File(trimmed)
        if (file.exists() && file.isFile && file.canRead()) {
            return Uri.fromFile(file)
        }

        val packageName = context.packageName
        val resources = context.resources
        val resourceBaseName = trimmed.substringBeforeLast('.')
        var resourceId = resources.getIdentifier(resourceBaseName, "raw", packageName)
        if (resourceId == 0) {
            resourceId = resources.getIdentifier(trimmed, "raw", packageName)
        }

        if (resourceId != 0) {
            return "android.resource://$packageName/$resourceId".toUri()
        }

        return null
    }
}
