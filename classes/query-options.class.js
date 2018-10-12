"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryOptions {
    static builder() {
        return new QueryOptions();
    }
    constructor() { }
    setLimit(limit) {
        this.limit = limit;
        return this;
    }
    getLimit() {
        return this.limit;
    }
    setOffset(offset) {
        this.offset = offset;
        return this;
    }
    getOffset() {
        return this.offset;
    }
    setSortOptions(...sort) {
        this.sort = sort;
        return this;
    }
    /**
     * @deprecated
     * @use setSortOptions
     * @param {SortItem} sort
     */
    setSortOption(...sort) {
        return this.setSortOptions(...sort);
    }
    getSortOptions() {
        return this.sort || [];
    }
    /**
     * @deprecated
     * @use getSortOptions
     */
    getSortOption() {
        return this.getSortOptions();
    }
}
exports.QueryOptions = QueryOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktb3B0aW9ucy5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsYXNzZXMvcXVlcnktb3B0aW9ucy5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQWEsWUFBWTtJQUtkLE1BQU0sQ0FBQyxPQUFPO1FBQ2pCLE9BQU8sSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsZ0JBQWMsQ0FBQztJQUVmLFFBQVEsQ0FBQyxLQUFZO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBYTtRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUztRQUNMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsY0FBYyxDQUFDLEdBQUcsSUFBb0I7UUFDbEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhLENBQUMsR0FBRyxJQUFvQjtRQUNqQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUV4QyxDQUFDO0lBRUQsY0FBYztRQUNWLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILGFBQWE7UUFDVCxPQUFPLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0NBQ0o7QUF2REQsb0NBdURDIn0=