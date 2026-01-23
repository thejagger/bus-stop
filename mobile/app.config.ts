import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  // Environment variables with EXPO_PUBLIC_ prefix are automatically available
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
  const env = process.env.EXPO_PUBLIC_ENV || "development";

  return {
    ...config,
    name: "Bus Stop",
    slug: "bus-stop",
    version: "1.0.0",
    orientation: "portrait",
    // icon: "./assets/icon.png", // TODO: Add icon.png (1024x1024)
    userInterfaceStyle: "automatic",
    splash: {
      // image: "./assets/splash.png", // TODO: Add splash.png (2048x2048)
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.busstop.app"
    },
    android: {
      adaptiveIcon: {
        // foregroundImage: "./assets/adaptive-icon.png", // TODO: Add adaptive-icon.png (1024x1024)
        backgroundColor: "#000000"
      },
      package: "com.busstop.app"
    },
    web: {
      // favicon: "./assets/favicon.png" // TODO: Add favicon.png (48x48)
    },
    plugins: [
      "expo-router",
      // react-native-ble-plx requires development builds
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static"
          },
          android: {
            minSdkVersion: 23
          }
        }
      ]
    ],
    scheme: "bus-stop",
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: ""
      },
      // Make environment variables accessible
      supabaseUrl,
      supabaseAnonKey,
      env
    }
  };
};
