import { StripoMergeTag } from './stripo-merge-tag';

export interface StripoApiRequestData {
  emailId: string;
  [key: string]: string;
}
export interface StripoConfig {
  settingsId: string;
  previewId: string;
  apiRequestData: StripoApiRequestData;
  html: string;
  css: string;
  canBeSavedToLibrary?: (moduleHtml: string) => boolean;
  getAuthToken: (callback: (token: string) => void) => void;
  locale?: string;
  userFullName?: string;
  codeEditorButtonId?: string;
  undoButtonId?: string;
  redoButtonId?: string;
  ignoreClickOutsideSelectors?: string;
  onTemplateLoaded?: () => void;
  onElementSelected?: (name: string) => void;
  mergeTags?: StripoMergeTag[];
  viewOnly?: boolean;
  apiBaseUrl?: string;
  conditionsEnabled?: boolean;
  hideStripoImgUrl?: boolean;
  eventHandler?: (type: string, data: any) => void;
  localePatch?: Record<string, Record<string, string>>;
  customViewStyles?: string;
  externalImagesLibrary: () => void;
}

export interface Stripo {
  init: (config: StripoConfig) => void;
}
