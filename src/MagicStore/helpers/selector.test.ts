import { selectorCreator } from './ISellector';
import { globalStateKey } from './constants';

const store = new Map;
store.set(globalStateKey, {
  desc: 'temp object',
  hogwarts: {
    students: {
      Hary: {
        name: 'Hary',
        old: 11,
      },
      Hermiona: {
        name: 'Hermiona',
        old: 12,
      },
      Drako: {
        name: 'Drako',
        old: 11,
      },
    },
    professors: [
      {
        name: 'Albus',
        old: 150,
      },
      {
        name: 'Minerva',
        old: 120,
      },
      {
        name: 'Severus',
        old: 50,
      },
    ],
  },
});

const selector = selectorCreator(store);

describe('selector', () => {
  test('prop', () => {
    expect(selector`desc`).toBe('temp object');
  });

  test('obj.obj.prop', () => {
    expect(selector`hogwarts.students.Hary.name`).toBe('Hary');
  });

  test('obj.obj(prop = value)', () => {
    expect(JSON.stringify(selector`hogwarts.students(old = 12)`)).toBe(`[{"name":"Hermiona","old":12}]`);
  });

  test('obj.obj(prop != value)', () => {
    expect(JSON.stringify(selector`hogwarts.students(old != 12)`)).toBe(`[{"name":"Hary","old":11},{"name":"Drako","old":11}]`);
  });

  test('obj.obj(prop != value).prop', () => {
    expect(JSON.stringify(selector`hogwarts.students(old != 12).name`)).toBe(`["Hary","Drako"]`);
  });

  test('obj.obj(prop > value)', () => {
    expect(JSON.stringify(selector`hogwarts.students(old > 11)`)).toBe(`[{"name":"Hermiona","old":12}]`);
  });

  test('obj.obj(prop >= value)', () => {
    expect(JSON.stringify(selector`hogwarts.students(old >= 11)`)).toBe(`[{"name":"Hary","old":11},{"name":"Hermiona","old":12},{"name":"Drako","old":11}]`);
  });

  test('obj.obj(prop < value)', () => {
    expect(JSON.stringify(selector`hogwarts.students(old < 12)`)).toBe(`[{"name":"Hary","old":11},{"name":"Drako","old":11}]`);
  });

  test('obj.obj(prop <= value)', () => {
    expect(JSON.stringify(selector`hogwarts.students(old <= 12)`)).toBe(`[{"name":"Hary","old":11},{"name":"Hermiona","old":12},{"name":"Drako","old":11}]`);
  });


  test('obj.list(prop = value)', () => {
    expect(JSON.stringify(selector`hogwarts.professors(old = 50)`)).toBe(`[{"name":"Severus","old":50}]`);
  });

  test('obj.list(prop != value).prop', () => {
    expect(JSON.stringify(selector`hogwarts.professors(old != 50).old`)).toBe(`[150,120]`);
  });

  test('obj.list(prop != value)', () => {
    expect(JSON.stringify(selector`hogwarts.professors(old != 50)`)).toBe(`[{"name":"Albus","old":150},{"name":"Minerva","old":120}]`);
  });

  test('obj.list(prop > value)', () => {
    expect(JSON.stringify(selector`hogwarts.professors(old > 100)`)).toBe(`[{"name":"Albus","old":150},{"name":"Minerva","old":120}]`);
  });

  test('obj.list(prop >= value)', () => {
    expect(JSON.stringify(selector`hogwarts.professors(old >= 100)`)).toBe(`[{"name":"Albus","old":150},{"name":"Minerva","old":120}]`);
  });

  test('obj.list(prop < value)', () => {
    expect(JSON.stringify(selector`hogwarts.professors(old < 100)`)).toBe(`[{"name":"Severus","old":50}]`);
  });

  test('obj.list(prop <= value)', () => {
    expect(JSON.stringify(selector`hogwarts.professors(old <= 120)`)).toBe(`[{"name":"Minerva","old":120},{"name":"Severus","old":50}]`);
  });

});