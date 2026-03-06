import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Coordinates,
  Theme,
  type UserConfig,
  type UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useUserConfig() {
  const { actor, isFetching } = useActor();
  return useQuery<UserConfig>({
    queryKey: ["userConfig"],
    queryFn: async () => {
      if (!actor) {
        return {
          theme: Theme.dark,
          contactName: localStorage.getItem("alertes_contact_name") || "",
          whatsapp: localStorage.getItem("alertes_whatsapp") || "",
        };
      }
      return actor.getUserConfig();
    },
    enabled: !isFetching,
  });
}

export function useSaveUserConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserConfig) => {
      localStorage.setItem("alertes_theme", data.theme);
      localStorage.setItem("alertes_contact_name", data.contactName);
      localStorage.setItem("alertes_whatsapp", data.whatsapp);
      if (actor) {
        await actor.saveUserConfig(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userConfig"] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      localStorage.setItem("alertes_theme", profile.theme);
      localStorage.setItem("alertes_contact_name", profile.contactName);
      localStorage.setItem("alertes_whatsapp", profile.whatsapp);
      if (actor) {
        await actor.saveCallerUserProfile(profile);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userConfig"] });
    },
  });
}

export function useGenerateAlertMessage(coords: Coordinates | null) {
  const { actor } = useActor();
  return useQuery<string>({
    queryKey: ["alertMessage", coords],
    queryFn: async () => {
      if (!actor || !coords) return "";
      return actor.generateAlertMessage(coords);
    },
    enabled: false, // manual trigger only
  });
}

export function useAboutPage() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["aboutPage"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getAboutPage();
    },
    enabled: !!actor && !isFetching,
  });
}
