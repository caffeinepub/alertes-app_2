import { ChevronRight, Loader2, Phone, Shield, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Theme, UserProfile } from "../backend.d";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface SetupScreenProps {
  theme: Theme;
  onComplete: (config: { contactName: string; whatsapp: string }) => void;
}

export default function SetupScreen({ theme, onComplete }: SetupScreenProps) {
  const [contactName, setContactName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<{
    contactName?: string;
    whatsapp?: string;
  }>({});

  const saveProfile = useSaveCallerUserProfile();

  const validate = () => {
    const newErrors: { contactName?: string; whatsapp?: string } = {};
    if (!contactName.trim()) {
      newErrors.contactName = "Le nom du contact est requis";
    }
    if (!whatsapp.trim()) {
      newErrors.whatsapp = "Le numéro WhatsApp est requis";
    } else {
      const digits = whatsapp.replace(/\D/g, "");
      if (digits.length < 8) {
        newErrors.whatsapp = "Numéro de téléphone invalide (trop court)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const profile: UserProfile = {
      theme,
      contactName: contactName.trim(),
      whatsapp: whatsapp.trim(),
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success("Contact d'urgence configuré !");
      onComplete({
        contactName: contactName.trim(),
        whatsapp: whatsapp.trim(),
      });
    } catch {
      toast.error("Erreur lors de la sauvegarde. Réessayez.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, oklch(0.58 0.22 26 / 0.06) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-8"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.58 0.22 26) 1px, transparent 1px), linear-gradient(90deg, oklch(0.58 0.22 26) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{
              background: "oklch(0.58 0.22 26 / 0.12)",
              border: "2px solid oklch(0.58 0.22 26 / 0.35)",
            }}
          >
            <Shield
              className="w-7 h-7"
              style={{ color: "oklch(0.65 0.22 26)" }}
            />
          </div>
          <h1
            className="text-3xl font-black tracking-tight mb-1"
            style={{ color: "oklch(0.65 0.22 26)" }}
          >
            Alertes.App
          </h1>
          <p className="text-sm text-muted-foreground">
            Configuration du contact d'urgence
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(0.58 0.22 26 / 0.2)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
          }}
        >
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Configurez le contact qui recevra vos alertes d'urgence via
            WhatsApp. Vous pourrez modifier ces informations à tout moment.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Contact name */}
            <div>
              <label
                htmlFor="setup-contact-name"
                className="block text-sm font-semibold mb-2 text-foreground"
              >
                <span className="flex items-center gap-2">
                  <User
                    className="w-4 h-4"
                    style={{ color: "oklch(0.65 0.22 26)" }}
                  />
                  Nom du contact
                </span>
              </label>
              <input
                id="setup-contact-name"
                data-ocid="setup.contact_name_input"
                type="text"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  if (errors.contactName)
                    setErrors((p) => ({ ...p, contactName: undefined }));
                }}
                placeholder="Ex: Marie, Papa, Agent Dupont..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "oklch(var(--input))",
                  border: errors.contactName
                    ? "1px solid oklch(0.65 0.22 26)"
                    : "1px solid oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
                autoComplete="off"
              />
              {errors.contactName && (
                <p
                  className="mt-1.5 text-xs"
                  style={{ color: "oklch(0.65 0.22 26)" }}
                >
                  {errors.contactName}
                </p>
              )}
            </div>

            {/* WhatsApp number */}
            <div>
              <label
                htmlFor="setup-whatsapp"
                className="block text-sm font-semibold mb-2 text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Phone
                    className="w-4 h-4"
                    style={{ color: "oklch(0.65 0.22 26)" }}
                  />
                  Numéro WhatsApp
                </span>
              </label>
              <input
                id="setup-whatsapp"
                data-ocid="setup.whatsapp_input"
                type="tel"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  if (errors.whatsapp)
                    setErrors((p) => ({ ...p, whatsapp: undefined }));
                }}
                placeholder="Ex: +33 6 12 34 56 78"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "oklch(var(--input))",
                  border: errors.whatsapp
                    ? "1px solid oklch(0.65 0.22 26)"
                    : "1px solid oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
                autoComplete="tel"
              />
              {errors.whatsapp && (
                <p
                  className="mt-1.5 text-xs"
                  style={{ color: "oklch(0.65 0.22 26)" }}
                >
                  {errors.whatsapp}
                </p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
                Format international recommandé (ex: +33612345678)
              </p>
            </div>

            <button
              data-ocid="setup.submit_button"
              type="submit"
              disabled={saveProfile.isPending}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "oklch(0.58 0.22 26)",
                color: "white",
                boxShadow: "0 4px 20px oklch(0.58 0.22 26 / 0.35)",
              }}
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  Continuer
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

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
