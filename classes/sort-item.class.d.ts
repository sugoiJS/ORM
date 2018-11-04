import { ISortItem } from "../interfaces/sort-item.interface";
import { SortOptions } from "../constants/sort-options.enum";
export declare class SortItem implements ISortItem {
    sortOption: SortOptions;
    field: string;
    constructor(sortOption: SortOptions, field: string);
}
