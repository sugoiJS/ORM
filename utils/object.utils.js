"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clone(classIns, data) {
    let temp = {};
    try {
        try {
            const func = function () {
            };
            func.prototype = classIns.prototype;
            temp = new func();
            classIns.apply(temp, []);
            temp.constructor = classIns;
        }
        catch (e) {
            temp = new classIns();
        }
    }
    catch (e) {
        console.error(e);
        return data;
    }
    Object.assign(temp, data);
    return temp;
}
exports.clone = clone;
