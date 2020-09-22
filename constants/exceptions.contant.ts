import {IExceptionConstant} from "@sugoi/core";

export const EXCEPTIONS: { [prop: string]: IExceptionConstant } = {
    INVALID: {code: 4000, message: "INVALID"},
    NOT_IMPLEMENTED: {message:"Implementation is missing",code:5000},
    CONFIGURATION_MISSING: {message:"Connection configuration is missing",code:5001},
    NOT_EXTEND_MODEL: {message:"Class not extend ModelAbstract",code:5002},
    NOT_EXTEND_CONNECTABLE_MODEL: {message:"Class not extend ConnectableModel",code:5003},
    PRIMARY_NOT_CONFIGURED: {message:"Primary key not configured for class, please use @Primary",code:5006},
    CONNECTABLE_CONNECTION_NOT_CONFIGURED: {message:"connectionClass not set",code:5007}
}