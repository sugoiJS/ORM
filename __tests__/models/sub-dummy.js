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
const index_1 = require("../../index");
const dummy_1 = require("./dummy");
const core_1 = require("@sugoi/core");
let SubDummy = class SubDummy extends dummy_1.Dummy {
    setSimpleMandatoryField(value) {
        this.simpleMandatoryField = value;
        return this;
    }
    setStringMandatoryField(value) {
        this.stringMandatoryField = value;
        return this;
    }
    setStringMandatoryField_2(value) {
        this.stringMandatoryField_2 = value;
        return this;
    }
    setComplexMandatoryField(value) {
        this.complexMandatoryField = value;
        return this;
    }
};
SubDummy.RECORDS = [];
__decorate([
    index_1.Required(),
    __metadata("design:type", Number)
], SubDummy.prototype, "simpleMandatoryField", void 0);
__decorate([
    index_1.Required(false),
    __metadata("design:type", String)
], SubDummy.prototype, "stringMandatoryField", void 0);
__decorate([
    index_1.Required(true),
    __metadata("design:type", String)
], SubDummy.prototype, "stringMandatoryField_2", void 0);
__decorate([
    index_1.Required({
        data: core_1.ComparableSchema.ofType({
            id: core_1.ComparableSchema.ofType(core_1.SchemaTypes.STRING).setMandatory(true),
            payload: core_1.ComparableSchema.ofType(core_1.SchemaTypes.NUMBER).setMin(3).setMandatory(true)
        }).setMandatory(true)
    }),
    __metadata("design:type", String)
], SubDummy.prototype, "complexMandatoryField", void 0);
SubDummy = __decorate([
    index_1.ModelName("dummy_sub"),
    index_1.ConnectionName("TESTING")
], SubDummy);
exports.SubDummy = SubDummy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViLWR1bW15LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vX190ZXN0c19fL21vZGVscy9zdWItZHVtbXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx1Q0FFcUI7QUFDckIsbUNBQThCO0FBQzlCLHNDQUEwRDtBQUsxRCxJQUFhLFFBQVEsR0FBckIsTUFBYSxRQUFTLFNBQVEsYUFBSztJQU14Qix1QkFBdUIsQ0FBQyxLQUFLO1FBQ2hDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUtNLHVCQUF1QixDQUFDLEtBQUs7UUFDaEMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztRQUNsQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBS00seUJBQXlCLENBQUMsS0FBSztRQUNsQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFjTSx3QkFBd0IsQ0FBQyxLQUFLO1FBQ2pDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDbkMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUVKLENBQUE7QUEzQ2lCLGdCQUFPLEdBQUcsRUFBRSxDQUFDO0FBRzNCO0lBREMsZ0JBQVEsRUFBRTs7c0RBQ3lCO0FBUXBDO0lBREMsZ0JBQVEsQ0FBQyxLQUFLLENBQUM7O3NEQUNvQjtBQVFwQztJQURDLGdCQUFRLENBQUMsSUFBSSxDQUFDOzt3REFDdUI7QUFldEM7SUFSQyxnQkFBUSxDQUFDO1FBQ04sSUFBSSxFQUFFLHVCQUFnQixDQUFDLE1BQU0sQ0FDekI7WUFDSSxFQUFFLEVBQUUsdUJBQWdCLENBQUMsTUFBTSxDQUFDLGtCQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztZQUNsRSxPQUFPLEVBQUUsdUJBQWdCLENBQUMsTUFBTSxDQUFDLGtCQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7U0FDcEYsQ0FDSixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7S0FDdkIsQ0FBQzs7dURBQ21DO0FBbkM1QixRQUFRO0lBRnBCLGlCQUFTLENBQUMsV0FBVyxDQUFDO0lBQ3RCLHNCQUFjLENBQUMsU0FBUyxDQUFDO0dBQ2IsUUFBUSxDQTRDcEI7QUE1Q1ksNEJBQVEifQ==