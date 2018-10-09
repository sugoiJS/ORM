"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Dummy_1;
const index_1 = require("../../index");
const string_util_1 = require("@sugoi/core/dist/policies/utils/string.util");
const exceptions_contant_1 = require("../../constants/exceptions.contant");
const connection_name_decorator_1 = require("../../decorators/connection-name.decorator");
const ignore_decorator_1 = require("../../decorators/ignore.decorator");
let Dummy = Dummy_1 = class Dummy extends index_1.ConnectableModel {
    constructor(name) {
        super();
        this.name = name;
    }
    beforeFind(query, options) {
        if (query.fail)
            throw new index_1.SugoiModelException(exceptions_contant_1.EXCEPTIONS.INVALID.message, exceptions_contant_1.EXCEPTIONS.INVALID.code);
        return Dummy_1.connect();
    }
    afterFind(res) {
        res.forEach(item => item.found = true);
    }
    beforeRemove(query, options) {
        if (query.fail)
            throw new index_1.SugoiModelException(exceptions_contant_1.EXCEPTIONS.INVALID.message, exceptions_contant_1.EXCEPTIONS.INVALID.code);
        return Dummy_1.connect();
    }
    afterRemove(res) {
        res.ok = res.n > 0;
    }
    saveEmitter(options) {
        return Dummy_1.upsert(this);
    }
    static findEmitter(query, options = index_1.QueryOptions.builder()) {
        const limit = options.getLimit();
        const offset = options.getOffset();
        let response = Dummy_1.filterByQuery(query, limit, options.getSortOptions());
        return Promise.resolve(response);
    }
    static removeEmitter(query, options = index_1.QueryOptions.builder()) {
        const hasId = !!this.getIdFromQuery(query, this, false);
        const limit = options.limit || 0;
        const originalSize = Dummy_1.RECORDS.length;
        const size = originalSize - limit;
        let i = 0;
        Dummy_1.RECORDS = hasId || limit
            ? Dummy_1.filterByQuery(query, size, options.sort, hasId)
            : Dummy_1.RECORDS.filter(rec => {
                return !(i++ < size && Dummy_1.validRecordByQuery(rec, query));
            });
        const res = { n: originalSize - Dummy_1.RECORDS.length };
        return Promise.resolve(res);
    }
    updateEmitter(options) {
        const index = Dummy_1.RECORDS.findIndex((rec) => Dummy_1.validRecordByQuery(rec, { id: this.id }));
        if (index === -1)
            throw new index_1.SugoiModelException("Not updated", 5000);
        else {
            Dummy_1.RECORDS.splice(index, 1);
        }
        return Dummy_1.upsert(this);
    }
    static upsert(record) {
        return new Promise(resolve => {
            setTimeout(() => {
                const rec = Object.assign({}, record);
                Dummy_1.RECORDS.push(rec);
                resolve(rec);
            }, 1000);
        });
    }
    static filterByQuery(query, limit = Dummy_1.RECORDS.length, sort, not = false) {
        if (sort) {
            Dummy_1.RECORDS.sort((a, b) => {
                const aField = a[sort.field];
                const bField = b[sort.field];
                return sort.sortOption === "DESC" ? bField - aField : aField - bField;
            });
        }
        return Dummy_1.RECORDS.reduce((arr, rec) => {
            let valid = Dummy_1.validRecordByQuery(rec, query);
            valid = not ? !valid : valid;
            if ((not || arr.length < limit) && valid) {
                arr.push(rec);
            }
            return arr;
        }, []);
    }
    static validRecordByQuery(record, query) {
        let valid = false;
        for (let prop in query) {
            valid = true;
            valid = valid && (typeof query[prop] === "string"
                ? record[prop].indexOf(query[prop]) > -1
                : query[prop] === record[prop]);
            if (!valid)
                break;
        }
        return valid;
    }
    beforeValidate() {
        this.name = this.isUpdate
            ? "u_" + this.name : this.name;
    }
    beforeUpdate() {
        this.lastUpdated = "today";
        return Dummy_1.connect();
    }
    afterUpdate(updateResponse) {
        this.updated = this.lastUpdated === "today";
    }
    beforeSave() {
        this.id = string_util_1.StringUtils.generateGuid();
        this.lastSaved = "today";
        this.lastSavedTime = new Date().getTime();
        return Dummy_1.connect();
    }
    afterSave(saveResponse) {
        this.saved = true;
    }
    validate() {
        return Promise.resolve(isNaN(parseInt(this.name)));
    }
    static builder(name) {
        return new Dummy_1(name);
    }
};
Dummy.RECORDS = [];
__decorate([
    index_1.Primary(),
    __metadata("design:type", Object)
], Dummy.prototype, "id", void 0);
__decorate([
    ignore_decorator_1.Ignore(),
    __metadata("design:type", Boolean)
], Dummy.prototype, "saved", void 0);
__decorate([
    ignore_decorator_1.Ignore(),
    __metadata("design:type", Boolean)
], Dummy.prototype, "updated", void 0);
__decorate([
    ignore_decorator_1.Ignore(),
    __metadata("design:type", Boolean)
], Dummy.prototype, "isUpdate", void 0);
Dummy = Dummy_1 = __decorate([
    index_1.ModelName("dummy"),
    connection_name_decorator_1.ConnectionName("TESTING"),
    __metadata("design:paramtypes", [String])
], Dummy);
exports.Dummy = Dummy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9fX3Rlc3RzX18vbW9kZWxzL2R1bW15LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHVDQW1CcUI7QUFDckIsNkVBQXdFO0FBQ3hFLDJFQUE4RDtBQUM5RCwwRkFBMEU7QUFDMUUsd0VBQXlEO0FBS3pELElBQWEsS0FBSyxhQUFsQixNQUFhLEtBQU0sU0FBUSx3QkFBZ0I7SUFpQnZDLFlBQVksSUFBWTtRQUNwQixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBVSxFQUFFLE9BQXFDO1FBQ3hELElBQUksS0FBSyxDQUFDLElBQUk7WUFDVixNQUFNLElBQUksMkJBQW1CLENBQUMsK0JBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLCtCQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3RGLE9BQU8sT0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxTQUFTLENBQUMsR0FBRztRQUNULEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFBO0lBQzFDLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBVSxFQUFFLE9BQXFDO1FBQzFELElBQUksS0FBSyxDQUFDLElBQUk7WUFDVixNQUFNLElBQUksMkJBQW1CLENBQUMsK0JBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLCtCQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3RGLE9BQU8sT0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxXQUFXLENBQUMsR0FBRztRQUNYLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFD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