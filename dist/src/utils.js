"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUrl = void 0;
const buildUrl = (baseUrl, keys) => {
    const url = new URL(baseUrl);
    Object.entries(keys).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });
    return url.href;
};
exports.buildUrl = buildUrl;
