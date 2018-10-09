"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ignore_decorator_1 = require("../decorators/ignore.decorator");
class Storeable {
    constructor() {
        this.modelInstanceMeta = {};
        this.flagMetaAsIgnored();
    }
    flagMetaAsIgnored() {
        this.flagAsIgnored('modelInstanceMeta', true);
    }
    flagAsIgnored(field, ignored) {
        const descriptor = Object.getOwnPropertyDescriptor(this, field);
        if (!descriptor)
            return;
        descriptor.enumerable = !ignored;
        descriptor.configurable = true;
        Object.defineProperty(this, field, descriptor);
    }
    static setModelMeta(key, value) {
        this.ModelMeta[key] = value;
    }
    setModelMeta(key, value) {
        this.modelInstanceMeta[key] = value;
    }
    static getModelMeta(key) {
        return this.ModelMeta[key];
    }
    getModelMeta(key) {
        return this.modelInstanceMeta[key];
    }
    static hasModelMeta(key) {
        return this.ModelMeta.hasOwnProperty(key);
    }
    hasModelMeta(key) {
        return this.modelInstanceMeta.hasOwnProperty(key);
    }
    static deleteModelMeta(key) {
        delete this.ModelMeta[key];
    }
    deleteModelMeta(key) {
        delete this.modelInstanceMeta[key];
    }
    addFieldsToIgnore(...fields) {
        ignore_decorator_1.addIgnoredFields(this, ...fields);
    }
    removeFieldsFromIgnored(...fields) {
        ignore_decorator_1.removeFieldsFromIgnored(this, ...fields);
    }
    initIgnoredFields() {
        ignore_decorator_1.initInstanceIgnoredFields(this);
    }
    getIgnoredFields() {
        return ignore_decorator_1.getIgnoredFields(this);
    }
    hideIgnoredFields() {
        const ignoredFields = this.getIgnoredFields();
        ignoredFields.forEach(field => {
            this.flagAsIgnored(field, true);
        });
    }
    revertIgnoredFields() {
        const ignoredFields = this.getIgnoredFields();
        ignoredFields.forEach(field => {
            if (field === "modelInstanceMeta")
                return;
            this.flagAsIgnored(field, false);
        });
    }
}
Storeable.ModelMeta = {};
exports.Storeable = Storeable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmVhYmxlLmNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vY2xhc3Nlcy9zdG9yZWFibGUuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxRUFLd0M7QUFFeEMsTUFBYSxTQUFTO0lBS2xCO1FBRlUsc0JBQWlCLEdBQXlCLEVBQUUsQ0FBQztRQUduRCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUM1QixDQUFDO0lBRU0saUJBQWlCO1FBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVPLGFBQWEsQ0FBQyxLQUFhLEVBQUUsT0FBZ0I7UUFDakQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsVUFBVTtZQUFFLE9BQU87UUFDeEIsVUFBVSxDQUFDLFVBQVUsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUNqQyxVQUFVLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUMvQixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBVyxFQUFFLEtBQVU7UUFDOUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDaEMsQ0FBQztJQUVNLFlBQVksQ0FBQyxHQUFXLEVBQUUsS0FBVTtRQUN2QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEdBQUksS0FBSyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxNQUFNLENBQUMsWUFBWSxDQUFRLEdBQVc7UUFDekMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBTSxDQUFDO0lBQ3BDLENBQUM7SUFFTSxZQUFZLENBQVEsR0FBVztRQUNsQyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQU0sQ0FBQztJQUM1QyxDQUFDO0lBRU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFXO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVNLFlBQVksQ0FBQyxHQUFXO1FBQzNCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBRU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFXO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU0sZUFBZSxDQUFDLEdBQVc7UUFDOUIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEdBQUcsTUFBZ0I7UUFDeEMsbUNBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVNLHVCQUF1QixDQUFDLEdBQUcsTUFBZ0I7UUFDOUMsMENBQXVCLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUdNLGlCQUFpQjtRQUNwQiw0Q0FBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU0sZ0JBQWdCO1FBQ25CLE9BQU8sbUNBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUdNLGlCQUFpQjtRQUNwQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVTLG1CQUFtQjtRQUN6QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLElBQUksS0FBSyxLQUFLLG1CQUFtQjtnQkFBRSxPQUFPO1lBQzFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7QUFsRmMsbUJBQVMsR0FBeUIsRUFBRSxDQUFDO0FBRnhELDhCQXFGQyJ9