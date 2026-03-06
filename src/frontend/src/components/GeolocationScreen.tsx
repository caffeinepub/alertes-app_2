import { AlertTriangle, Loader2, MapPin, Shield } from "lucide-react";
import { useState } from "react";
import type { Theme } from "../backend.d";

interface GeolocationScreenProps {
  theme: Theme;
  onGranted: (coords: GeolocationCoordinates) => void;
}

type GeoState = "idle" | "requesting" | "denied" | "unavailable";

export default function GeolocationScreen({
  onGranted,
}: GeolocationScreenProps) {
  const [geoState, setGeoState] = useState<GeoState>("idle");

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoState("unavailable");
      return;
    }

    setGeoState("requesting");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onGranted(position.coords);
      },
      (error) => {
        if (
          error.code === GeolocationPositionError.PERMISSION_DENIED ||
          error.code === 1
        ) {
          setGeoState("denied");
        } else {
          setGeoState("unavailable");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, oklch(0.58 0.22 26 / 0.08) 0%, transparent 60%), radial-gradient(circle at 80% 80%, oklch(0.58 0.22 26 / 0.04) 0%, transparent 40%)",
        }}
      />

      {/* Geometric grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.58 0.22 26) 1px, transparent 1px), linear-gradient(90deg, oklch(0.58 0.22 26) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm fade-in">
        {/* App title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.58 0.22 26 / 0.15)",
                border: "2px solid oklch(0.58 0.22 26 / 0.4)",
              }}
            >
              <Shield
                className="w-6 h-6"
                style={{ color: "oklch(0.65 0.22 26)" }}
              />
            </div>
          </div>
          <h1
            className="text-4xl font-black tracking-tight mb-1"
            style={{
              fontFamily: '"Segoe UI", system-ui, sans-serif',
              color: "oklch(0.65 0.22 26)",
              textShadow: "0 0 20px oklch(0.65 0.22 26 / 0.3)",
            }}
          >
            Alertes.App
          </h1>
          <p className="text-sm text-muted-foreground tracking-widest uppercase font-medium">
            Sécurité personnelle
          </p>
        </div>

        {/* Main card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(0.58 0.22 26 / 0.2)",
            boxShadow:
              "0 4px 32px rgba(0,0,0,0.2), 0 0 0 1px oklch(0.58 0.22 26 / 0.05)",
          }}
        >
          {geoState === "denied" || geoState === "unavailable" ? (
            <div data-ocid="geo.error_state" className="text-center">
              <div className="flex justify-center mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.58 0.22 26 / 0.1)",
                    border: "2px solid oklch(0.58 0.22 26 / 0.4)",
                  }}
                >
                  <AlertTriangle
                    className="w-7 h-7"
                    style={{ color: "oklch(0.65 0.22 26)" }}
                  />
                </div>
              </div>

              <h2 className="text-lg font-bold mb-2 text-foreground">
                {geoState === "denied"
                  ? "Accès refusé"
                  : "Géolocalisation indisponible"}
              </h2>

              {geoState === "denied" ? (
                <div className="text-sm text-muted-foreground space-y-2 text-left">
                  <p className="text-center mb-4">
                    La géolocalisation est nécessaire pour envoyer votre
                    position dans les alertes d'urgence.
                  </p>
                  <p className="font-semibold text-foreground">
                    Pour réactiver :
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>
                      Cliquez sur l'icône de cadenas dans la barre d'adresse
                    </li>
                    <li>Sélectionnez "Paramètres du site"</li>
                    <li>Activez la "Localisation"</li>
                    <li>Rechargez la page</li>
                  </ol>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Votre appareil ne supporte pas la géolocalisation ou celle-ci
                  est désactivée dans vos paramètres système.
                </p>
              )}

              <button
                type="button"
                className="mt-5 w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
                style={{
                  background: "oklch(0.58 0.22 26)",
                  color: "white",
                }}
                onClick={() => {
                  setGeoState("idle");
                  window.location.reload();
                }}
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center relative"
                  style={{
                    background: "oklch(0.58 0.22 26 / 0.12)",
                    border: "2px solid oklch(0.58 0.22 26 / 0.35)",
                  }}
                >
                  {geoState === "requesting" ? (
                    <Loader2
                      className="w-8 h-8 animate-spin"
                      style={{ color: "oklch(0.65 0.22 26)" }}
                    />
                  ) : (
                    <MapPin
                      className="w-8 h-8"
                      style={{ color: "oklch(0.65 0.22 26)" }}
                    />
                  )}
                </div>
              </div>

              <h2 className="text-lg font-bold mb-3 text-foreground">
                {geoState === "requesting"
                  ? "Demande en cours..."
                  : "Autorisation requise"}
              </h2>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Alertes.App a besoin d'accéder à votre localisation GPS pour
                inclure vos coordonnées précises dans les messages d'alerte
                d'urgence envoyés à votre contact.
              </p>

              <div
                className="rounded-xl p-3 mb-5 text-left"
                style={{
                  background: "oklch(0.58 0.22 26 / 0.06)",
                  border: "1px solid oklch(0.58 0.22 26 / 0.2)",
                }}
              >
                <p className="text-xs text-muted-foreground leading-relaxed">
                  🔒 Votre position est utilisée uniquement lors de l'envoi
                  d'une alerte. Elle n'est jamais stockée ou partagée sans votre
                  action explicite.
                </p>
              </div>

              <button
                type="button"
                data-ocid="geo.permission_button"
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background:
                    geoState === "requesting"
                      ? "oklch(0.45 0.18 26)"
                      : "oklch(0.58 0.22 26)",
                  color: "white",
                  boxShadow:
                    geoState !== "requesting"
                      ? "0 4px 20px oklch(0.58 0.22 26 / 0.35)"
                      : "none",
                }}
                onClick={requestGeolocation}
                disabled={geoState === "requesting"}
              >
                {geoState === "requesting" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Localisation en cours...
                  </span>
                ) : (
                  "Autoriser la géolocalisation"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
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
      </div>
    </div>
  );
}
