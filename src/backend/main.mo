import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Char "mo:core/Char";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User profile type for frontend requirements
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions required by frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Data = {
    name : Text;
    mobileNumber : Text;
    dateOfBirth : Text;
    education : ?Text;
    height : ?Int;
    weight : ?Int;
    hobby : ?Text;
    city : ?Text;
    image : ?Storage.ExternalBlob;
  };

  // SEPARATE STORAGE BOUNDARIES:
  // 1. Admin Panel storage - only accessible by admins
  var persons = Map.empty<Text, Data>();

  // 2. Personal Records storage - users manage their own records
  var personalRecords = Map.empty<Principal, Data>();

  module Data {
    public func compare(d1 : Data, d2 : Data) : Order.Order {
      Text.compare(d1.name, d2.name);
    };
  };

  func validateNumeric<T>(input : Text, parser : Text -> ?T, fieldName : Text) : T {
    switch (parser(input)) {
      case (null) {
        Runtime.trap("Field " # fieldName # " expects a number, but got: " # input);
      };
      case (?parsed) { parsed };
    };
  };

  func validateMobileNumber(mobile : Text) : Text {
    if (mobile.size() < 8 or mobile.size() > 15) {
      Runtime.trap("Mobile number must be between 8 and 15 digits");
    };
    let chars = mobile.toArray();
    for (char in chars.values()) {
      if (char < '0' or char > '9') {
        Runtime.trap("Mobile number must only contain numeric characters");
      };
    };
    mobile;
  };

  func validateBirthDate(dateText : Text) : Text {
    if (not dateText.contains(#char '-')) {
      Runtime.trap(
        "Field 3 (date of birth) must be a valid date."
      );
    };
    dateText;
  };

  func validateTextField(payload : Text, minSize : Int, maxSize : Int, fieldName : Text) : Text {
    if (payload.size() > 0 and (payload.size() < minSize or payload.size() > maxSize)) {
      Runtime.trap(
        "Field " # fieldName # " must be between " # minSize.toText() # " and " # maxSize.toText() # " characters"
      );
    };
    payload;
  };

  func validateData(payload : Data, existingHeight : ?Int, existingWeight : ?Int) : Data {
    {
      name = validateTextField(payload.name.trim(#char ' '), 3, 100, "1 (name)");
      mobileNumber = validateMobileNumber(payload.mobileNumber.trim(#char ' '));
      height = switch (payload.height) {
        case (null) { existingHeight };
        case (?height) {
          if (height > 250 or height < 80) {
            Runtime.trap("Field 5 (height) expects a number between 80 and 250. Got: " # height.toText());
          };
          ?height;
        };
      };
      weight = switch (payload.weight) {
        case (null) { existingWeight };
        case (?weight) {
          if (weight > 400 or weight < 40) {
            Runtime.trap("Field 6 (weight) expects a number between 40 and 400. Got: " # weight.toText());
          };
          ?weight;
        };
      };
      dateOfBirth = validateBirthDate(payload.dateOfBirth.trim(#char ' '));
      city = payload.city;
      hobby = payload.hobby;
      education = payload.education;
      image = payload.image;
    };
  };

  func validateUpdate(personId : Text, payload : Data) : Data {
    switch (persons.get(personId)) {
      case (null) { Runtime.trap("Person with id '" # personId # "' does not exist") };
      case (?existing) {
        validateData(payload, existing.height, existing.weight);
      };
    };
  };

  // ============================================
  // ADMIN PANEL FUNCTIONS (Admin-only access)
  // ============================================

  public shared ({ caller }) func create(personId : Text, payload : Data) : async Data {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create person records.");
    };
    if (persons.containsKey(personId)) {
      Runtime.trap("Person with id '" # personId # "' already exists");
    };
    let validated = validateData(payload, null, null);
    persons.add(personId, validated);
    validated;
  };

  public shared ({ caller }) func update(personId : Text, payload : Data) : async Data {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update person records.");
    };
    let validated = validateUpdate(personId, payload);
    persons.add(personId, validated);
    validated;
  };

  public shared ({ caller }) func delete(personId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete person records.");
    };
    if (not persons.containsKey(personId)) {
      Runtime.trap("Person with id '" # personId # "' does not exist");
    };
    persons.remove(personId);
  };

  public query ({ caller }) func listAllAdmin() : async [Data] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all records.");
    };
    persons.values().toArray().sort();
  };

  public query ({ caller }) func readAdmin(personId : Text) : async Data {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view person records.");
    };

    switch (persons.get(personId)) {
      case (null) { Runtime.trap("Person with id '" # personId # "' does not exist") };
      case (?person) { person };
    };
  };

  // ============================================
  // PERSONAL RECORDS FUNCTIONS (User access to own records)
  // ============================================

  public shared ({ caller }) func createPersonalRecord(payload : Data) : async Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create personal records");
    };
    if (personalRecords.containsKey(caller)) {
      Runtime.trap("Personal record already exists. Use updatePersonalRecord instead.");
    };
    let validated = validateData(payload, null, null);
    personalRecords.add(caller, validated);
    validated;
  };

  public shared ({ caller }) func updatePersonalRecord(payload : Data) : async Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update personal records");
    };
    switch (personalRecords.get(caller)) {
      case (null) {
        Runtime.trap("Personal record does not exist. Use createPersonalRecord first.");
      };
      case (?existing) {
        let validated = validateData(payload, existing.height, existing.weight);
        personalRecords.add(caller, validated);
        validated;
      };
    };
  };

  public shared ({ caller }) func deletePersonalRecord() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete personal records");
    };
    if (not personalRecords.containsKey(caller)) {
      Runtime.trap("Personal record does not exist");
    };
    personalRecords.remove(caller);
  };

  public query ({ caller }) func readPersonalRecord() : async ?Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can read personal records");
    };
    personalRecords.get(caller);
  };

  public query ({ caller }) func getPersonalRecordByUser(user : Principal) : async ?Data {
    // Users can only view their own record, admins can view any
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own personal record");
    };
    personalRecords.get(user);
  };
};
