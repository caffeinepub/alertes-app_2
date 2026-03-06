import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Theme = {
    #dark;
    #light;
  };

  public type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  public type UserProfile = {
    contactName : Text;
    whatsapp : Text;
    theme : Theme;
  };

  public type UserConfig = {
    contactName : Text;
    whatsapp : Text;
    theme : Theme;
  };

  module Theme {
    public func compare(theme1 : Theme, theme2 : Theme) : Order.Order {
      switch (theme1, theme2) {
        case (#dark, #light) { #less };
        case (#light, #dark) { #greater };
        case (_) { #equal };
      };
    };
  };

  module UserConfig {
    public func compare(config1 : UserConfig, config2 : UserConfig) : Order.Order {
      switch (Text.compare(config1.contactName, config2.contactName)) {
        case (#equal) { Text.compare(config1.whatsapp, config2.whatsapp) };
        case (order) { order };
      };
    };

    public func compareByTheme(config1 : UserConfig, config2 : UserConfig) : Order.Order {
      Theme.compare(config1.theme, config2.theme);
    };
  };

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userConfigs = Map.empty<Principal, UserConfig>();

  // Required by frontend: get caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    switch (userConfigs.get(caller)) {
      case (null) { null };
      case (?config) {
        ?{
          contactName = config.contactName;
          whatsapp = config.whatsapp;
          theme = config.theme;
        };
      };
    };
  };

  // Required by frontend: save caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let config : UserConfig = {
      contactName = profile.contactName;
      whatsapp = profile.whatsapp;
      theme = profile.theme;
    };
    userConfigs.add(caller, config);
  };

  // Required by frontend: get another user's profile (admin only or own profile)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userConfigs.get(user)) {
      case (null) { null };
      case (?config) {
        ?{
          contactName = config.contactName;
          whatsapp = config.whatsapp;
          theme = config.theme;
        };
      };
    };
  };

  // Application-specific: save user configuration (authenticated users only)
  public shared ({ caller }) func saveUserConfig(data : UserConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save configuration");
    };
    userConfigs.add(caller, data);
  };

  // Application-specific: get user's own configuration (authenticated users only)
  public query ({ caller }) func getUserConfig() : async UserConfig {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access configuration");
    };
    if (not userConfigs.containsKey(caller)) {
      Runtime.trap("Ce profil utilisateur n'existe pas");
    };
    switch (userConfigs.get(caller)) {
      case (null) { Runtime.trap("Ce profil utilisateur n'existe pas") };
      case (?config) { config };
    };
  };

  // Admin-only: get all user configurations
  public query ({ caller }) func getAllUserConfigs() : async [UserConfig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all configurations");
    };
    userConfigs.values().toArray().sort();
  };

  // Admin-only: get all user configurations sorted by theme
  public query ({ caller }) func getAllUserConfigsByTheme() : async [UserConfig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all configurations");
    };
    userConfigs.values().toArray().sort(UserConfig.compareByTheme);
  };

  // Authenticated users only: generate alert message with GPS coordinates
  public query ({ caller }) func generateAlertMessage(coords : Coordinates) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate alert messages");
    };
    let timestamp = Time.now().toText();
    let mapsLink = "https://maps.google.com/?q=" # coords.latitude.toText() # "," # coords.longitude.toText();
    "Alerte via Alertes.App!\n\n" #
    "Date et heure : " # timestamp # "\n" #
    "Coordonnees GPS: " # coords.latitude.toText() # ", " # coords.longitude.toText() # "\n" #
    "Lien Google Maps : " # mapsLink # "\n";
  };

  // Public: get about page content (no authorization needed)
  public query ({ caller }) func getAboutPage() : async Text {
    "Bienvenue sur Alertes.App!\n\n" #
    "Cette application est conçue pour améliorer votre sécurité personnelle en vous permettant d'envoyer rapidement des alertes à vos contacts en cas d'urgence. Personnalisez vos préférences et restes en sécurité!\n";
  };
};
