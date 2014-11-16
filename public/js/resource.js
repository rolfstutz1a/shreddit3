/**
 * Created by ich on 13/11/2014.
 */


function resource() {

  var EN = {
    LOGIN: {
      PASSWORD: "Password",
      PASSWORD_VALID: "At least six characters!",
      REGISTER: "Register",
      SIGN_IN: "Login",
      TITLE: "S H R E D D I T ³ - absolutely useless postings",
      USERNAME: "Username",
      USERNAME_VALID: "At least three characters!"
    },
    MENU: {
      LOGIN_TO: "Login to: S H R E D D I T ³",
      NEW_POSTING_TITLE: "Create a new posting",
      NEW_POSTING_LABEL: "New Posting",
      POSTINGS_TITLE: "Show the postings",
      POSTINGS_LABEL: "Postings",
      SETTINGS_TITLE: "Show my account settings",
      SETTINGS_LABEL: "Settings",
      ABOUT_TITLE: "Show the about page",
      ABOUT_LABEL: "About",
      LOGOUT_TITLE: "Logout from Shreddit",
      LOGOUT_LABEL: "Logout",
      SORT_LATEST_TITLE: "Sort the posting list. Beginning with the latest.",
      SORT_LATEST_LABEL: "Latest Postings",
      SORT_LATEST_SHORT_LABEL: "Latest",
      SORT_TOP_TITLE: "Sort the posting list. Beginning with the top rated.",
      SORT_TOP_LABEL: "Top Rated Postings",
      SORT_TOP_SHORT_LABEL: "Top Rated",
      SORT_MY_TITLE: "Show only my postings",
      SORT_MY_LABEL: "My Postings",
      SORT_MY_SHORT_LABEL: "My Postings",
      SEARCH_TITLE: "Enter a search text. Start the search by pressing enter or clicking the search button on the right.",
      SEARCH_LABEL: "Search",
      SEARCH_START_TITLE: "Start searching.",
      SEARCH_CLEAR_TITLE: "Clear the search field."
    },
    SETTINGS: {
      FOR: "Settings for",
      EMAIL: "E-Mail",
      EMAIL_INVALID: "The e-mail address is invalid!",
      LANGUAGE: "Language",
      NOTIFY: "Notify me when a comment on one of my postings has been added"
    },
    GENERAL: {
      SAVE: "Save",
      CANCEL: "Cancel"
    },
    ERROR: {
      TITLE: "ERROR",
      LABEL: "An error occurred",
      GOTO: "Goto Login"
    },
    MESSAGE: {
      WRONG_USR_PWD: "Wrong username or password!",
      BAD_REQUEST: "Bad Request!"
    },
    ZZZ: "Zzzzz"
  };

  var DE = {
    LOGIN: {
      LOGIN_TO: "Einloggen zu: S H R E D D I T ³",
      PASSWORD: "Passwort",
      PASSWORD_VALID: "Mindestens sechs Zeichen!",
      REGISTER: "Registrieren",
      SIGN_IN: "Einloggen",
      USERNAME: "Benutzername",
      USERNAME_VALID: "Mindestens drei Zeichen!"
    },
    MENU: {
      TITLE: "S H R E D D I T ³ - absolut sinnlose Postings",
      NEW_POSTING_TITLE: "Schreibe ein neues Posting",
      NEW_POSTING_LABEL: "Neues Posting",
      POSTINGS_TITLE: "Zeige die Postings",
      POSTINGS_LABEL: "Postings",
      SETTINGS_TITLE: "Zeige meine Kontoeinstellungen",
      SETTINGS_LABEL: "Einstellungen",
      ABOUT_TITLE: "Zeige die Seite mit den Informationen zu Shreddit.",
      ABOUT_LABEL: "Über",
      LOGOUT_TITLE: "Ausloggen von Shreddit",
      LOGOUT_LABEL: "Ausloggen",
      SORT_LATEST_TITLE: "Sortiere die Postingliste. Das aktuellste zuerst.",
      SORT_LATEST_LABEL: "Aktuelle Postings",
      SORT_LATEST_SHORT_LABEL: "Aktuell",
      SORT_TOP_TITLE: "Sortiere die Postingsliste. Das beliebteste zuerst.",
      SORT_TOP_LABEL: "Top Rated Postings",
      SORT_TOP_SHORT_LABEL: "Top Rated",
      SORT_MY_TITLE: "Zeige nur meine Postings",
      SORT_MY_LABEL: "Meine Postings",
      SORT_MY_SHORT_LABEL: "Meine Postings",
      SEARCH_TITLE: "Gib einen Suchtext eine. Starte die Suche durch drücken der Entertaste oder duch klicken auf den Suchbutton.",
      SEARCH_LABEL: "Suche",
      SEARCH_START_TITLE: "Starte Suche.",
      SEARCH_CLEAR_TITLE: "Lösche das Suchfeld."
    },
    SETTINGS: {
      FOR: "Einstellungen für",
      EMAIL: "E-Mail",
      EMAIL_INVALID: "Die E-Mail Adresse ist ungültig!",
      LANGUAGE: "Sprache",
      NOTIFY: "Benachrichtige mich, wenn ein Kommentar zu einem meiner Postings erfasst wurde"
    },
    GENERAL: {
      SAVE: "Speichern",
      CANCEL: "Abbrechen"
    },
    ERROR: {
      TITLE: "FEHLER",
      LABEL: "Es ist ein Fehler aufgetreten",
      GOTO: "Zum Einloggen"
    },
    MESSAGE: {
      WRONG_USR_PWD: "Falscher Benutzername oder falsches Passwort!",
      BAD_REQUEST: "Ungültige Anfrage!"
    },
    ZZZ: "Zzzzz"
  };

  return {
    getEN: function() {
      return EN;
    },
    getDE: function() {
      return DE;
    }
  };
}
