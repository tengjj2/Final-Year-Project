# Local Disaster Preparedness and Response App

A mobile application built with React Native and Expo to help users prepare for, respond to, and recover from disasters. Features include emergency alerts, preparedness tracking, gamified tasks, resource hub, and personalized settings.

---

## Installation & Setup

1. Install Dependencies
```bash
npm install
```

2. Start the Expo server
```bash
npx expo start
```

3. Scan the QR code to launch the app

## Libraries & Packages Used 
- Framework & UI: React Native, Expo, React Navigation (Native Stack)
- State Management: React Context API
- Localization: i18next, react-i18next, expo-localization
- Persistent Storage: @react-native-async-storage/async-storage
- Icons: @expo/vector-icons, react-native-vector-icons
- Other Expo Modules: expo-constants, expo-font, expo-haptics, expo-image, expo-linking, expo-location, expo-notifications, expo-permissions, expo-splash-screen, expo-status-bar, expo-system-ui, expo-updates, expo-web-browser
- Utilities: react-native-safe-area-context, react-native-gesture-handler, react-native-reanimated, react-native-screens

- Dev Dependencies: TypeScript, ESLint, eslint-config-expo, @types/react

## Folder Structure
- App.js - Entry point of the app
- i18n.js - Localization setup
- screens/ - App screens (Home, Resource Hub, Emergency Mode, Preparedness Zone, Rewards, Tasks, Settings)
- helpers/ - Reusable helpers (theme, gamification, resource, location, font, language, settings)
- data/ - JSON files for tasks, quizzes, badges, and resources
- locales/ - JSON files for translation storage

## Acknowledgements / References
- i18next and react-i18next for localization
- Expo for cross-platform mobile development
- React Navigation for app navigation
- Open-source icons and assets used in the UI

## License
This project is for academic purposes and does not include a license.