export const getPathFromTemplateString = (
  templateData: TemplateStringsArray,
  ...args: any[]
): string[] => {
  let s = templateData[0];
  for (let i = 1, j = 0; j < args.length; i++, j++) {
    let arg = String(args[j]);

    // Escape special characters in the substitution.
    s += arg;

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s.split(".");
};
