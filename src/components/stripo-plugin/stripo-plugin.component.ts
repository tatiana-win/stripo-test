import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DEFAULT_CSS, DEFAULT_EMAIL_TEMPLATE } from '../../const';
import {
  Stripo,
  StripoApi,
  StripoApiRequestData,
  StripoConfig,
} from '../../services';
import './external_images_library.js';

// @ts-ignore
function request(method, url, data, callback) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      callback(req.responseText);
    } else if (req.readyState === 4 && req.status !== 200) {
      console.error('Can not complete request. Please check you entered a valid PLUGIN_ID and SECRET_KEY values');
    }
  };
  req.open(method, url, true);
  if (method !== 'GET') {
    req.setRequestHeader('content-type', 'application/json');
  }
  req.send(data);
}

declare const window: {
  Stripo: Stripo;
  StripoApi: StripoApi;
  ExternalImagesLibrary: () => void;
} & Window;

@Component({
  selector: 'iru-stripo-plugin',
  templateUrl: './stripo-plugin.component.html',
  styleUrls: [
    './stripo-plugin.component.css',
  ],
})
export class StripoPluginComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  htmlCode?: string;

  @Input()
  cssCode?: string;

  @Input()
  apiRequestData: StripoApiRequestData = {
    emailId: 'tatiana@ireckonu.com',
    Customer: 'ireckonu'
  };

  config: StripoConfig;

  isCodeEditorOpened = false;

  isLoaded = false;

  selectedElement = '';

  constructor(
  ) {
    this.config = {
      settingsId: 'stripoSettingsContainer',
      previewId: 'stripoPreviewContainer',
      apiRequestData: this.apiRequestData,
      html: this.htmlCode || DEFAULT_EMAIL_TEMPLATE,
      css: this.cssCode || DEFAULT_CSS,
      hideStripoImgUrl: true,
      codeEditorButtonId: 'codeEditor',
      ignoreClickOutsideSelectors: '#handlebarsDialog',
      externalImagesLibrary: window.ExternalImagesLibrary,
      onTemplateLoaded: () => (this.isLoaded = true),
      onElementSelected: (name) => {
        this.selectedElement = window.StripoApi.getSelectedElementHtml();
      },
      localePatch: {
        'mergeTags.label': {
          en: 'Handlebars',
        },
      },
      customViewStyles: `.highlighted {
        border: 1px solid blue;
    }`,
      canBeSavedToLibrary: function (moduleHtml) {
        return true;
      },
      getAuthToken: function (callback) {
        request('POST', 'https://plugins.stripo.email/api/v1/auth',
          JSON.stringify({
            pluginId: '',
            secretKey: ''
          }),
          function(data: any) {
            callback(JSON.parse(data).token);
          });
      }
    };
  }

  ngOnInit() {
    this.initStripo();
  }

  ngOnDestroy() {
    window.StripoApi.stop();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      !changes['htmlCode']?.firstChange &&
      changes['htmlCode']?.currentValue
    ) {
      this.config = {
        ...this.config,
        html: changes['htmlCode'].currentValue,
      };
      this.initStripo();
    }
  }


  private initStripo() {
    window.Stripo.init(this.config);
  }

  triggerCodeEditor = () => {
    this.isCodeEditorOpened = !this.isCodeEditorOpened;
  };

  getTemplate(): Promise<{
    html: string;
    css: string;
    width: number;
    height: number;
  }> {
    return new Promise((resolve) => {
      window.StripoApi?.getTemplate((html, css, width, height) => {
        resolve({ html, css, width, height });
      });
    });
  }

  getCompiledEmail(): Promise<{
    error: string;
    html: string;
    ampHtml: string;
    ampErrors: string;
  }> {
    return new Promise((resolve) => {
      window.StripoApi?.compileEmail((error, html, ampHtml, ampErrors) => {
        resolve({ error, html, ampHtml, ampErrors });
      }, true);
    });
  }

  hasUnsavedChanges() {
    return !this.isLoaded || !window.StripoApi?.allDataSaved();
  }

}
