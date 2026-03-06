import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lock,
  MapPin,
  MessageCircle,
  Moon,
  Shield,
  Sun,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Theme } from "../backend.d";
import { useAboutPage } from "../hooks/useQueries";

interface AboutPageProps {
  theme: Theme;
  onBack: () => void;
  onThemeToggle: () => void;
}

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Ma position est-elle partagée en permanence ?",
    a: "Non. Votre localisation GPS n'est accédée qu'au moment précis où vous appuyez sur le bouton d'alerte, et uniquement pour être incluse dans le message WhatsApp. Elle n'est jamais envoyée en arrière-plan.",
  },
  {
    q: "Que se passe-t-il si WhatsApp n'est pas installé ?",
    a: "L'application ouvre un lien wa.me dans votre navigateur. Si WhatsApp n'est pas installé, vous serez redirigé vers la page de téléchargement WhatsApp Web ou l'App Store.",
  },
  {
    q: "Puis-je configurer plusieurs contacts ?",
    a: "La version actuelle supporte un contact d'urgence principal. Vous pouvez modifier ce contact à tout moment via le bouton ⚙️ Paramètres.",
  },
  {
    q: "L'application fonctionne-t-elle sans connexion internet ?",
    a: "La géolocalisation GPS fonctionne hors ligne. Cependant, l'envoi de l'alerte WhatsApp nécessite une connexion internet pour ouvrir le lien.",
  },
  {
    q: "Comment intégrer ce widget dans mon site web ?",
    a: "Alertes.App est conçu pour être intégré via une balise <iframe> dans n'importe quel site web. Copiez simplement l'URL de l'application dans le src de l'iframe.",
  },
];

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={item.q}
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid oklch(0.58 0.22 26 / 0.15)",
            background: "oklch(var(--card))",
          }}
        >
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/30"
            onClick={() => setOpen(open === idx ? null : idx)}
            aria-expanded={open === idx}
          >
            <span className="text-sm font-semibold text-foreground pr-4">
              {item.q}
            </span>
            {open === idx ? (
              <ChevronUp
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "oklch(0.65 0.22 26)" }}
              />
            ) : (
              <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
            )}
          </button>
          {open === idx && (
            <div
              className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed"
              style={{
                borderTop: "1px solid oklch(0.58 0.22 26 / 0.1)",
              }}
            >
              <p className="pt-3">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div
      className="rounded-xl p-4 flex gap-4"
      style={{
        background: "oklch(var(--card))",
        border: "1px solid oklch(0.58 0.22 26 / 0.15)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "oklch(0.58 0.22 26 / 0.12)",
          border: "1px solid oklch(0.58 0.22 26 / 0.25)",
        }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage({
  theme,
  onBack,
  onThemeToggle,
}: AboutPageProps) {
  const { data: backendAbout } = useAboutPage();
  const [showBackendContent, setShowBackendContent] = useState(false);

  useEffect(() => {
    if (backendAbout && backendAbout.length > 10) {
      setShowBackendContent(true);
    }
  }, [backendAbout]);

  return (
    <div data-ocid="about.page" className="min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, oklch(0.58 0.22 26 / 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-4 pt-5 pb-3 sticky top-0"
        style={{
          background: "oklch(var(--background) / 0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          type="button"
          data-ocid="about.back_button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
          style={{
            background: "oklch(0.58 0.22 26 / 0.1)",
            color: theme === Theme.dark ? "oklch(0.85 0 0)" : "oklch(0.25 0 0)",
            border: "1px solid oklch(0.58 0.22 26 / 0.2)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <h1
          className="text-lg font-black tracking-tight"
          style={{ color: "oklch(0.65 0.22 26)" }}
        >
          Alertes.App
        </h1>

        <button
          type="button"
          onClick={onThemeToggle}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
          style={{
            background: "oklch(0.58 0.22 26 / 0.1)",
            border: "1px solid oklch(0.58 0.22 26 / 0.2)",
            color: theme === Theme.dark ? "oklch(0.85 0 0)" : "oklch(0.25 0 0)",
          }}
          aria-label={theme === Theme.dark ? "Mode jour" : "Mode nuit"}
        >
          {theme === Theme.dark ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </header>

      {/* Divider */}
      <div
        className="mx-4"
        style={{ height: "1px", background: "oklch(0.58 0.22 26 / 0.15)" }}
      />

      {/* Content */}
      <main className="relative z-10 flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Hero */}
        <div className="text-center py-4 fade-in">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: "oklch(0.58 0.22 26 / 0.12)",
              border: "2px solid oklch(0.58 0.22 26 / 0.35)",
            }}
          >
            <Shield
              className="w-8 h-8"
              style={{ color: "oklch(0.65 0.22 26)" }}
            />
          </div>
          <h2
            className="text-2xl font-black tracking-tight mb-2"
            style={{ color: "oklch(0.65 0.22 26)" }}
          >
            À propos
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Un widget de sécurité personnelle pour envoyer votre localisation
            GPS instantanément à un contact d'urgence via WhatsApp.
          </p>
        </div>

        {/* Backend content if available */}
        {showBackendContent && backendAbout && (
          <div
            className="rounded-xl p-4"
            style={{
              background: "oklch(var(--card))",
              border: "1px solid oklch(0.58 0.22 26 / 0.15)",
            }}
          >
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {backendAbout}
            </p>
          </div>
        )}

        {/* How it works */}
        <section>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.65 0.22 26)" }}
          >
            Comment ça fonctionne
          </h3>
          <div className="space-y-3">
            {[
              {
                num: "01",
                title: "Autorisez la géolocalisation",
                desc: "L'accès à votre position GPS est nécessaire pour inclure vos coordonnées dans l'alerte.",
              },
              {
                num: "02",
                title: "Configurez votre contact",
                desc: "Entrez le nom et le numéro WhatsApp de votre contact d'urgence de confiance.",
              },
              {
                num: "03",
                title: "Appuyez en cas d'urgence",
                desc: "Touchez le bouton rouge. WhatsApp s'ouvre avec votre position pré-remplie et prête à envoyer.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="flex gap-4 rounded-xl p-4"
                style={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(0.58 0.22 26 / 0.12)",
                }}
              >
                <span
                  className="font-black text-2xl leading-none flex-shrink-0"
                  style={{
                    color: "oklch(0.58 0.22 26 / 0.35)",
                    fontFamily: '"Courier New", monospace',
                  }}
                >
                  {step.num}
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.65 0.22 26)" }}
          >
            Fonctionnalités
          </h3>
          <div className="space-y-3">
            <FeatureCard
              icon={
                <MapPin
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.22 26)" }}
                />
              }
              title="GPS en temps réel"
              description="Coordonnées précises avec mise à jour continue et lien direct vers Google Maps."
            />
            <FeatureCard
              icon={
                <MessageCircle
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.22 26)" }}
                />
              }
              title="Alerte WhatsApp instantanée"
              description="Message pré-formaté avec horodatage, coordonnées GPS et lien vers la carte, envoyé en un clic."
            />
            <FeatureCard
              icon={
                <Zap
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.22 26)" }}
                />
              }
              title="Widget embeddable"
              description="Intégrable dans n'importe quel site web via iframe. Fonctionne de manière autonome."
            />
            <FeatureCard
              icon={
                <Lock
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.22 26)" }}
                />
              }
              title="Respect de la vie privée"
              description="Aucun tracking permanent. La position n'est accédée que lors de l'envoi d'une alerte."
            />
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
            style={{ color: "oklch(0.65 0.22 26)" }}
          >
            <HelpCircle className="w-4 h-4" />
            Questions fréquentes
          </h3>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        {/* Message format example */}
        <section>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.65 0.22 26)" }}
          >
            Exemple de message d'alerte
          </h3>
          <div
            className="rounded-xl p-4"
            style={{
              background: "oklch(var(--card))",
              border: "1px solid oklch(0.58 0.22 26 / 0.15)",
              fontFamily: '"Courier New", monospace',
              fontSize: "12px",
            }}
          >
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {`🚨 ALERTE - Alertes.App

Heure: 14/03/2026, 15:42
Position GPS:
Lat: 48.856614
Lon: 2.352222
Carte: https://maps.google.com/maps?q=48.856614,2.352222

J'ai besoin d'aide !`}
            </p>
          </div>
        </section>

        {/* Technical info */}
        <section>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.65 0.22 26)" }}
          >
            Informations techniques
          </h3>
          <div
            className="rounded-xl p-4 space-y-2"
            style={{
              background: "oklch(var(--card))",
              border: "1px solid oklch(0.58 0.22 26 / 0.15)",
            }}
          >
            {[
              ["Plateforme", "Internet Computer (ICP)"],
              ["Technologie", "React 19 + TypeScript"],
              ["Géolocalisation", "API Web Geolocation (précision haute)"],
              ["Messagerie", "WhatsApp (lien wa.me)"],
              ["Stockage", "localStorage + backend ICP"],
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{key}</span>
                <span
                  className="text-xs font-medium"
                  style={{
                    color:
                      theme === Theme.dark
                        ? "oklch(0.8 0 0)"
                        : "oklch(0.3 0 0)",
                    fontFamily: '"Courier New", monospace',
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Integration */}
        <section>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.65 0.22 26)" }}
          >
            Intégration widget
          </h3>
          <div
            className="rounded-xl p-4"
            style={{
              background: "oklch(0.07 0 0)",
              border: "1px solid oklch(0.58 0.22 26 / 0.2)",
            }}
          >
            <p className="text-xs text-muted-foreground mb-2">
              Exemple d'intégration iframe :
            </p>
            <code
              className="block text-xs leading-relaxed break-all"
              style={{
                color: "oklch(0.65 0.22 26)",
                fontFamily: '"Courier New", monospace',
              }}
            >
              {`<iframe\n  src="https://alertes-app.caffeine.xyz"\n  width="360"\n  height="640"\n  frameborder="0"\n  allow="geolocation"\n></iframe>`}
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              ⚠️ L'attribut{" "}
              <code className="text-foreground">allow="geolocation"</code> est
              requis pour que la géolocalisation fonctionne dans l'iframe.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 pb-6 pt-2 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Construit avec ❤️ sur{" "}
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
    </div>
  );
}
