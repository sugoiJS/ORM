import {SortOptions} from "../constants/sort-options.enum";

export interface ISortItem {
    sortOption: SortOptions,
    field: string
}