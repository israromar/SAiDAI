import Foundation
import UIKit

@objc(DeviceInfoModule)
class DeviceInfoModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc
  func getDeviceInfo(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let device = UIDevice.current
    let info: [String: Any] = [
      "name": device.name,
      "systemName": device.systemName,
      "systemVersion": device.systemVersion,
      "model": device.model,
      "localizedModel": device.localizedModel
    ]
    resolve(info)
  }
}
