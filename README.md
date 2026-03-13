# Coffee Guardian - AI Coffee Disease Detection

**Coffee Guardian** is a React frontend for AI-powered coffee leaf disease detection. It connects to an external ML API to help coffee farmers identify diseases early and provides treatment recommendations.

## Features

✨ **AI Disease Detection**
- Real-time disease diagnosis with confidence scoring
- Predicts: Healthy, Red Spider Mite, Rust
- Severity classification and affected area estimation

🔐 **Authentication System**
- Supabase authentication with email/password
- Secure user profiles and session management
- Protected routes for premium features
- Profile settings and security management

📱 **Mobile-Friendly**
- Responsive design works on desktop, tablet, and mobile
- Image upload and camera capture support

🌍 **Multi-Language Support**
- English
- Kinyarwanda

✨ **Smooth Animations**
- Fade-in, slide, and scale animations
- Progress indicators and loading states
- Beautiful UI with Tailwind CSS

💾 **Database & Storage**
- Supabase PostgreSQL database
- User profiles and diagnosis history
- User preferences and settings

## Quick Start

### Prerequisites

- Node.js 18+ and npm

## Link of the App on Deployed render

https://coffee-guardian-cz50.onrender.com/

## Link to the Notebook

https://colab.research.google.com/drive/1329RDdWVMRZIwqBep6FSZxPVOOQ2Ex9z?usp=sharing

## Link to the Video Demo

https://drive.google.com/file/d/1Yf-vMjLuUpaidvusJ9-4b2IeXIWgXbpm/view?usp=sharing

## Testing Results Screenshots

<img width="1440" height="900" alt="Screenshot 2026-03-13 at 7 08 08 PM" src="https://github.com/user-attachments/assets/98474eb3-1ab8-4a97-b9fe-4fda9ae0035f" />

<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/e6a9c252-94b6-47a0-abae-d1e3eea82281" />

<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/0ba91238-b306-495e-b536-0d3e5f1c3ad8" />

<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/b6154ece-4408-4e47-a2e3-a4a786a1ceac" />

<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/cf73782e-6bdf-49bb-ac20-5107e1000daa" />

<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/9e93b190-2a18-4af2-8b47-2a366aa2b983" />


### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/coffee-guardians.git
cd coffee-guardians

# Install dependencies
npm install

# Copy example env
cp .env.example .env
```

### Configure Environment

Edit `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Run Development Server

```bash
npm run dev
```

Visit **http://localhost:5173** in your browser.

## Project Structure

```
coffee-guardians/
├── src/
│   ├── pages/             # Page components
│   │   ├── LoginPage.tsx
│   │   ├── UploadPage.tsx
│   │   ├── ResultPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── SettingsPage.tsx
│   ├── components/        # Reusable components
│   ├── contexts/          # React Context (Auth, Language)
│   ├── hooks/             # Custom React hooks
│   ├── lib/
│   │   ├── ml-service.ts  # ML API client
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # Utility functions
│   └── index.css          # Global styles + animations
├── public/                # Static assets
├── package.json
└── README.md
```

## Available Routes

| Route | Auth Required | Description |
|-------|---------------|-------------|
| `/` | No | Homepage with features |
| `/login` | No | User login |
| `/signup` | No | New user registration |
| `/forgot-password` | No | Password reset |
| `/upload` | Yes | Upload image for diagnosis |
| `/result` | Yes | View diagnosis results |
| `/history` | Yes | View past diagnoses |
| `/settings` | Yes | User profile & settings |

## Build & Deploy

### Build for Production

```bash
npm run build
```

Generates optimized files in `dist/` directory.

### Deploy

- **Vercel**: `vercel`
- **Netlify**: `netlify deploy --prod --dir=dist`
- **GitHub Pages**: Configure in repository settings

## Technologies

- React 18.3
- TypeScript 5.8
- Vite 5.4
- Tailwind CSS 3.4
- shadcn/ui
- Supabase (Auth & Database)
- lucide-react (icons)

## Available Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source. See LICENSE file for details.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
