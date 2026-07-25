# React Native Snake Game

Classic arcade Snake with modern mobile controls — built with React Native.

<p align="center">
  <img src="examples/2.png" height="420" alt="Splash screen" />
  <img src="examples/3.png" height="420" alt="Home menu" />
  <img src="examples/4.png" height="420" alt="Gameplay" />
</p>

<p align="center">
  <img src="examples/5.png" height="420" alt="Game over" />
  <img src="examples/1.png" height="420" alt="App icon on home screen" />
</p>

## Features

- **Board size** — 15×20 or 20×20 grid
- **Difficulty** — Easy, Normal, Hard
- **Color themes** — Yellow, Blue, Green
- **Controls** — On-screen D-Pad or swipe gestures
- **Wall behavior** — Classic game over, or teleport through walls
- **Persistent settings** — Preferences saved with AsyncStorage / MobX

## Screenshots

| Splash | Home | Gameplay | Game over |
| --- | --- | --- | --- |
| ![Splash](examples/2.png) | ![Home](examples/3.png) | ![Gameplay](examples/4.png) | ![Game over](examples/5.png) |

## Quick start

**Requirements:** Node.js ≥ 18, JDK 17+, Android Studio / SDK (Android) or Xcode (iOS).

```bash
git clone <repo-url>
cd React-Native-Snake-Game
npm install
```

### Android

```bash
npm start          # Metro (separate terminal)
npm run android
```

### iOS (macOS)

```bash
cd ios && pod install && cd ..
npm start
npm run ios
```

For full environment setup, architecture notes, and troubleshooting, see **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)**.

## Stack

| Area | Choice |
| --- | --- |
| Framework | React Native 0.76 |
| Language | TypeScript |
| State | MobX + mobx-persist |
| Navigation | React Navigation (stack) |
| Game loop | react-native-game-engine |
