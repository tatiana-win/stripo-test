export interface StripoApi {
  getTemplate: (
    callback: (
      html: string,
      css: string,
      width: number,
      height: number,
    ) => void,
  ) => void;
  compileEmail: (
    callback: (
      error: string,
      html: string,
      ampHtml: string,
      ampErrors: string,
    ) => void,
    minimize: boolean,
  ) => void;
  stop: () => void;
  activateCustomViewStyles: (flag: boolean) => void;
  updateHtmlAndCss: (html: string, css: string) => void;
  allDataSaved: () => boolean;
  getSelectedElementHtml: () => string;
  updateSelectedElementHtml: (element: string) => void;
}
