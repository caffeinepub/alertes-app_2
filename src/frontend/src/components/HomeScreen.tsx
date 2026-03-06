import {
  Info,
  Loader2,
  MapPin,
  Moon,
  Navigation,
  Settings,
  Sun,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type Coordinates, Theme } from "../backend.d";
import { useActor } from "../hooks/useActor";
import SettingsModal from "./SettingsModal";

interface HomeScreenProps {
  theme: Theme;
  coords: GeolocationCoordinates | null;
  contact: { contactName: string; whatsapp: string };
  onThemeToggle: () => void;
  onAbout: () => void;
  onSettingsSaved: (config: { contactName: string; whatsapp: string }) => void;
  onCoordsUpdate: (coords: GeolocationCoordinates) => void;
}

function formatCoord(val: number, pos: string, neg: string) {
  const dir = val >= 0 ? pos : neg;
  const abs = Math.abs(val);
  const deg = Math.floor(abs);
  const minFull = (abs - deg) * 60;
  const min = Math.floor(minFull);
  const sec = ((minFull - min) * 60).toFixed(2);
  return `${deg}°${min}'${sec}"${dir}`;
}

export default function HomeScreen({
  theme,
  coords,
  contact,
  onThemeToggle,
  onAbout,
  onSettingsSaved,
  onCoordsUpdate,
}: HomeScreenProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alerting, setAlerting] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(coords);
  const watchIdRef = useRef<number | null>(null);
  const { actor } = useActor();

  // Live GPS updates
  useEffect(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentCoords(pos.coords);
        onCoordsUpdate(pos.coords);
      },
      () => {
        // silently fail - use last known coords
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 30000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [onCoordsUpdate]);

  const handleAlert = useCallback(async () => {
    if (alerting) return;

    const whatsappDigits = contact.whatsapp.replace(/\D/g, "");
    if (!whatsappDigits) {
      toast.error("Numéro WhatsApp non configuré. Vérifiez les paramètres.");
      return;
    }

    setAlerting(true);

    let message: string;

    if (currentCoords && actor) {
      const backendCoords: Coordinates = {
        latitude: currentCoords.latitude,
        longitude: currentCoords.longitude,
      };
      try {
        message = await actor.generateAlertMessage(backendCoords);
      } catch {
        // Fallback message in French
        const now = new Date();
        const dateStr = now.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const mapUrl = `https://maps.google.com/maps?q=${currentCoords.latitude},${currentCoords.longitude}`;
        message = `🚨 ALERTE - Alertes.App\n\nHeure: ${dateStr}\nPosition GPS:\nLat: ${currentCoords.latitude.toFixed(6)}\nLon: ${currentCoords.longitude.toFixed(6)}\nCarte: ${mapUrl}\n\nJ'ai besoin d'aide !`;
      }
    } else {
      const now = new Date();
      const dateStr = now.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      message = `🚨 ALERTE - Alertes.App\n\nHeure: ${dateStr}\nPosition GPS non disponible.\n\nJ'ai besoin d'aide !`;
    }

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${whatsappDigits}?text=${encodedMsg}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    toast.success(`Alerte envoyée à ${contact.contactName} !`, {
      duration: 4000,
    });

    // Flash effect then reset
    setTimeout(() => {
      setAlerting(false);
    }, 1500);
  }, [alerting, currentCoords, contact, actor]);

  const lat = currentCoords?.latitude;
  const lon = currentCoords?.longitude;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 65%, oklch(0.58 0.22 26 / 0.08) 0%, transparent 55%), radial-gradient(circle at 80% 10%, oklch(0.58 0.22 26 / 0.03) 0%, transparent 30%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.58 0.22 26) 1px, transparent 1px), linear-gradient(90deg, oklch(0.58 0.22 26) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-5 pb-3">
        {/* App title */}
        <h1
          className="text-2xl font-black tracking-tight"
          style={{
            color: "oklch(0.65 0.22 26)",
            textShadow:
              theme === Theme.dark
                ? "0 0 15px oklch(0.65 0.22 26 / 0.4)"
                : "none",
            letterSpacing: "-0.02em",
          }}
        >
          Alertes.App
        </h1>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            data-ocid="home.about_button"
            onClick={onAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
            style={{
              background: "oklch(0.58 0.22 26 / 0.1)",
              color:
                theme === Theme.dark ? "oklch(0.85 0 0)" : "oklch(0.25 0 0)",
              border: "1px solid oklch(0.58 0.22 26 / 0.2)",
            }}
            aria-label="À propos"
          >
            <Info className="w-3.5 h-3.5" />À propos
          </button>

          <button
            type="button"
            data-ocid="home.settings_button"
            onClick={() => setSettingsOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
            style={{
              background: "oklch(0.58 0.22 26 / 0.1)",
              border: "1px solid oklch(0.58 0.22 26 / 0.2)",
              color:
                theme === Theme.dark ? "oklch(0.85 0 0)" : "oklch(0.25 0 0)",
            }}
            aria-label="Paramètres"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            data-ocid="home.theme_toggle"
            onClick={onThemeToggle}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
            style={{
              background: "oklch(0.58 0.22 26 / 0.1)",
              border: "1px solid oklch(0.58 0.22 26 / 0.2)",
              color:
                theme === Theme.dark ? "oklch(0.85 0 0)" : "oklch(0.25 0 0)",
            }}
            aria-label={theme === Theme.dark ? "Mode jour" : "Mode nuit"}
          >
            {theme === Theme.dark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Divider */}
      <div
        className="mx-4"
        style={{
          height: "1px",
          background: "oklch(0.58 0.22 26 / 0.15)",
        }}
      />

      {/* GPS display */}
      <div className="relative z-10 px-4 py-3">
        <div
          data-ocid="home.location_display"
          className="rounded-xl p-3 flex items-start gap-3"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(0.58 0.22 26 / 0.15)",
          }}
        >
          <div className="flex items-center gap-2 mt-0.5">
            {currentCoords ? (
              <Navigation
                className="w-4 h-4 gps-blink flex-shrink-0"
                style={{ color: "oklch(0.65 0.22 26)" }}
              />
            ) : (
              <Loader2
                className="w-4 h-4 animate-spin flex-shrink-0"
                style={{ color: "oklch(0.65 0.22 26)" }}
              />
            )}
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "oklch(0.65 0.22 26)" }}
            >
              GPS
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: currentCoords
                  ? "oklch(0.58 0.22 26 / 0.15)"
                  : "oklch(var(--muted))",
                color: currentCoords
                  ? "oklch(0.65 0.22 26)"
                  : "oklch(var(--muted-foreground))",
                fontSize: "10px",
              }}
            >
              {currentCoords ? "ACTIF" : "..."}
            </span>
          </div>

          {currentCoords && lat !== undefined && lon !== undefined ? (
            <div className="flex-1 min-w-0">
              <p
                className="gps-display text-xs leading-relaxed"
                style={{
                  color:
                    theme === Theme.dark
                      ? "oklch(0.75 0 0)"
                      : "oklch(0.35 0 0)",
                }}
              >
                <span className="block">{formatCoord(lat, "N", "S")}</span>
                <span className="block">{formatCoord(lon, "E", "O")}</span>
                <span
                  className="block mt-0.5"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  ±{Math.round(currentCoords.accuracy)}m
                </span>
              </p>
              <a
                href={`https://maps.google.com/maps?q=${lat},${lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 text-xs hover:underline"
                style={{ color: "oklch(0.62 0.18 26)" }}
              >
                <MapPin className="w-3 h-3" />
                Voir sur la carte
              </a>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Acquisition du signal GPS...
            </p>
          )}
        </div>
      </div>

      {/* Main alert area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-8 px-4">
        {/* Contact info */}
        {contact.contactName && (
          <div className="text-center mb-8 fade-in">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Contact d'urgence
            </p>
            <p
              className="text-lg font-bold"
              style={{
                color:
                  theme === Theme.dark ? "oklch(0.9 0 0)" : "oklch(0.15 0 0)",
              }}
            >
              {contact.contactName}
            </p>
          </div>
        )}

        {/* Alert button with radar rings */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 240, height: 240 }}
        >
          {/* Radar rings */}
          <div
            className="absolute rounded-full alert-ring-3"
            style={{
              width: 240,
              height: 240,
              background: "transparent",
              border: "2px solid oklch(0.58 0.22 26 / 0.15)",
            }}
          />
          <div
            className="absolute rounded-full alert-ring-2"
            style={{
              width: 196,
              height: 196,
              background: "transparent",
              border: "2px solid oklch(0.58 0.22 26 / 0.25)",
            }}
          />
          <div
            className="absolute rounded-full alert-ring-1"
            style={{
              width: 152,
              height: 152,
              background: "transparent",
              border: "2px solid oklch(0.58 0.22 26 / 0.4)",
            }}
          />

          {/* Main button */}
          <button
            type="button"
            data-ocid="home.alert_button"
            onClick={handleAlert}
            disabled={alerting}
            className={`
              absolute rounded-full flex flex-col items-center justify-center
              transition-transform hover:scale-105 active:scale-95
              disabled:cursor-not-allowed
              ${alerting ? "alert-flashing" : ""}
            `}
            style={{
              width: 160,
              height: 160,
              background: alerting
                ? "oklch(0.45 0.2 26)"
                : "radial-gradient(circle at 35% 35%, oklch(0.68 0.22 26), oklch(0.45 0.22 26))",
              boxShadow: alerting
                ? "0 0 40px oklch(0.58 0.22 26 / 0.7), 0 0 80px oklch(0.58 0.22 26 / 0.3), inset 0 2px 0 oklch(0.72 0.2 26 / 0.3)"
                : "0 0 30px oklch(0.58 0.22 26 / 0.5), 0 0 60px oklch(0.58 0.22 26 / 0.2), inset 0 2px 0 oklch(0.72 0.2 26 / 0.3)",
            }}
            aria-label="Envoyer une alerte d'urgence"
          >
            {alerting ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <>
                <span
                  className="text-white font-black text-center leading-tight"
                  style={{ fontSize: "15px", letterSpacing: "0.05em" }}
                >
                  ALERTE
                </span>
                <span
                  className="text-white/60 text-center"
                  style={{ fontSize: "11px", marginTop: "4px" }}
                >
                  Appuyer
                </span>
              </>
            )}
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center max-w-[220px] leading-relaxed">
          Appuyez sur le bouton pour envoyer votre position actuelle via
          WhatsApp à{" "}
          <strong
            style={{
              color: theme === Theme.dark ? "oklch(0.9 0 0)" : "oklch(0.2 0 0)",
            }}
          >
            {contact.contactName || "votre contact d'urgence"}
          </strong>
        </p>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 pb-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "oklch(0.65 0.22 26)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Settings modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        initialContactName={contact.contactName}
        initialWhatsapp={contact.whatsapp}
        onSaved={onSettingsSaved}
      />
    </div>
  );
}
