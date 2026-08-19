import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const getSignalRConnection = async (accessToken: string): Promise<signalR.HubConnection> => {
    if (!connection) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.NEXT_PUBLIC_API_URL! + `/signalr-hubs/messaging`, {
                logger: signalR.LogLevel.Information,
                withCredentials: false,
                accessTokenFactory: () => encodeURIComponent(accessToken)
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();
  
        try {
            await connection.start();
            console.log("✅ SignalR Connected");
        } catch (error) {
            console.error("❌ SignalR Connection Error:", error);
        }
    }
    return connection;
};