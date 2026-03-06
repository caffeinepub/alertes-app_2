import { Loader2, Phone, Save, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Theme, UserProfile } from "../backend.d";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  initialContactName: string;
  initialWhatsapp: string;
  onSaved: (config: { contactName: string; whatsapp: string }) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  initialContactName,
  initialWhatsapp,
  onSaved,
}: SettingsModalProps) {
  const [contactName, setContactName] = useState(initialContactName);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [errors, setErrors] = useState<{
    contactName?: string;
    whatsapp?: string;
  }>({});

  const saveProfile = useSaveCallerUserProfile();

  useEffect(() => {
    if (isOpen) {
      setContactName(initialContactName);
      setWhatsapp(initialWhatsapp);
      setErrors({});
    }
  }, [isOpen, initialContactName, initialWhatsapp]);

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
        newErrors.whatsapp = "Numéro invalide (trop court)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const profile: UserProfile = {
      theme,
      contactName: contactName.trim(),
      whatsapp: whatsapp.trim(),
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success("Paramètres sauvegardés !");
      onSaved({ contactName: contactName.trim(), whatsapp: whatsapp.trim() });
      onClose();
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-ocid="settings.modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      role="presentation"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 relative fade-in"
        style={{
          background: "oklch(var(--card))",
          border: "1px solid oklch(0.58 0.22 26 / 0.3)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px oklch(0.58 0.22 26 / 0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-foreground">Paramètres</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Contact d'urgence
            </p>
          </div>
          <button
            type="button"
            data-ocid="settings.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-muted"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Divider */}
        <div
          className="mb-5"
          style={{
            height: "1px",
            background: "oklch(0.58 0.22 26 / 0.15)",
          }}
        />

        <form onSubmit={handleSave} className="space-y-4">
          {/* Contact name */}
          <div>
            <label
              htmlFor="settings-contact-name"
              className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider"
            >
              <span className="flex items-center gap-1.5">
                <User
                  className="w-3.5 h-3.5"
                  style={{ color: "oklch(0.65 0.22 26)" }}
                />
                Nom du contact
              </span>
            </label>
            <input
              id="settings-contact-name"
              data-ocid="settings.contact_name_input"
              type="text"
              value={contactName}
              onChange={(e) => {
                setContactName(e.target.value);
                if (errors.contactName)
                  setErrors((p) => ({ ...p, contactName: undefined }));
              }}
              placeholder="Nom du contact d'urgence"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "oklch(var(--input))",
                border: errors.contactName
                  ? "1px solid oklch(0.65 0.22 26)"
                  : "1px solid oklch(var(--border))",
                color: "oklch(var(--foreground))",
              }}
            />
            {errors.contactName && (
              <p
                className="mt-1 text-xs"
                style={{ color: "oklch(0.65 0.22 26)" }}
              >
                {errors.contactName}
              </p>
            )}
          </div>

          {/* WhatsApp number */}
          <div>
            <label
              htmlFor="settings-whatsapp"
              className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider"
            >
              <span className="flex items-center gap-1.5">
                <Phone
                  className="w-3.5 h-3.5"
                  style={{ color: "oklch(0.65 0.22 26)" }}
                />
                Numéro WhatsApp
              </span>
            </label>
            <input
              id="settings-whatsapp"
              data-ocid="settings.whatsapp_input"
              type="tel"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value);
                if (errors.whatsapp)
                  setErrors((p) => ({ ...p, whatsapp: undefined }));
              }}
              placeholder="+33 6 12 34 56 78"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "oklch(var(--input))",
                border: errors.whatsapp
                  ? "1px solid oklch(0.65 0.22 26)"
                  : "1px solid oklch(var(--border))",
                color: "oklch(var(--foreground))",
              }}
            />
            {errors.whatsapp && (
              <p
                className="mt-1 text-xs"
                style={{ color: "oklch(0.65 0.22 26)" }}
              >
                {errors.whatsapp}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              data-ocid="settings.cancel_button"
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "oklch(var(--muted))",
                color: "oklch(var(--muted-foreground))",
                border: "1px solid oklch(var(--border))",
              }}
            >
              Annuler
            </button>
            <button
              data-ocid="settings.save_button"
              type="submit"
              disabled={saveProfile.isPending}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "oklch(0.58 0.22 26)",
                color: "white",
              }}
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
