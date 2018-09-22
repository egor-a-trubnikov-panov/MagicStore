import { getPathFromTemplateString } from './templateStringParser';
import { path as Rpath, pathOr } from 'ramda';

export interface ISellector {
  or(
    templateData: TemplateStringsArray,
    ...args: any[]
  ): (defaultValue: any) => any;
  (templateData: TemplateStringsArray, ...args: any[]): any;
}

export function sel(state: any): ISellector {
  // @ts-ignore
  const selector: ISellector = (templateData, ...args) => {
    const path: string[] = getPathFromTemplateString(templateData, ...args);
    return Rpath(path, state);
  };

  selector.or = (templateData: TemplateStringsArray, ...args: any[]) => {
    return (defaultValue: any) => {
      const path: string[] = getPathFromTemplateString(templateData, ...args);
      return pathOr(defaultValue, path, state);
    };
  };

  return selector;
}
