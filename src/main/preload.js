"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var electron_1 = require("electron");
var got_1 = require("got");
electron_1.contextBridge.exposeInMainWorld('contextModules', {
    got: function (url, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, got_1["default"](url, __assign(__assign({}, config), { retry: 3, timeout: 6000 }))];
        }); });
    },
    process: {
        production: process.env.NODE_ENV === 'production',
        electron: process.versions.electron
    },
    electron: {
        shell: {
            openExternal: electron_1.shell.openExternal
        },
        ipcRenderer: {
            send: electron_1.ipcRenderer.send,
            invoke: electron_1.ipcRenderer.invoke,
            removeAllListeners: electron_1.ipcRenderer.removeAllListeners,
            on: function (channel, func) {
                var validChannels = [
                    'nativeTheme-updated',
                    'clipboard-funds-copy',
                    'clipboard-funds-import',
                    'update-available',
                ];
                if (validChannels.includes(channel)) {
                    return electron_1.ipcRenderer.on(channel, function (event) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args[_i - 1] = arguments[_i];
                        }
                        return func.apply(void 0, __spreadArray([event], args));
                    });
                }
                else {
                    return null;
                }
            }
        },
        dialog: {
            showMessageBox: function (config) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, electron_1.ipcRenderer.invoke('show-message-box', config)];
            }); }); }
        },
        invoke: {
            showCurrentWindow: function () { return electron_1.ipcRenderer.invoke('show-current-window'); },
            getShouldUseDarkColors: function () {
                return electron_1.ipcRenderer.invoke('get-should-use-dark-colors');
            },
            setNativeThemeSource: function (config) {
                return electron_1.ipcRenderer.invoke('set-native-theme-source', config);
            }
        },
        app: {
            setLoginItemSettings: function (config) {
                return electron_1.ipcRenderer.invoke('set-login-item-settings', config);
            },
            quit: function () { return electron_1.ipcRenderer.invoke('app-quit'); }
        },
        clipboard: {
            readText: electron_1.clipboard.readText,
            writeText: electron_1.clipboard.writeText
        }
    }
});
