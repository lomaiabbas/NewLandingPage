import { createContext, useEffect, useState, ReactNode } from "react";
import * as signalR from "@microsoft/signalr";

interface SignalRContextProps {
  connection: signalR.HubConnection | null;
}

export const SignalRContext = createContext<SignalRContextProps>({ connection: null });

interface SignalRProviderProps {
    children: ReactNode;
    accessToken: string;
}



export const SignalRProvider: React.FC<SignalRProviderProps> = ({ children, accessToken }: any) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const getSignalRConnection = async (accessToken: string): Promise<signalR.HubConnection> => {
        let temp: any = undefined;
        if (!connection) {
            temp = new signalR.HubConnectionBuilder()
                .withUrl(process.env.NEXT_PUBLIC_API_URL! + `/signalr-hubs/messaging`, {
                    logger: signalR.LogLevel.Information,
                    withCredentials: false,
                    accessTokenFactory: () => encodeURIComponent(accessToken)
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();
      
            try {
                await temp.start();
                console.log("✅ SignalR Connected");
            } catch (error) {
                console.error("❌ SignalR Connection Error:", error);
            }
        }
        return temp;
    };

    useEffect(() => {        
        const initConnection = async () => {
            const conn: signalR.HubConnection | null = await getSignalRConnection(accessToken!);
            setConnection(conn);
        };

        if (accessToken && (connection === null || connection?.state !== "Connected"))
            initConnection();

    }, [accessToken]);

    useEffect(() => {
        const handleBeforeUnload = async (event: any) => {
            event.preventDefault();
            event.returnValue = "";
            if (connection) await connection.stop();
        };
      
        window.addEventListener("unload", handleBeforeUnload);
      
        return () => {
            window.removeEventListener("unload", handleBeforeUnload);
        };
    }, [connection]);

    return (
        <SignalRContext.Provider value={{ connection }}>
            {children}
        </SignalRContext.Provider>
    );
};
