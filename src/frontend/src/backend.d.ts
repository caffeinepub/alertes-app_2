import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface UserProfile {
    theme: Theme;
    contactName: string;
    whatsapp: string;
}
export interface UserConfig {
    theme: Theme;
    contactName: string;
    whatsapp: string;
}
export enum Theme {
    dark = "dark",
    light = "light"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generateAlertMessage(coords: Coordinates): Promise<string>;
    getAboutPage(): Promise<string>;
    getAllUserConfigs(): Promise<Array<UserConfig>>;
    getAllUserConfigsByTheme(): Promise<Array<UserConfig>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserConfig(): Promise<UserConfig>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveUserConfig(data: UserConfig): Promise<void>;
}
