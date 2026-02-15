import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Char "mo:core/Char";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";

actor {
  include MixinStorage();

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

  let persons = Map.empty<Text, Data>();

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

  func validateUpdate(personId : Text, payload : Data) : Data {
    switch (persons.get(personId)) {
      case (null) {
        Runtime.trap("Person with id '" # personId # "' does not exist");
      };
      case (?existing) {
        let validated = {
          name = validateTextField(payload.name.trim(#char ' '), 3, 100, "1 (name)");
          mobileNumber = validateMobileNumber(payload.mobileNumber.trim(#char ' '));
          height = switch (payload.height) {
            case (null) { existing.height };
            case (?height) {
              if (height > 98 or height < 24) {
                Runtime.trap("Field 5 (height) expects a number between 24 and 98 (inches). Got: " # height.toText());
              };
              ?height;
            };
          };
          weight = switch (payload.weight) {
            case (null) { existing.weight };
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
        persons.add(personId, validated);
        validated;
      };
    };
  };

  public shared ({ caller }) func create(personId : Text, payload : Data) : async Data {
    if (persons.containsKey(personId)) {
      Runtime.trap("Person with id '" # personId # "' already exists");
    };
    let validated = {
      name = validateTextField(payload.name.trim(#char ' '), 3, 100, "1 (name)");
      mobileNumber = validateMobileNumber(payload.mobileNumber.trim(#char ' '));
      height = switch (payload.height) {
        case (null) { null };
        case (?height) {
          if (height > 98 or height < 24) {
            Runtime.trap("Field 5 (height) expects a number between 24 and 98 (inches). Got: " # height.toText());
          };
          ?height;
        };
      };
      weight = switch (payload.weight) {
        case (null) { null };
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
    persons.add(personId, validated);
    validated;
  };

  public shared ({ caller }) func update(personId : Text, payload : Data) : async Data {
    validateUpdate(personId, payload);
  };

  public shared ({ caller }) func delete(personId : Text) : async () {
    if (not persons.containsKey(personId)) {
      Runtime.trap("Person with id '" # personId # "' does not exist");
    };
    persons.remove(personId);
  };

  public query ({ caller }) func read(personId : Text) : async Data {
    switch (persons.get(personId)) {
      case (null) {
        Runtime.trap("Person with id '" # personId # "' does not exist");
      };
      case (?person) { person };
    };
  };

  public query ({ caller }) func listAll() : async [Data] {
    persons.values().toArray().sort();
  };
};
