# Alertes.App

## Current State
Nouveau projet, aucun code existant.

## Requested Changes (Diff)

### Add
- Widget de sécurité personnelle embeddable avec géolocalisation en temps réel
- Flux d'autorisation de géolocalisation obligatoire (blocage si refus)
- Écran de configuration du contact d'urgence (nom + numéro WhatsApp)
- Page d'accueil avec bouton d'alerte circulaire rouge pulsant
- En-tête avec boutons : À propos, Paramètres (⚙️), basculement jour/nuit
- Modal de paramètres pour modifier le contact d'urgence
- Système d'alerte WhatsApp : ouverture avec message pré-rempli (timestamp, coordonnées GPS, lien carte)
- Page À propos (fonctionnement, guide, infos techniques)
- Thème futuriste noir/rouge avec mode jour/nuit
- Interface responsive optimisée pour widget iframe/script
- Backend : stockage config contacts, thème, messages prédéfinis, contenu À propos, config intégration

### Modify
- (rien à modifier, nouveau projet)

### Remove
- (rien à supprimer, nouveau projet)

## Implementation Plan

### Backend (Motoko)
1. Type `UserConfig` : contactName, contactWhatsapp, theme (dark/light)
2. Stable map `userConfigs` : principal -> UserConfig
3. `getConfig()` : récupère la config de l'utilisateur connecté
4. `saveConfig(name, whatsapp, theme)` : sauvegarde la config
5. `getAboutContent()` : retourne le contenu statique de la page À propos
6. `getAlertMessage(lat, lng)` : retourne le message WhatsApp pré-formaté avec timestamp et coordonnées

### Frontend (React + TypeScript)
1. Écran de permission géolocalisation (bloquant)
2. Écran de configuration initiale du contact d'urgence
3. Page d'accueil principale :
   - En-tête avec boutons (À propos, Paramètres, toggle thème)
   - Affichage coordonnées GPS en temps réel
   - Bouton d'alerte circulaire rouge pulsant centré
4. Modal paramètres (modification nom et numéro WhatsApp)
5. Page À propos
6. Gestion du thème jour/nuit (CSS variables)
7. Logique d'alerte WhatsApp (construction URL `wa.me`)
8. Persistance localStorage + synchronisation backend
9. Marqueurs `data-ocid` sur tous les éléments interactifs
