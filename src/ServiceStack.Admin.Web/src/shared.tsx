import { JsonServiceClient, sanitize } from 'servicestack-client';

declare var global; //populated from package.json/jest

export var BasePath = location.pathname.substring(0, location.pathname.indexOf("/ss_admin") + 1);

export var client = new JsonServiceClient(global.BaseUrl || BasePath);

export const normalizeKey = (key: string) => key.toLowerCase().replace(/_/g, '');

const isArray = (o: any) => Object.prototype.toString.call(o) === '[object Array]';

const log = (o: any) => { console.log(o, typeof(o)); return o; }

export const normalize = (dto: any, deep?: boolean) => {
    if (dto == null)
        return dto;
    if (isArray(dto)) {
        if (!deep) return dto;
        const to = [];
        for (let i = 0; i < dto.length; i++) {
            to[i] = normalize(dto[i], deep);
        }
        return to;
    }
    if (typeof dto != "object") return dto;
    const o = {};
    for (let k in dto) {
        o[normalizeKey(k)] = deep ? normalize(dto[k], deep) : dto[k];
    }
    return o;
}

export const getField = (o: any, name: string) =>
    o == null || name == null ? null :
        o[name] ||
        o[Object.keys(o).filter(k => normalizeKey(k) === normalizeKey(name))[0] || ''];

export const parseResponseStatus = (json, defaultMsg=null) => {
    try {
        const err = JSON.parse(json);
        return sanitize(err.ResponseStatus || err.responseStatus);
    } catch (e) {
        return {
            message: defaultMsg,
            __error: { error: e, json: json }
        };
    }
};