import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// If you prefer to load from public/locales via HTTP, you could wire i18next-http-backend.
// For now, we embed minimal resources to work out of the box and also support public/locales.

const resources = {
  de: {
    common: {
      language: {
        label: 'Sprache',
        en: 'English',
        de: 'Deutsch',
      },
      loading: 'Lädt...'
    },
    navigation: {
      quick_menu_heading: 'Seiten',
      dashboard: 'Dashboard',
      contact: 'Kontakte',
      customer: 'Kontaktliste',
      'customer-contact': 'Personen',
      admin: 'Administration',
      users: 'Benutzer',
      roles: 'Rollen',
      permissions: 'Berechtigungen',
      'show-room': 'Showroom',
      profile: 'Profil',
      tasks: 'Aufgaben'
    },
    data_table: {
      open_menu: 'Menü öffnen',
      edit_action: 'Bearbeiten',
      copy_action: 'Kopieren',
      add_action: 'Hinzufügen',
      delete_action: 'Löschen',
      delete_action_dialog_title: 'Sind Sie ganz sicher?',
      delete_action_dialog_description: 'Diese Aktion kann nicht mehr rückgängig gemacht werden.',
      delete_action_success: 'Eintrag erfolgreich gelöscht.',
      page_info: 'Seite {{page}} von {{pages}}',
      rows_per_page: 'Zeilen pro Seite',
      go_to_first_page: 'Gehe zur ersten Seite',
      go_to_previous_page: 'Gehe zur vorherigen Seite',
      go_to_next_page: 'Gehe zur nächster Seite',
      go_to_last_page: 'Gehe zur letzten Seite',
      view_options: 'Ansicht',
      toggle_columns: 'Spalten ein-/ausblenden',
      bade_selected_amount: '{{amount}} ausgewählt',
      no_results_found: 'Keine Ergebnisse gefunden',
      reset_filter: 'Zurücksetzen',
      clear_filter: 'Filter löschen',
      column_header_hide: 'Ausblenden',
    },
    formbuilder: {
      search: 'Suchen...',
      select_date: 'Datum auswählen',
      submit: 'Speichern',
      cancel: 'Abbrechen',
    },
    page: {
      show_room: {
        heading: 'Showroom',
        loading: 'Loading Showroom...',
        name_label: 'Name',
        name_required: 'Bitte geben Sie einen Namen ein.',
        description_label: 'Beschreibung',
        description_required: 'Bitte geben Sie eine Beschreibung ein.',
        date_label: 'Datum',
        date_required: 'Bitte geben Sie ein Datum ein.',
        image_url_label: 'Avatar',
        image_url_description: 'Das Bild darf nicht',
        image_url_required: 'Bitte laden Sie ein Bild hoch.',
        frameworks_label: 'Frameworks',

        is_active_label: 'ist Aktiv',
        is_active_list: 'Status',
      },
      users: {

      },
      roles: {
        loading: 'Lädt...',
        name_label: 'Name',
        slug_label: 'Slug',
        save: 'Rolle speichern',
        save_success: 'Rolle erfolgreich gespeichert',
        save_error: 'Fehler beim Speichern der Rolle',
        edit_role: 'Rolle bearbeiten',
        create_role: 'Rolle erstellen',
        edit_role_description: 'Rolleninformationen und Berechtigungen aktualisieren',
        create_role_description: 'Neue Rolle erstellen und Berechtigungen zuweisen',
        name_placeholder: 'Rollenname eingeben',
        slug_placeholder: 'Rollen-Slug eingeben (z.B. admin, editor)',
        modules_section: 'Module',
        functions_section: 'Funktionen',
      },
      permissions: {
        loading: 'Lädt...',
        category_label: 'Kategorie',
        name_label: 'Berechtigung',
        resource_label: 'Ressource',
        action_label: 'Aktion',
        save: 'Berechtigung speichern',
        save_success: 'Berechtigung erfolgreich gespeichert',
        save_error: 'Fehler beim Speichern der Berechtigung',
        edit_permission: 'Berechtigung bearbeiten',
        create_permission: 'Berechtigung erstellen',
        edit_permission_description: 'Berechtigungsdetails aktualisieren',
        create_permission_description: 'Neue Berechtigung für rollenbasierte Zugriffskontrolle erstellen',
        category_description: 'Modul: Steuert Seitenzugriff (Lesen/Schreiben). Funktion: Steuert spezifische Aktionen.',
        resource_placeholder: 'z.B. users, reports, dashboard',
        action_placeholder: 'z.B. read, write, export, delete',
      },
      tasks: {
        page_title: 'Aufgaben',
        new_task: 'Neue Aufgabe',
        edit_task: 'Aufgabe bearbeiten',
        create_task: 'Aufgabe erstellen',
        delete_task: 'Aufgabe löschen',
        title_label: 'Titel',
        title_placeholder: 'Aufgabentitel eingeben',
        title_required: 'Bitte geben Sie einen Titel ein',
        description_label: 'Beschreibung',
        description_placeholder: 'Aufgabenbeschreibung eingeben',
        priority_label: 'Priorität',
        priority_placeholder: 'Priorität auswählen',
        status_label: 'Status',
        status_placeholder: 'Status auswählen',
        due_date_label: 'Fälligkeitsdatum',
        due_date_placeholder: 'Datum auswählen',
        priority_high: 'Hoch',
        priority_medium: 'Mittel',
        priority_low: 'Niedrig',
        status_backlog: 'Backlog',
        status_in_progress: 'In Bearbeitung',
        status_done: 'Erledigt',
        save_task: 'Aufgabe speichern',
        save_success: 'Aufgabe erfolgreich gespeichert',
        save_error: 'Fehler beim Speichern der Aufgabe',
        delete_success: 'Aufgabe erfolgreich gelöscht',
        delete_error: 'Fehler beim Löschen der Aufgabe',
        delete_confirm_title: 'Aufgabe löschen?',
        delete_confirm_description: 'Möchten Sie diese Aufgabe wirklich löschen?',
        empty_state_title: 'Keine Aufgaben',
        empty_state_description: 'Erstellen Sie Ihre erste Aufgabe, um zu beginnen',
        loading_tasks: 'Aufgaben werden geladen...',
        task_count: '{{count}} Aufgabe',
        task_count_plural: '{{count}} Aufgaben',
        manage_statuses: 'Status verwalten',
        add_status: 'Status hinzufügen',
        edit_status: 'Status bearbeiten',
        status_name_label: 'Statusname',
        status_name_placeholder: 'z.B. In Review',
      }
    }
  },
  en: {
    common: {},
    navigation: {
      tasks: 'Tasks'
    },
    data_table: {},
    formbuilder: {},
    page: {
      show_room: {},
      roles: {
        loading: 'Loading...',
        name_label: 'Name',
        slug_label: 'Slug',
        save: 'Save Role',
        save_success: 'Role saved successfully',
        save_error: 'Failed to save role',
        edit_role: 'Edit Role',
        create_role: 'Create Role',
        edit_role_description: 'Update role information and permissions',
        create_role_description: 'Create a new role and assign permissions',
        name_placeholder: 'Enter role name',
        slug_placeholder: 'Enter role slug (e.g., admin, editor)',
      },
      permissions: {
        loading: 'Loading...',
        category_label: 'Category',
        name_label: 'Permission',
        resource_label: 'Resource',
        action_label: 'Action',
        save: 'Save Permission',
        save_success: 'Permission saved successfully',
        save_error: 'Failed to save permission',
        edit_permission: 'Edit Permission',
        create_permission: 'Create Permission',
        edit_permission_description: 'Update permission details',
        create_permission_description: 'Create a new permission for role-based access control',
        category_description: 'Module: Controls page access (read/write). Function: Controls specific actions.',
        resource_placeholder: 'e.g., users, reports, dashboard',
        action_placeholder: 'e.g., read, write, export, delete',
      },
      tasks: {
        page_title: 'Tasks',
        new_task: 'New Task',
        edit_task: 'Edit Task',
        create_task: 'Create Task',
        delete_task: 'Delete Task',
        title_label: 'Title',
        title_placeholder: 'Enter task title',
        title_required: 'Please enter a title',
        description_label: 'Description',
        description_placeholder: 'Enter task description',
        priority_label: 'Priority',
        priority_placeholder: 'Select priority',
        status_label: 'Status',
        status_placeholder: 'Select status',
        due_date_label: 'Due Date',
        due_date_placeholder: 'Select date',
        priority_high: 'High',
        priority_medium: 'Medium',
        priority_low: 'Low',
        status_backlog: 'Backlog',
        status_in_progress: 'In Progress',
        status_done: 'Done',
        save_task: 'Save Task',
        save_success: 'Task saved successfully',
        save_error: 'Failed to save task',
        delete_success: 'Task deleted successfully',
        delete_error: 'Failed to delete task',
        delete_confirm_title: 'Delete Task?',
        delete_confirm_description: 'Are you sure you want to delete this task?',
        empty_state_title: 'No Tasks',
        empty_state_description: 'Create your first task to get started',
        loading_tasks: 'Loading tasks...',
        task_count: '{{count}} Task',
        task_count_plural: '{{count}} Tasks',
        manage_statuses: 'Manage Statuses',
        add_status: 'Add Status',
        edit_status: 'Edit Status',
        status_name_label: 'Status Name',
        status_name_placeholder: 'e.g., In Review',
      }
    },
  }
};

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'de',
      supportedLngs: ['en', 'de'],
      defaultNS: 'common',
      ns: ['common'],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        // order and from where user language should be detected
        order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'cookie'],
        // keys or params to lookup language from
        lookupQuerystring: 'lng',
        lookupLocalStorage: 'i18nextLng',
      },
      react: {
        useSuspense: true,
      },
    });

// Keep <html lang="..."> in sync
const updateHtmlLang = (lng: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
};

updateHtmlLang(i18n.resolvedLanguage || 'en');
i18n.on('languageChanged', updateHtmlLang);

export default i18n;
