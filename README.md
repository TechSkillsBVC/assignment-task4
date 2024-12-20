# Mobile Application Task 4

A React Native mobile application with TypeScript, featuring authentication, navigation, map integration, and terminal command utilities.

## Author
Shadman Sakib

## Features

- User authentication with protected routes
- Map integration
- Custom components with TypeScript
- Terminal command execution support
- Image upload capabilities via ImgBB
- Comprehensive testing setup
- ESLint configuration
- Error boundary implementation

## Environment Configuration

The application uses the following environment variables:
```typescript
API_URL: 'http://192.168.1.86:3000'  // Development server URL
IMGBB_API_KEY: '9c51a3a2c427154e10112b17e4d5a2e0'  // ImgBB API key
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/shadmansakib/assignment-task4.git
cd assignment-task4
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn start
```

## Pushing to GitHub

1. Initialize Git repository (if not already done):
```bash
git init
```

2. Add all files:
```bash
git add .
```

3. Create initial commit:
```bash
git commit -m "Initial commit: Complete mobile application with TypeScript"
```

4. Add remote repository:
```bash
git remote add origin https://github.com/shadmansakib/assignment-task4.git
```

5. Push to GitHub:
```bash
git push -u origin main
```

## Project Structure

```
src/
├── @types/          # TypeScript type definitions
├── components/      # Reusable UI components
├── config/          # Environment configuration
├── constants/       # Application constants
├── context/         # React Context providers
├── images/          # Image assets
├── pages/          # Screen components
├── routes/         # Navigation configuration
├── services/       # API and service integrations
├── types/          # TypeScript interfaces
└── utils/          # Utility functions including terminal commands
```

## Available Scripts

- `yarn start`: Start the development server
- `yarn android`: Run on Android
- `yarn ios`: Run on iOS
- `yarn web`: Run on web browser
- `yarn test`: Run tests
- `yarn lint`: Run ESLint

## Testing

The project includes Jest and React Native Testing Library setup. Run tests with:
```bash
yarn test
```

## Documentation

For detailed documentation about the project structure, components, and best practices, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## License

This project is private and not licensed for public use.
