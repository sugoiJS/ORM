import {ISortItem} from "../interfaces/sort-item.interface";
import {SortOptions} from "../constants/sort-options.enum";

export class SortItem implements ISortItem{
    constructor(public sortOption: SortOptions,public field: string){}

}