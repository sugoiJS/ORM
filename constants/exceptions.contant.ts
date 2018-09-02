import {IExceptionConstant} from "@sugoi/core";

export const EXCEPTIONS: { [prop: string]: IExceptionConstant } = {
    INVALID: {code: 4000, message: "INVALID"},
    NOT_IMPLEMENTED: {message:"Implementation is missing",code:5000},
    CONFIGURATION_MISSING: {message:"Connection configuration is missing",code:5001},
    NOT_EXTEND_MODEL: {message:"Class not extend ModelAbstract",code:5002}
}