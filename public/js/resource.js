/**
 * Created by ich on 13/11/2014.
 */


function resource() {

  var EN = {
    LOGIN: {
      LOGIN_TO: "Login to: S H R E D D I T ³",
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
    REGISTER: {
      REGISTER: "Register",
      FOR: "Register for",
      USERNAME: "Username",
      USERNAME_USED: "The chosen username is already taken!",
      USERNAME_INVALID: "The username must be at least three characters long!",
      PASSWORD: "Password",
      PASSWORD_RETYPE: "Retype password",
      PASSWORD_PLACEHOLDER: "Select a password",
      PASSWORD_PLACEHOLDER_RETYPE: "Retype the selected password",
      PASSWORD_MISMATCH: "The two password are not equal!",
      PASSWORD_INVALID: "The password must be at least six characters long!",
      EMAIL: "E-Mail",
      EMAIL_INVALID: "The e-mail address is invalid!"
    },
    POSTING: {
      POSTING: "Posting",
      ADDED_BY: "Posting added by user",
      AVG: "stars average by",
      AVG2: "users",
      ADDED_ON: "Posting added on",
      CONTENT: "Content on",
      SHOW_COMMENT_0: "Add first comment",
      SHOW_COMMENT_1: "Show comment",
      SHOW_COMMENT_2: "Show comments",
      RATE: "Rate the posting",
      NO_POSTINGS_TITLE: "No postings found ...!",
      NO_POSTINGS: "There are no postings visible! Either none were found matching the search expression or no posting meet the current view configuration.",
      NEW_POSTING: "But feel free to create a new posting yourself.",
      DATE_FORMAT: "MM/dd/yyyy HH:mm"
    },
    NEW: {
      TITLE: "Create a new posting",
      TITLE_LABEL: "Title",
      TITLE_PLACEHOLDER: "Required: Title of the posting",
      TITLE_INVALID: "A title is required!",
      CONTENT_LABEL: "Posting content",
      CONTENT_PLACEHOLDER: "Required: Content of the posting",
      CONTENT_INVALID: "Content is, of course, required too!",
      LINK_LABEL: "Link-Name",
      LINK_PLACEHOLDER: "Optional: Name of the external link (e.g. BBC)",
      URL_LABEL: "Link-URL",
      URL_PLACEHOLDER: "Optional: External link (e.g. http://www.bbc.co.uk)",
      TAGS_LABEL: "Tag(s)",
      TAGS_PLACEHOLDER: "Optional: (Comma separated) Tags (e.g. Sport, Fun)"
    },
    NEW_COMMENT: {
      TITLE: "New comment for posting",
      RESPONSE_LABEL: "As a response",
      RESPONSE_PLACEHOLDER: "E.g. a username",
      COMMENT_LABEL: "Comment",
      COMMENT_INVALID: "A comment is required!"
    },
    COMMENT: {
      TITLE: "Comments for",
      ADD: "Add comment",
      NONE: "No comments (yet)!"
    },
    GENERAL: {
      SAVE: "Save",
      DELETE: "Delete",
      CLOSE: "Close",
      CLEAR: "Clear",
      BY: "by",
      CANCEL: "Cancel"
    },
    ERROR: {
      TITLE: "ERROR",
      LABEL: "An error occurred",
      GOTO: "Goto Login"
    },
    MESSAGE: {
      UNSAVED_DATA: "Unsaved data!\nAre you sure you want to leave this page?",
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
    REGISTER: {
      REGISTER: "Registrieren",
      FOR: "Registrieren für",
      USERNAME: "Benutzername",
      USERNAME_USED: "Der gewählte Benutzername ist vergeben!",
      USERNAME_INVALID: "Der Benutzername muss mindestens drei Zeichen enthalten!",
      PASSWORD: "Passwort",
      PASSWORD_RETYPE: "Passwort erneut eingeben",
      PASSWORD_PLACEHOLDER: "Ein Passwort Wählen",
      PASSWORD_PLACEHOLDER_RETYPE: "Gewähltes Passwort erneut eingeben",
      PASSWORD_MISMATCH: "Die beiden Passwörter sind nicht gleich!",
      PASSWORD_INVALID: "Das Passwort muss mindestens sechs Zeichen enthalten!",
      EMAIL: "E-Mail",
      EMAIL_INVALID: "Die E-Mail Adresse ist ungültig!"
    },
    POSTING: {
      POSTING: "Posting",
      ADDED_BY: "Posting hinzugefügt von",
      AVG: "Sternedurchschnitt von",
      AVG2: "Benutzern",
      ADDED_ON: "Posting hinzugefügt am",
      CONTENT: "Inhalt von",
      SHOW_COMMENT_0: "Erster Kommentar",
      SHOW_COMMENT_1: "Zeige Kommentar",
      SHOW_COMMENT_2: "Zeige Kommentare",
      RATE: "Bewerte das Posting",
      NO_POSTINGS_TITLE: "Keine Postings gefunden ...!",
      NO_POSTINGS: "Es können keine Postings angezeigt werden! Entweder passen keine Postings zum Suchtext oder in der aktuellen Ansicht sind keine Postings sichtbar.",
      NEW_POSTING: "Natürlich kann ein neues Posting erfasst werden.",
      DATE_FORMAT: "dd.MM.yyyy HH:mm"
    },
    NEW: {
      TITLE: "Erstelle ein neues Posting",
      TITLE_LABEL: "Titel",
      TITLE_PLACEHOLDER: "Mussfeld: Titel des Posting",
      TITLE_INVALID: "Ein Titel ist unbedingt nötig!",
      CONTENT_INVALID: "Inhalt braucht es natürlich auch!",
      CONTENT_LABEL: "Posting Inhalt",
      CONTENT_PLACEHOLDER: "Mussfeld: Inhalt des Posting",
      LINK_LABEL: "Link-Name",
      LINK_PLACEHOLDER: "Optional: Name des externen Links (e.g. BBC)",
      URL_LABEL: "Link-URL",
      URL_PLACEHOLDER: "Optional: Externer Link (e.g. http://www.bbc.co.uk)",
      TAGS_LABEL: "Tag(s)",
      TAGS_PLACEHOLDER: "Optional: (Komma getrennte) Tags (e.g. Sport, Fun)"
    },
    NEW_COMMENT: {
      TITLE: "Neuer Kommentar zu Posting",
      RESPONSE_LABEL: "Als Antwort",
      RESPONSE_PLACEHOLDER: "E.g. ein Benutzername",
      COMMENT_LABEL: "Kommentar",
      COMMENT_INVALID: "Ein Kommentar ist nötig!"
    },
    COMMENT: {
      TITLE: "Kommentare zu",
      ADD: "Neuer Kommentar",
      NONE: "(Noch) Keine Kommentare!"
    },
    GENERAL: {
      SAVE: "Speichern",
      DELETE: "Löschen",
      CLOSE: "Schliessen",
      CLEAR: "Zurücksetzen",
      BY: "von",
      CANCEL: "Abbrechen"
    },
    ERROR: {
      TITLE: "FEHLER",
      LABEL: "Es ist ein Fehler aufgetreten",
      GOTO: "Zum Einloggen"
    },
    MESSAGE: {
      UNSAVED_DATA: "Nicht gespeicherte Daten!\nSind Sie sicher diese Seite verlassen zu wollen?",
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
