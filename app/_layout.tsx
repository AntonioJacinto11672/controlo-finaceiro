import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import "../global.css";

import Loading from '@/components/Loanding';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { StatusBar } from 'react-native';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return <Loading />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <CartProvider>
          <Slot />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}