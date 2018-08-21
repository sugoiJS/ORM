import {IExceptionConstant} from "@sugoi/core";

export const EXCEPTIONS: { [prop: string]: IExceptionConstant } = {
    NOT_IMPLEMENTED: {message:"Implementation is missing",code:5000},
    CONFIGURATION_MISSING : {message:"Connection configuration is missing",code:5001}
}