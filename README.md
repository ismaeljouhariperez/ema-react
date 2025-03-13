# EMA Frontend

Frontend application for EMA (Explorer of Micro-Adventures), a platform for discovering and creating micro-adventures near you.

## 🌟 Features

- ✅ Discover adventures on an interactive map
- ✅ Search adventures by location, difficulty, duration
- ✅ Create custom adventures
- ✅ AI-assisted adventure generation
- ✅ Secure authentication
- ✅ Responsive UI and smooth animations
- ✅ Detailed route visualization on maps

## 🛠️ Technologies

- **React 18** - UI library
- **TypeScript** - Static typing
- **Vite** - Build tool and development server
- **React Router** - Navigation
- **React Query** - Server state management
- **Zustand** - Global state management
- **Tailwind CSS** - Styling
- **GSAP** - Complex animations
- **Leaflet** - Interactive maps
- **React Hook Form** - Form handling
- **Vitest** - Unit testing

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/ema-react.git
   cd ema-react
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 Project Structure

```
ema-frontend/
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # Reusable components
│   │   ├── common/           # Generic components
│   │   ├── layout/           # Layout components
│   │   ├── map/              # Map-related components
│   │   └── adventure/        # Adventure-specific components
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── services/             # API services
│   ├── store/                # State management
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Main App component
│   ├── index.tsx             # Entry point
│   └── routes.tsx            # Route definitions
```

## 🔄 Development Workflow

1. Make sure the Rails backend is running on `http://localhost:3000`
2. Start the React development server with `npm run dev`
3. To test AI features, ensure the ema-ai service is also running

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔍 Linting and Formatting

```bash
# Check code with ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 📦 Production Build

```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

## 📝 Documentation

- [Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md)
- [Backend Integration](./docs/BACKEND_INTEGRATION.md)
- [Cursor Snippets](./docs/CURSOR_SNIPPETS.md)

## 🤝 Contributing

1. Create a branch for your feature (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'feat: add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
