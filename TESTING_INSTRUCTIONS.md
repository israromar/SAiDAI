# Testing Instructions: iOS Battery Module

This document provides instructions for testing the iOS Battery Module feature in the SAiDAI React Native application.

## 1. Building and Running the App

### Prerequisites
*   A macOS machine with Xcode and Node.js installed.
*   React Native development environment set up.
*   An iOS simulator or a physical iOS device.

### Steps

**A. Install Cocoapods Dependencies:**
   Open your terminal, navigate to the project's root directory, and then into the `ios` directory. Run `pod install` to link the native module.
   ```bash
   cd ios
   pod install
   cd .. 
   ```
   *(Note: `cd ..` is to return to the project root for the next commands)*

**B. Running on an iOS Simulator:**
   From the project's root directory, run:
   ```bash
   npx react-native run-ios
   ```
   Alternatively, you can open the `.xcworkspace` file (e.g., `SAiDAI.xcworkspace`) located in the `ios` directory with Xcode, select a simulator, and click the "Run" button.

**C. Running on a Physical iOS Device:**
   1.  Open the `.xcworkspace` file (e.g., `SAiDAI.xcworkspace`) in the `ios` directory with Xcode.
   2.  Connect your iOS device to your Mac.
   3.  Select your device in Xcode's target device list.
   4.  You will likely need to configure code signing:
       *   Go to the "Signing & Capabilities" tab for the app target.
       *   Select your development team. If you don't have one, you'll need to create a free Apple Developer account and enroll it in Xcode.
       *   Xcode might attempt to automatically manage signing. Ensure a valid provisioning profile and signing certificate are selected.
   5.  Click the "Run" button in Xcode.

## 2. Testing Functionality

Once the app is running on a simulator or device:

*   **Locate the Feature:** Look for a new section titled "**Battery Info**" on the main screen of the app. This section should be below the "Header" and above the "Step One" section.
*   **Identify UI Elements:** Within the "Battery Info" section, you should see:
    *   A button labeled "**Refresh Battery Level**".
    *   A text display initially showing "**Battery Level: Fetching...**" or directly the battery level if fetched on load.
*   **Trigger Battery Level Fetch:**
    *   The battery level should be fetched automatically when the app loads.
    *   Press the "**Refresh Battery Level**" button.
*   **Expected Behavior:**
    *   **On a Real iOS Device:**
        *   Upon loading or pressing the button, the text should update to display the current battery percentage of the device (e.g., "**Battery Level: 95%**").
        *   The value should be a realistic representation of the device's actual battery charge.
    *   **On an iOS Simulator:**
        *   The iOS simulator might not always provide a real battery level.
        *   You may see "**Battery Level: Battery level unavailable**" if the simulator returns an unknown state (which our native code translates to -1.0).
        *   Some simulators might return a fixed value (e.g., 100% or 50%). The displayed value should correspond to what the simulator provides.

## 3. Verifying Edge Cases/Error States

*   **"Battery level unavailable":**
    *   This is the primary error state handled.
    *   To test this, running on an iOS Simulator is the most straightforward way, as many simulators do not report a specific battery level, causing `UIDevice.current.batteryLevel` to be negative or `UIDevice.BatteryState.unknown`.
    *   Confirm that if the native module sends `-1.0`, the app UI displays "**Battery Level: Battery level unavailable**".
*   **"Not available on this platform":**
    *   While the module is iOS-specific, the JavaScript code includes a check `Platform.OS === 'ios'`. If this somehow failed or if the module wasn't linked, this message would appear. This is less about the native module itself and more about the JS guard.

## 4. Troubleshooting Tips

*   **"NativeModules.BatteryModule is undefined" / Module not found:**
    *   Ensure you have run `cd ios && pod install` **after** adding the native module files.
    *   Rebuild the app:
        *   If using `npx react-native run-ios`, it usually rebuilds. Try cleaning the build: `npx react-native run-ios --no-packager` then start packager separately `npm start -- --reset-cache`.
        *   If using Xcode, clean the build folder (Product > Clean Build Folder) and then rebuild.
    *   Verify that `BatteryModule.swift` and `BatteryModuleBridge.m` are correctly added to the `SAiDAI` target in Xcode's "Build Phases" > "Compile Sources". Xcode should pick them up automatically if they are in the main app folder, but it's good to check if issues arise.
    *   Ensure the project (especially `AppDelegate.swift` or an Objective-C bridging header if you were using one for other purposes) doesn't have compilation errors preventing the module from being available.
*   **Xcode Build Errors:**
    *   If the app fails to build, open the `.xcworkspace` in Xcode and check the build logs (Report Navigator).
    *   Look for errors related to `BatteryModule.swift` (e.g., syntax errors, incorrect protocol conformance) or `BatteryModuleBridge.m` (e.g., issues with `RCT_EXTERN_MODULE` macros).
    *   Ensure that `UIDevice.current.isBatteryMonitoringEnabled = true` is set before accessing `batteryLevel`.
*   **App crashes or unexpected behavior:**
    *   Check device logs via Xcode (Window > Devices and Simulators > select your device > View Device Logs).
    *   Use Safari Developer Tools to debug the JavaScript part of your React Native application if the issue seems to be in the `App.tsx` logic.
*   **Incorrect Battery Level Reported:**
    *   On a real device, if the level seems stuck or incorrect, try disconnecting and reconnecting the device, or restarting it.
    *   Ensure the native code logic `Math.round(level * 100) + '%'` in `App.tsx` and the `level` value from Swift are correctly handled. Remember Swift `batteryLevel` is a float between 0.0 and 1.0.

---
End of Testing Instructions.
