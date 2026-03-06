import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import { Theme } from "./backend.d";
import AboutPage from "./components/AboutPage";
import GeolocationScreen from "./components/GeolocationScreen";
import HomeScreen from "./components/HomeScreen";
import SetupScreen from "./components/SetupScreen";

type AppScreen = "geo" | "setup" | "home" | "about";

interface ContactConfig {
  contactName: string;
  whatsapp: string;
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("geo");
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("alertes_theme") as Theme) || Theme.dark;
  });
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [contact, setContact] = useState<ContactConfig>(() => ({
    contactName: localStorage.getItem("alertes_contact_name") || "",
    whatsapp: localStorage.getItem("alertes_whatsapp") || "",
  }));

  // Apply theme to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (theme === Theme.dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("alertes_theme", theme);
  }, [theme]);

  const handleGeoGranted = useCallback((position: GeolocationCoordinates) => {
    setCoords(position);
    const hasConfig =
      localStorage.getItem("alertes_contact_name") &&
      localStorage.getItem("alertes_whatsapp");
    if (hasConfig) {
      setScreen("home");
    } else {
      setScreen("setup");
    }
  }, []);

  const handleSetupComplete = useCallback((config: ContactConfig) => {
    setContact(config);
    setScreen("home");
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === Theme.dark ? Theme.light : Theme.dark));
  }, []);

  const handleSettingsSaved = useCallback((config: ContactConfig) => {
    setContact(config);
  }, []);

  return (
    <div className="scan-overlay min-h-screen bg-background text-foreground">
      {screen === "geo" && (
        <GeolocationScreen theme={theme} onGranted={handleGeoGranted} />
      )}
      {screen === "setup" && (
        <SetupScreen theme={theme} onComplete={handleSetupComplete} />
      )}
      {screen === "home" && (
        <HomeScreen
          theme={theme}
          coords={coords}
          contact={contact}
          onThemeToggle={handleThemeToggle}
          onAbout={() => setScreen("about")}
          onSettingsSaved={handleSettingsSaved}
          onCoordsUpdate={setCoords}
        />
      )}
      {screen === "about" && (
        <AboutPage
          theme={theme}
          onBack={() => setScreen("home")}
          onThemeToggle={handleThemeToggle}
        />
      )}
      <Toaster
        position="top-center"
        theme={theme === Theme.dark ? "dark" : "light"}
        toastOptions={{
          style: {
            background:
              theme === Theme.dark ? "oklch(0.11 0.005 260)" : "white",
            border: `1px solid oklch(${theme === Theme.dark ? "0.58" : "0.52"} 0.22 26 / 0.4)`,
            color: theme === Theme.dark ? "white" : "black",
          },
        }}
      />
    </div>
  );
}
