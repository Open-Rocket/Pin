"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.api = void 0;
var API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
console.log('API_BASE_URL:', API_BASE_URL);
exports.api = {
    get: function (endpoint) {
        return __awaiter(this, void 0, Promise, function () {
            var fullUrl, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullUrl = "" + API_BASE_URL + endpoint;
                        console.log('GET request to:', fullUrl);
                        return [4 /*yield*/, fetch(fullUrl)];
                    case 1:
                        response = _a.sent();
                        console.log('Response status:', response.status, response.statusText);
                        if (!response.ok) {
                            throw new Error("API Error: " + response.statusText);
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        console.log('Response data:', data);
                        return [2 /*return*/, data];
                }
            });
        });
    },
    post: function (endpoint, data) {
        return __awaiter(this, void 0, Promise, function () {
            var fullUrl, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullUrl = "" + API_BASE_URL + endpoint;
                        console.log('POST request to:', fullUrl, data);
                        return [4 /*yield*/, fetch(fullUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            })];
                    case 1:
                        response = _a.sent();
                        console.log('Response status:', response.status);
                        if (!response.ok) {
                            throw new Error("API Error: " + response.statusText);
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        });
    },
    patch: function (endpoint, data) {
        return __awaiter(this, void 0, Promise, function () {
            var fullUrl, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullUrl = "" + API_BASE_URL + endpoint;
                        console.log('PATCH request to:', fullUrl, data);
                        return [4 /*yield*/, fetch(fullUrl, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("API Error: " + response.statusText);
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        });
    },
    "delete": function (endpoint) {
        return __awaiter(this, void 0, Promise, function () {
            var fullUrl, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullUrl = "" + API_BASE_URL + endpoint;
                        console.log('DELETE request to:', fullUrl);
                        return [4 /*yield*/, fetch(fullUrl, {
                                method: 'DELETE'
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("API Error: " + response.statusText);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
};
