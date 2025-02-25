# 🌟 Blur Generator

Welcome to the **Blur Generator** project! This is a modern web application built with [Next.js](https://nextjs.org) and [Shadcn/ui](https://shadcn.dev). Our goal is to provide a sleek and efficient tool for generating blur effects on images. 🚀

## 🛠️ Tech Stack

- **Framework**: Next.js
- **UI Components**: Shadcn/ui
- **Icons**: Lucide Icons

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 📂 Project Structure

- **components/**: Contains all the React components used in the project.
  - **blur-generator.tsx**: Main component for generating blur effects.
  - **image-upload.tsx**: Component for uploading images.
  - **ui/**: Contains UI components like buttons, cards, dropzones, separators, and sliders.
- **lib/**: Utility functions.
- **public/**: Static files like images and icons.
- **app/**: Main application files including global styles and layout.
- **__tests__/**: Test files for components and utilities.

## 🧪 Testing

This project uses Jest and React Testing Library for testing. The test suite includes:

### Component Tests

- **BlurGenerator**: Tests the main blur generation component, including:
  - Initial rendering of the upload interface
  - Transition to blur interface after image upload
  - Reset functionality to return to the upload interface

- **ImageUpload**: Tests the image upload component, including:
  - Proper rendering of the upload interface
  - File input handling
  - Drag and drop functionality
  - Style changes during drag interactions

### Utility Tests

- **Image Processing**: Tests the image blur processing utility, ensuring:
  - Proper buffer handling
  - Default parameter usage

### Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Writing New Tests

When developing new features, please ensure you also write appropriate tests. Follow these guidelines:
1. Create tests in the `__tests__` directory with a structure that mirrors the project structure
2. Test component rendering, user interactions, and state changes
3. Mock external dependencies as needed
4. Write both unit tests and integration tests as appropriate

## 📚 Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Documentation](https://shadcn.dev/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)

## 🎉 Contributing

We welcome contributions! Feel free to open issues or submit pull requests. Let's make this project even better together! 💪

## 📄 License

This project is licensed under the MIT License.

## 🌐 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
