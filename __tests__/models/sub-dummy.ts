import {
    ModelName, Required, ConnectionName
} from "../../index";
import {Dummy} from "./dummy";
import {ComparableSchema, SchemaTypes} from "@sugoi/core";


@ModelName("dummy_sub")
@ConnectionName("TESTING")
export class SubDummy extends Dummy {
    public static RECORDS = [];

    @Required()
    public simpleMandatoryField: number;

    public setSimpleMandatoryField(value) {
        this.simpleMandatoryField = value;
        return this;
    }

    @Required(false)
    public stringMandatoryField: string;

    public setStringMandatoryField(value) {
        this.stringMandatoryField = value;
        return this;
    }

    @Required(ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(true))
    public stringMandatoryField_2: string | number = 1;

    public setStringMandatoryField_2(value) {
        this.stringMandatoryField_2 = value;
        return this;
    }

    @Required({
        data: ComparableSchema.ofType(
            {
                id: ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(true),
                payload: ComparableSchema.ofType(SchemaTypes.NUMBER).setMin(3).setMandatory(true)
            }
        ).setMandatory(true)
    })
    public complexMandatoryField: string;

    public test:string;

    public setComplexMandatoryField(value) {
        this.complexMandatoryField = value;
        return this;
    }

}