export type AdminSettings = {
  siteIdentity: {
    siteName: string;
    siteTagline: string;
    shortHeadline: string;
    logo?: string;
    favicon?: string;
    defaultAuthorDisplay: string;
  };
  appearance: {
    defaultTheme: "dark" | "light";
    accentColor: string;
    heroStyle: string;
    cardStyle: string;
    glassmorphism: boolean;
    animations: boolean;
  };
  contentPreferences: {
    showTrending: boolean;
    showLatest: boolean;
    showThoughts: boolean;
    showExploreTopics: boolean;
    showReadingTime: boolean;
    showViewCount: boolean;
    showShareButtons: boolean;
    enableComments: boolean;
  };
  documentConversion: {
    enableDocxUpload: boolean;
    enablePdfUpload: boolean;
    allowEmbeddedImages: boolean;
    preserveStyling: boolean;
    generateHtmlPreview: boolean;
    embedCssInStyleTag: boolean;
    sanitizeUploadedHtml: boolean;
  };
  notifications: {
    enabled: boolean;
    newComments: boolean;
    highTrafficPosts: boolean;
    draftReminders: boolean;
    documentUploads: boolean;
    legalUpdates: boolean;
  };
  security: {
    strongPassword: boolean;
    autoLogout: boolean;
    loginReminder: boolean;
  };
};
