import {
  ConfigPlugin,
  withEntitlementsPlist,
  withXcodeProject,
  IOSConfig,
  XcodeProject,
} from "expo/config-plugins";
import { copyFileSync, existsSync } from "fs";
import { basename, join, resolve } from "path";
import ConfigPluginProps from "./ConfigPluginProps";

const withApsEnvironment: ConfigPlugin<{ mode: string }> = (config, { mode }) => {
  config = withEntitlementsPlist(config, (config) => {
    if (!config.modResults["aps-environment"]) {
      config.modResults["aps-environment"] = mode;
    }
    return config;
  });
  return config;
};

/**
 * 将资源文件复制到 iOS 工程目录，并在 Xcode 项目中注册（使用相对路径）。
 * 逻辑与 Android 的 withCopyAndroidSoundFile 对齐：按源路径 basename 复制到目标目录。
 */
function copyAndRegisterIosResourceFiles(
  projectRoot: string,
  project: XcodeProject,
  projectName: string | undefined,
  sourcePaths: string[],
): XcodeProject {
  if (!sourcePaths.length) {
    return project;
  }

  if (!projectName) {
    console.warn(
      "Unable to find iOS project name, skipping iOS resource file setup",
    );
    return project;
  }

  const sourceRoot = IOSConfig.Paths.getSourceRoot(projectRoot);

  for (const sourceRelativePath of sourcePaths) {
    const fileName = basename(sourceRelativePath);
    const sourcePath = resolve(projectRoot, sourceRelativePath);
    const destinationPath = join(sourceRoot, fileName);
    const xcodeRelativePath = join(projectName, fileName);

    if (!existsSync(sourcePath)) {
      console.warn(`Warning: File not found at ${sourcePath}`);
      continue;
    }

    copyFileSync(sourcePath, destinationPath);
    console.log(`Copied file from ${sourcePath} to ${destinationPath}`);

    if (!project.hasFile(xcodeRelativePath)) {
      project = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: xcodeRelativePath,
        groupName: projectName,
        isBuildFile: true,
        project,
        verbose: true,
      });
    }
  }

  return project;
}

const withIosResourceFiles: ConfigPlugin<{ sourcePaths: string[] }> = (
  config,
  { sourcePaths },
) => {
  if (!sourcePaths.length) {
    return config;
  }

  return withXcodeProject(config, (config) => {
    config.modResults = copyAndRegisterIosResourceFiles(
      config.modRequest.projectRoot,
      config.modResults,
      config.modRequest.projectName,
      sourcePaths,
    );
    return config;
  });
};

export const withIOSNotification: ConfigPlugin<ConfigPluginProps> = (
  config,
  props,
) => {
  config = withApsEnvironment(config, {
    mode: props.apsEnvironment || "development",
  });

  const resourceSourcePaths = [
    ...(props.notificationSoundSourcePaths ?? []),
    ...(props.extraIOSThirdPartyPushConfigFiles ?? []),
  ];

  config = withIosResourceFiles(config, { sourcePaths: resourceSourcePaths });

  return config;
};
