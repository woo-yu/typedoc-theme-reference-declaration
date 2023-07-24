import {Application} from 'typedoc';
import {ReferenceTheme} from './Theme';

export function load(app: Application) {
  app.renderer.defineTheme('reference-theme', ReferenceTheme);
}
