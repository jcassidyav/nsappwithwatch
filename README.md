
A NS app with an associated watchos app.

The app demonstrates communication from the phone app to the watch.

If you launch the phone app and the watch app you can click the "Send Message To Phone" button and should see the number on the screen change in sync.

## Building scenario

I wanted a cli based build that I can build with iOS App Development profiles to put on various test devices.

To do the same you will need to change the app id in nativescript.config.ts and have 3 corresponding profiles for the app, watch app and extension.

And modify ios_build_options/exportPlist.plist to match.

## Extras Vs https://docs.nativescript.org/environment-setup.html#building-for-smart-watches

see additions to 
* App_Resources/iOS/watchextension/jasonwapp%20Extension/extension.json
* App_Resources/iOS/watchapp/jasonwapp/watchapp.json

xcode 13 does not generate the info.plist for the watch apps so extra work would have to be done to add them manually. ( I used 12.5 to generate)

## Building

nsappwithwatch = whatever the directory it is checked out to is named.

1. run ```ns prepare ios```

    A plugin modifies the generated IOS project in two ways to allow building ( in after-prepare )

    * sets ```SUPPORTS_UIKITFORMAC = NO``` (from project template it is set to YES)
    * replaces ```CODE_SIGN_IDENTITY[sdk=iphoneos*]``` with ```CODE_SIGN_IDENTITY``` as per https://github.com/NativeScript/nativescript-cli/issues/5291
       Checking ``` config.ast.value.get("buildSettings").get("SDKROOT") ``` in pbxproj-dom/xcode.ts could decide to set the sdk

1. run archive
   ```xcodebuild -workspace platforms/ios/nsappwithwatch.xcworkspace -scheme nsappwithwatch archive DEVELOPMENT_TEAM=<TEAM ID> -archivePath builds/MyApp.xcarchive -allowProvisioningUpdates```
2. run export ( the exportPlist.plist need to be edited for your profile uuids etc.)
   ```xcodebuild -exportArchive -exportOptionsPlist ios_build_options/exportPlist.plist -archivePath builds/MyApp.xcarchive -exportPath builds/out```
   
Assuming the 3 development profiles for the app, watchapp, extension are already available on the machine out will pop out an ipa that will run on devices.

HOWEVER I ran into this issue: https://developer.apple.com/forums/thread/682775?page=3 because my phone is on IOS15

Resigning the watch app was the only resolution that worked for me.

Steps to resign: ( while in ```builds/out``` )
1. Unpack the ipa
    
    ```unzip -q nsappwithwatch.ipa```
1. Resign the watch extension

     ```codesign -s "Your Code Sign Identity" -f --preserve-metadata --generate-entitlement-der  Payload/nsappwithwatch.app/Watch/jasonwapp.app/Plugins/jasonwapp\ Extension.appex```

1. Resign the watch app
    ```codesign -s "Your Codesign Identity" -f --preserve-metadata --generate-entitlement-der Payload/nsappwithwatch.app/Watch/jasonwapp.app```
     
1. Resign the main app

   ```codesign -s "Your Codesign Identity" -f --preserve-metadata --generate-entitlement-der Payload/nsappwithwatch.app```

1. Repackage the ipa

    ```zip -qr "app-resigned.ipa" Payload```

     


## Building with ns

With the above ```ns run ios``` will launch the app but not the watch app in the simulators.

I don't think building/signing will work with ns because of the exportOptions issue  https://github.com/NativeScript/nativescript-cli/issues/5291

## Versions
* ns 8.1.3
* xcode 13 

Downgrade the watch simulator os to 7.0 ( there is a bug in the latest watch os simulator that the communication from app to watch does not work and fails sliently)
