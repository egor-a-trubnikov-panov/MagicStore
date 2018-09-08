import { getPathFromTemplateString } from "./templateStringParser";
import { PF } from "../../pureFunctions";

export interface ISellector {
  or(
    templateData: TemplateStringsArray,
    ...args: any[]
  ): (defaultValue: any) => any;
  (templateData: TemplateStringsArray, ...args: any[]): any;
}

export function sel(state: object): ISellector {
  // @ts-ignore
  const selector: ISellector = (
    templateData: TemplateStringsArray,
    ...args: any[]
  ) => {
    const path: string[] = getPathFromTemplateString(templateData, ...args);
    return PF.path(path, state);
  };

  selector.or = (templateData: TemplateStringsArray, ...args: any[]) => (
    defaultValue: any
  ) => {
    const path: string[] = getPathFromTemplateString(templateData, ...args);
    return PF.pathOr(defaultValue, path, state);
  };

  return selector;
}
