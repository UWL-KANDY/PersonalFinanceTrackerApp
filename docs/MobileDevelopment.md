# Mobile Development Guide

This guide provides instructions for deploying the project to test iOS and Android devices, as well as publishing it to the App Store and Google Play Store.

## Prerequisites

1. Ensure you have the following installed on your system:
   - [Node.js](https://nodejs.org/) (LTS version recommended)
   - [npm](https://www.npmjs.com/)
   - [Capacitor CLI](https://capacitorjs.com/) (`npm install -g @capacitor/cli`)
   - [Xcode](https://developer.apple.com/xcode/) (for iOS development)
   - [Android Studio](https://developer.android.com/studio) (for Android development)

2. Export your project to your own GitHub repository using the "Export to GitHub" button.

3. Clone the project from your GitHub repository:
   ```bash
   git clone <your-repository-url>
   cd <your-project-folder>
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

## Testing on iOS and Android

1. Add iOS and/or Android platforms:
   ```bash
   npx cap add ios
   npx cap add android
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Sync the web code to the native projects:
   ```bash
   npx cap sync
   ```

4. Open the native projects:
   - For iOS:
     ```bash
     npx cap open ios
     ```
   - For Android:
     ```bash
     npx cap open android
     ```

5. Run the app on a simulator or connected device:
   - For iOS: Use Xcode to run the app on a simulator or physical device.
   - For Android: Use Android Studio to run the app on an emulator or physical device.

## Publishing to the App Store (iOS)

1. Open the iOS project in Xcode:
   ```bash
   npx cap open ios
   ```

2. Update the app's metadata in Xcode (e.g., app name, bundle identifier, version, etc.).

3. Archive the app for distribution:
   - In Xcode, go to **Product > Archive**.

4. Upload the app to the App Store:
   - Use the **Organizer** window in Xcode to upload the app to App Store Connect.

5. Log in to [App Store Connect](https://appstoreconnect.apple.com/) and submit the app for review.

## Publishing to Google Play Store (Android)

1. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```

2. Update the app's metadata in Android Studio (e.g., app name, package name, version, etc.).

3. Generate a signed APK or App Bundle:
   - In Android Studio, go to **Build > Generate Signed Bundle / APK**.

4. Upload the APK or App Bundle to the Google Play Console:
   - Log in to [Google Play Console](https://play.google.com/console) and create a new app.
   - Upload the generated APK or App Bundle and complete the app's metadata.

5. Submit the app for review.

## Automating Build for iOS and Android

You can use the following npm script to build the project, sync it with Capacitor, and open both iOS and Android simulators:

Add this script to your `package.json`:
```json
"scripts": {
  "build:mobile": "npm run build && npx cap sync && npx cap open ios && npx cap open android"
}
```

Run the script:
```bash
npm run build:mobile
```

This will:
- Build the project.
- Sync the web code to the native projects.
- Open the iOS and Android projects in their respective IDEs.

---

Follow these steps to test and deploy your app successfully. Let us know if you encounter any issues!