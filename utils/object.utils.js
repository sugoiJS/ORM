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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LnV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbHMvb2JqZWN0LnV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBQyxJQUFJO0lBQy9CLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNkLElBQUk7UUFDQSxJQUFJO1lBQ0EsTUFBTSxJQUFJLEdBQUc7WUFDYixDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDcEMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDbEIsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7U0FDL0I7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1NBQ3pCO0tBQ0o7SUFDRCxPQUFPLENBQUMsRUFBRTtRQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFCLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFwQkQsc0JBb0JDIn0=