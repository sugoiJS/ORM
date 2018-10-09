"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
class DummyConnection {
    connect() {
        if (this.getConnectionString().trim() === ":") {
            return Promise.resolve(false);
        }
        this.connectionClient = {
            disconnect: () => Promise.resolve(true)
        };
        this.status = index_1.CONNECTION_STATUS.CONNECTED;
        return Promise.resolve(true);
    }
    disconnect() {
        console.log("disconnect");
        return this.connectionClient.disconnect()
            .then(() => {
            this.status = index_1.CONNECTION_STATUS.DISCONNECTED;
            return true;
        });
    }
    isConnected() {
        return Promise.resolve(this.status === index_1.CONNECTION_STATUS.CONNECTED);
    }
    getConnectionString() {
        let connectionString = "";
        if (this.user && this.password)
            connectionString += `${this.user}:${this.password}@`;
        connectionString += `${this.hostName || ""}:${this.port || ""}`;
        if (this.authDB)
            connectionString += `/${this.authDB}`;
        return connectionString;
    }
}
exports.DummyConnection = DummyConnection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXktY29ubmVjdGlvbi5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL19fdGVzdHNfXy9jbGFzc2VzL2R1bW15LWNvbm5lY3Rpb24uY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBMkQ7QUFFM0QsTUFBYSxlQUFlO0lBV3hCLE9BQU87UUFDSCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRTtZQUMzQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakM7UUFDRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUc7WUFDcEIsVUFBVSxFQUFFLEdBQUUsRUFBRSxDQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1NBQ3hDLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxHQUFHLHlCQUFpQixDQUFDLFNBQVMsQ0FBQztRQUMxQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELFVBQVU7UUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTthQUNwQyxJQUFJLENBQUMsR0FBRSxFQUFFO1lBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyx5QkFBaUIsQ0FBQyxZQUFZLENBQUM7WUFDN0MsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsV0FBVztRQUNQLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxtQkFBbUI7UUFDZixJQUFJLGdCQUFnQixHQUFXLEVBQUUsQ0FBQztRQUNsQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVE7WUFDMUIsZ0JBQWdCLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQztRQUN6RCxnQkFBZ0IsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUUsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUUsRUFBRSxFQUFFLENBQUM7UUFDNUQsSUFBSSxJQUFJLENBQUMsTUFBTTtZQUNYLGdCQUFnQixJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFDLE9BQU8sZ0JBQWdCLENBQUM7SUFDNUIsQ0FBQztDQUVKO0FBN0NELDBDQTZDQyJ9