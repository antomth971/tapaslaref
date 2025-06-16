# Frontend - Expo (React Native)

- [Frontend - Expo (React Native)](#frontend---expo-react-native)
  - [Commands](#commands)
  - [Structure](#structure)
    - [app](#app)
    - [assets](#assets)
    - [components](#components)
    - [constants](#constants)
    - [hooks](#hooks)
  - [Additional Files](#additional-files)
- [Skeleton](#skeleton)

## Commands

- `npm start` : to start the frontend server (Expo)
- `npm run lint` : to lint the code

## Structure

### app
The **app** directory contains the core of the Expo application. Here you can set up navigation (for example with React Navigation) and structure the different **screens**.

### assets
The **assets** directory holds all the static resources required by the application, such as images, icons, or fonts.

### components
The **components** directory contains all the reusable UI components. These components are small building blocks (buttons, form fields, cards, etc.) that can be imported into various **screens**.

### constants
The **constants** directory stores the application's constants (for instance, colors, font sizes, or API variables). Its objective is to centralize static values to avoid rewriting them in different parts of the code.

### hooks
The **hooks** directory contains custom **Hooks** used in the application. These are TypeScript functions that encapsulate reusable logic related to React (for example, a hook for authentication management or a hook for API calls).

## Additional Files

- **package.json** : Configuration file for dependencies and NPM/Yarn scripts.
- **README.md** : The main project documentation, usually containing installation and running instructions.
- **.gitignore** : A file specifying folders and files to be ignored by Git version control.

---

# Skeleton

The frontend of our application is built with **Expo** and is structured as follows:

```
frontend/
├── app/
│   ├── (tabs)/
│   ├── _layouts
│   └── +not-found
├── assets/
│   ├── fonts/
│   └── images/
├── components/
├── constants/
├── hooks/
│   ├── providers/
│   └── etc
├── services/
│   ├── AuthService.ts
│   └── etc
├── type/
│   ├── feature/
│   ├── request/
│   └── env.d.ts
├── .eslintrc.js
├── package.json
├── README.md
└── .gitignore
```
