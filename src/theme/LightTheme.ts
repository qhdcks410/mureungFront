import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const PurpleTheme: ThemeTypes = {
  name: 'PurpleTheme',
  dark: false,
  variables: {
    'border-color': '#1e88e5',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#4f46e5', // Indigo 600
    secondary: '#64748b', // Slate 500
    info: '#0ea5e9', // Sky 500
    success: '#10b981', // Emerald 500
    accent: '#f59e0b', // Amber 500
    warning: '#f97316', // Orange 500
    error: '#ef4444', // Red 500
    lightprimary: '#eef2ff',
    lightsecondary: '#f1f5f9',
    lightsuccess: '#ecfdf5',
    lighterror: '#fef2f2',
    lightwarning: '#fff7ed',
    darkText: '#1e293b',
    lightText: '#64748b',
    darkprimary: '#3730a3',
    darksecondary: '#475569',
    borderLight: '#e2e8f0',
    inputBorder: '#cbd5e1',
    containerBg: '#f8fafc',
    surface: '#ffffff',
    'on-surface-variant': '#ffffff',
    facebook: '#1877f2',
    twitter: '#1da1f2',
    linkedin: '#0a66c2',
    gray100: '#f8fafc',
    primary200: '#c7d2fe',
    secondary200: '#e2e8f0'
  }
};

export { PurpleTheme };
