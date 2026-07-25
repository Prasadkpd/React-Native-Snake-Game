# Developer Guide

Guide for setting up, running, and extending the React Native Snake Game.

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Project setup](#project-setup)
3. [Running the app](#running-the-app)
4. [Android emulator (CLI)](#android-emulator-cli)
5. [Project structure](#project-structure)
6. [Architecture](#architecture)
7. [Settings & game rules](#settings--game-rules)
8. [Scripts](#scripts)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Notes |
| --- | --- |
| **Node.js** | ≥ 18 (`engines` in `package.json`). Check with `node -v`. |
| **npm** | Comes with Node. |
| **JDK** | 17+ recommended for RN 0.76. JDK 21 works. Set `JAVA_HOME`. |
| **Android SDK** | Platform 35, Build-Tools 35.0.0, platform-tools, emulator. Set `ANDROID_HOME`. |
| **Xcode** | macOS only, for iOS builds. CocoaPods for `ios/`. |

### Environment variables (Windows example)

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:Path"
```

Persist user-level vars if you want them in every new shell:

```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", $env:JAVA_HOME, "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $env:ANDROID_HOME, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $env:ANDROID_HOME, "User")
```

Point Gradle at the SDK (gitignored):

```properties
# android/local.properties
sdk.dir=C\:\\Users\\<you>\\AppData\\Local\\Android\\Sdk
```

---

## Project setup

```bash
git clone <repo-url>
cd React-Native-Snake-Game
npm install
```

### Notes on `postinstall`

`package.json` runs `scripts/postinstall.sh`, which executes `pod install` under `ios/`. On **Windows** that step fails (no Bash/CocoaPods) — that is expected. Dependencies under `node_modules` still install. Skip or ignore the postinstall error on Windows; run pods only on macOS:

```bash
cd ios && pod install && cd ..
```

---

## Running the app

Start Metro, then install/launch on a device or emulator.

```bash
# Terminal 1
npm start

# Terminal 2 — Android
npm run android

# Terminal 2 — iOS
npm run ios
```

Useful flags:

```bash
npx react-native run-android --no-packager --active-arch-only
```

- `--no-packager` — Metro already running  
- `--active-arch-only` — faster debug builds (current ABI only)

Stop the app on a connected emulator/device:

```bash
adb shell am force-stop com.snake
```

---

## Android emulator (CLI)

If Android Studio UI is unavailable, you can install the SDK and an AVD from the command line.

### 1. Command-line tools

Download [commandlinetools](https://developer.android.com/studio#command-line-tools-only) and unpack to:

```text
%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\
```

### 2. Packages

```bash
sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0" "emulator" "system-images;android-35;google_apis;x86_64" "ndk;26.1.10909125"
```

NDK `26.1.10909125` matches `android/build.gradle` (`ndkVersion`) and is pulled automatically by some native modules (e.g. `react-native-screens`) if missing.

### 3. Create & boot an AVD

```bash
avdmanager create avd -n Pixel_API_35 -k "system-images;android-35;google_apis;x86_64" -d "pixel_6" --force
emulator -avd Pixel_API_35 -no-snapshot-save -no-boot-anim
```

Wait until boot completes:

```bash
adb wait-for-device
adb shell getprop sys.boot_completed   # expect: 1
```

---

## Project structure

```text
React-Native-Snake-Game/
├── android/                 # Native Android project
├── ios/                     # Native iOS project
├── assets/                  # Fonts / static assets
├── examples/                # README screenshots
├── src/
│   ├── @constants/          # Themes, board sizes, difficulties
│   ├── components/          # Shared UI (Button, Header, Icon, Text, Layout)
│   ├── hooks/               # e.g. useInterval
│   ├── navigator/           # Loading + App stacks (React Navigation)
│   ├── screens/
│   │   ├── Home.tsx
│   │   ├── Settings.tsx
│   │   ├── Loading.tsx
│   │   └── Game/            # Board, entities, systems, HUD
│   ├── stores/              # MobX (SettingsStore, AppStore)
│   ├── utils/
│   └── App.tsx
├── DEVELOPER_GUIDE.md
├── README.md
└── package.json
```

Package aliases (see `babel.config.js` / `tsconfig.json`) resolve imports like `components/...`, `stores/...`, `@constants`.

---

## Architecture

### Navigation

1. **Loading stack** — hydrates persisted settings, shows splash for `LOADING_DURATION` (1.5s).
2. **App stack** — Home → Game / Settings.

### State (MobX)

| Store | Role |
| --- | --- |
| `SettingsStore` | Board size, difficulty, theme, swipes vs D-Pad, teleport. Persisted via `mobx-persist` + AsyncStorage. |
| `AppStore` | App-level UI / session helpers. |

Screens that depend on store data are wrapped with `observer` from `mobx-react`.

### Game loop

`react-native-game-engine` drives entities (`head`, `tail`, `food`) updated in `src/screens/Game/systems/index.ts`:

- Movement on a tick (`updateFrequency` from difficulty)
- Collision with self / walls (or wrap if teleport is on)
- Food spawn on empty cells
- Events: `food-eaten`, `game-over`

UI pieces live under `src/screens/Game/components/` (`Head`, `Tail`, `Food`, `BoardGrid`, `DirectionPad`, `GameOverModal`).

### Theming

Palettes are defined in `src/@constants/index.ts` (`ColorThemes.yellow | blue | green`). Settings updates the theme and navigation bar color via `utils/navigationBar`.

---

## Settings & game rules

| Setting | Values | Effect |
| --- | --- | --- |
| Board size | `15x20`, `20x20` | Grid dimensions |
| Difficulty | `low` / `medium` / `high` | Snake speed |
| Theme | yellow / blue / green | Colors for board, snake, food, chrome |
| Steering | D-Pad / Swipes | Input mode |
| Wall behavior | Game Over / Teleport | Die on wall vs wrap to opposite side |

Defaults: 15×20, Easy, yellow theme, D-Pad, Game Over walls (`SettingsStore.defaultSettings`).

---

## Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| Start Metro | `npm start` | Bundler |
| Android | `npm run android` | Build + install + launch |
| iOS | `npm run ios` | Build + launch (macOS) |
| Tests | `npm test` | Jest |
| Lint | `npm run lint` | ESLint |
| Hard reset | `npm run reset` | Clears Watchman/cache, reinstalls (Unix-oriented) |

---

## Troubleshooting

### Gradle fails under OneDrive (Windows)

Error resembling:

```text
Could not move temporary workspace (...\android\.gradle\...) to immutable location
```

OneDrive file locking breaks Gradle’s cache moves. Workarounds:

1. **Prefer** cloning/building outside OneDrive (e.g. `C:\dev\...`).
2. Or redirect the project cache:

```bash
npx react-native run-android --extra-params "--project-cache-dir=C:\gradle-cache\snake"
```

3. Clear a bad local cache: delete `android/.gradle`, then rebuild.

### `postinstall` / `scripts/postinstall.sh` fails on Windows

Safe to ignore for Android-only work. Run `pod install` on macOS when building iOS.

### Emulator not found / `adb devices` empty

- Ensure `ANDROID_HOME` and `platform-tools` are on `PATH`.
- Start an AVD before `npm run android`.
- Confirm Hyper-V / Windows Hypervisor Platform is enabled for hardware acceleration.

### Native module / NDK errors

Install NDK side-by-side version from `android/build.gradle`:

```bash
sdkmanager "ndk;26.1.10909125"
```

### Clean Android build

```bash
cd android
.\gradlew.bat clean
cd ..
npm run android
```

### Metro cache

```bash
npm start -- --reset-cache
```

---

## Contributing tips

- Match existing TypeScript + MobX patterns; keep game logic in `systems`, rendering in Game components.
- Prefer constants from `@constants` over hard-coded theme colors.
- Add new screenshots under `examples/` and reference them from `README.md`.
- Do not commit `android/local.properties`, `.gradle` outputs, or personal SDK paths.
