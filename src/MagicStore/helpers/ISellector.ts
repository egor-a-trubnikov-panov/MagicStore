import { globalStateKey } from './constants';

export interface ISellector {
  or<T>(
    templateData: TemplateStringsArray,
    ...args: any[]
  ): (defaultValue: T) => T;

  <T>(templateData: TemplateStringsArray, ...args: any[]): T;
}

export function selectorCreator(state: Map<string, {}>): ISellector {
  // @ts-ignore
  const selector: ISellector = (templateData, ...args) => {
    const select: string = templateStringToString(templateData, ...args);
    return parseTheSelector(select, state.get(globalStateKey) as {});
  };

  selector.or = (templateData, ...args) => {
    return (defaultValue) => {
      const select: string = templateStringToString(templateData, ...args);
      return parseTheSelector(select, state.get(globalStateKey) as {}) || defaultValue;
    };
  };

  return selector;
}

function templateStringToString(templateData: TemplateStringsArray, ...args: any[]): string {
  let selectorString: string = templateData[0];

  for (let i = 1, j = 0; j < args.length; i++, j++) {
    const arg = String(args[j]);

    // Escape special characters in the substitution.
    selectorString += arg;

    // Don't escape special characters in the template.
    selectorString += templateData[i];
  }
  return selectorString;
}


enum Condition {
  Eq = '=',
  Lt = '<',
  Lte = '<=',
  Gt = '>',
  Gte = '>=',
  NotEg = '!='
}

interface IConditionParams {
  key: string
  name: Condition
  value: string
}

interface IOperator {
  value: string
  condition?: IConditionParams
}


function parseTheSelector(selector: string, state: object) {
  const path = selector.split('.');

  const operators: IOperator[] = [];

  for (const item of path) {
    if (/\(.*\)/.test(item)) {
      const [key] = item.split(/\(.*\)/);

      const matchCondition = item.match(/\(.*\)/g);
      if (!(matchCondition && matchCondition[0])) {
        throw new Error(`selector is not correct: ${selector}`);
      }

      const conditionString: string = matchCondition[0];
      const condition = getConditionParams(conditionString);

      operators.push({ value: key, condition });
    } else {
      operators.push({ value: item });
    }
  }

  return operators.reduce((previousValue: object, currentItem: IOperator) => {

    if (previousValue[currentItem.value] !== undefined) {
      const result = previousValue[currentItem.value];

      if (currentItem.condition) {
        const { key, name, value } = currentItem.condition;

        if (Array.isArray(result)) {
          return result.filter((item) => conditionTo(item[key], name, value));
        } else {
          const filtered: any[] = [];
          Object.keys(result).forEach((item) => {
            if (conditionTo(result[item][key], name, value)) {
              filtered.push(result[item]);
            }
          });
          return filtered;
        }
      }

      return result;
    }
    if (Array.isArray(previousValue)) {
      return previousValue.map((item) => item[currentItem.value]);
    }
    throw new Error(`selector is not correct: ${selector}`);

  }, { ...state });
}

function getConditionParams(conditionString: string): IConditionParams {

  const condition = conditionString.split(/\(|\)|\s/).join('');
  let key: string = '';
  let name: Condition = Condition.Eq;
  let value: string = '';

  if (/>/.test(condition)) {
    [key, value] = condition.split('>');
    name = Condition.Gt;
  }
  if (/=/.test(condition)) {
    [key, value] = condition.split('=');
    name = Condition.Eq;
  }
  if (/>=/.test(condition)) {
    [key, value] = condition.split('>=');
    name = Condition.Gte;
  }
  if (/</.test(condition)) {
    [key, value] = condition.split('<');
    name = Condition.Lt;
  }
  if (/<=/.test(condition)) {
    [key, value] = condition.split('<=');
    name = Condition.Lte;
  }
  if (/!=/.test(condition)) {
    [key, value] = condition.split('!=');
    name = Condition.NotEg;
  }

  return {
    key,
    name,
    value,
  };
}

function conditionTo(item: any, conditionType: Condition, value: any) {
  switch (conditionType) {
    case Condition.Eq:
      return String(item) === value;
    case Condition.NotEg:
      return String(item) !== value;
    case Condition.Lt:
      return item < value;
    case Condition.Lte:
      return item <= value;
    case Condition.Gt:
      return item > value;
    case Condition.Gte:
      return item >= value;
  }
}