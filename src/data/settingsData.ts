import { AdminSettings } from "../types/settings.types";

export const initialSettings: AdminSettings = {
  siteIdentity: {
    siteName: "VexiraHub",
    siteTagline: "The modern tech blog",
    shortHeadline: "Tech & Beyond",
    defaultAuthorDisplay: "Nitin Jaiswal",
  },
  appearance: {
    defaultTheme: "dark",
    accentColor: "Purple",
    heroStyle: "modern",
    cardStyle: "glass",
    glassmorphism: true,
    animations: true,
  },
  contentPreferences: {
    showTrending: true,
    showLatest: true,
    showThoughts: true,
    showExploreTopics: true,
    showReadingTime: true,
    showViewCount: true,
    showShareButtons: true,
    enableComments: true,
  },
  documentConversion: {
    enableDocxUpload: true,
    enablePdfUpload: true,
    allowEmbeddedImages: true,
    preserveStyling: true,
    generateHtmlPreview: true,
    embedCssInStyleTag: true,
    sanitizeUploadedHtml: true,
  },
  notifications: {
    enabled: true,
    newComments: true,
    highTrafficPosts: true,
    draftReminders: false,
    documentUploads: true,
    legalUpdates: true,
  },
  security: {
    strongPassword: true,
    autoLogout: false,
    loginReminder: true,
  },
};
