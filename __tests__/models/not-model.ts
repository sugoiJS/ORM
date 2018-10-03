import {ConnectionName,ModelName} from "../../index";

export class NotModel {
}

try {
    ModelName("test")(NotModel);
    ConnectionName("test")(NotModel)
}
catch (err){
}
