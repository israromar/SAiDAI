import UIKit
import React

@objc(BatteryModule)
class BatteryModule: NSObject, RCTBridgeModule {
  static func moduleName() -> String! {
    return "BatteryModule"
  }

  static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc
  func getBatteryLevel(_ callback: @escaping RCTResponseSenderBlock) {
    UIDevice.current.isBatteryMonitoringEnabled = true
    let level = UIDevice.current.batteryLevel
    if level == UIDevice.BatteryState.unknown.rawValue || level < 0 {
      callback([-1.0])
    } else {
      callback([level])
    }
  }
}
