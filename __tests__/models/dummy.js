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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var Dummy_1;
const index_1 = require("../../index");
const string_util_1 = require("@sugoi/core/dist/policies/utils/string.util");
const exceptions_contant_1 = require("../../constants/exceptions.contant");
const sort_options_enum_1 = require("../../constants/sort-options.enum");
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
    saveEmitter(options, data) {
        return Dummy_1.upsert(data);
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
    updateEmitter(options = {}, query = this.getIdQuery()) {
        return __awaiter(this, void 0, void 0, function* () {
            let limit = options.limit || 100000;
            let counter = 0;
            const results = [];
            Dummy_1.RECORDS = Dummy_1.RECORDS.reduce((arr, rec) => {
                if (counter < limit && Dummy_1.validRecordByQuery(rec, query)) {
                    rec = options.upsert === false ? this : Object.assign({}, rec, this);
                    rec = JSON.parse(JSON.stringify(rec));
                    results.push(rec);
                    counter++;
                }
                arr.push(rec);
                return arr;
            }, []);
            if (results.length === 0) {
                throw new index_1.SugoiModelException("Not updated", 5000);
            }
            return options.limit === 1 ? results[0] : results;
        });
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
    static filterByQuery(query, limit = Dummy_1.RECORDS.length, sort, not = false, preserveIndexes = false) {
        if (sort) {
            Dummy_1.RECORDS.sort((a, b) => {
                const aField = a[sort.field];
                const bField = b[sort.field];
                return sort.sortOption === sort_options_enum_1.SortOptions.DESC ? bField - aField : aField - bField;
            });
        }
        let counter = 0;
        return Dummy_1.RECORDS.reduce((arr, rec) => {
            let valid = Dummy_1.validRecordByQuery(rec, query);
            valid = not ? !valid : valid;
            if (valid && (not || (counter++ < limit))) {
                arr.push(rec);
            }
            else if (preserveIndexes)
                arr.push({});
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
        this.name = this.isUpdate && this.name.indexOf("u_") != 0
            ? "u_" + this.name : this.name;
    }
    beforeUpdate() {
        this.lastUpdated = "today";
        // this.removeMandatoryFields("name");
        if (!this.name)
            delete this.name;
        return Dummy_1.connect();
    }
    afterUpdate(updateResponse) {
        this.updated = this.lastUpdated === "today";
        // this.addMandatoryField("name");
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
        return new this(name);
    }
};
Dummy.RECORDS = [];
__decorate([
    index_1.Primary(),
    __metadata("design:type", Object)
], Dummy.prototype, "id", void 0);
__decorate([
    index_1.Ignore(),
    __metadata("design:type", Boolean)
], Dummy.prototype, "saved", void 0);
__decorate([
    index_1.Ignore(),
    __metadata("design:type", Boolean)
], Dummy.prototype, "updated", void 0);
__decorate([
    index_1.Ignore(),
    __metadata("design:type", Boolean)
], Dummy.prototype, "isUpdate", void 0);
Dummy = Dummy_1 = __decorate([
    index_1.ModelName("dummy"),
    index_1.ConnectionName("TESTING"),
    __metadata("design:paramtypes", [String])
], Dummy);
exports.Dummy = Dummy;
