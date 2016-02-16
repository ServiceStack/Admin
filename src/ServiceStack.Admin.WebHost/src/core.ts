
export const normalizeKey = (key: string) => key.toLowerCase().replace(/_/g, '');

const isArray = (o: any) => Object.prototype.toString.call(o) === '[object Array]';

const log = (o: any) => { console.log(o, typeof(o)); return o; }

export const normalize = (dto: any, into?: any, deep?: boolean) =>
    isArray(dto)
    ? deep ? dto.map(o => normalize(o, null, deep)) : dto
    : typeof dto == "object"
        ? Object.keys(dto).reduce((o, k) => {
            o[normalizeKey(k)] = deep ? normalize(dto[k]) : dto[k];
            return o;
          }, into || {})
        : dto;

export const getField = (o: any, name: string) =>
    o == null || name == null ? null :
        o[name] ||
        o[name[0].toUpperCase() + name.substring(1)] ||
        o[name[0].toLowerCase() + name.substring(1)] ||
        o[name.toLowerCase()] ||
        o[name.replace(/_/g, '')];
