# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Expo modules are discovered dynamically. Keep them in release builds so
# R8 does not strip modules such as expo-image-picker and expo-location.
-keep class expo.modules.** { *; }
-keep class expo.modules.ExpoModulesPackage { *; }

# Add any project specific keep options here:
