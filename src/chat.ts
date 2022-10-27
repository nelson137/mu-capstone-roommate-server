import { Server as HttpServer } from 'http';
import { Server, Socket as SockioSocket } from 'socket.io';

interface ServerToClientEvents {
    recv: (fromUserId: string, msg: string, datetime: number) => void;
}

interface ClientToServerEvents {
    activate: (userId: string) => void;
    send: (fromUserId: string, toUserId: string, msg: string, datetime: number) => void;
}

interface InterServerEvents {}

interface SocketData {
    userId: string;
}

type Socket = SockioSocket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

let io: Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>;

const userIdToSocket: { [userId: string]: Socket } = {};

type PendingMsg = { fromUserId: string; msg: string; datetime: number };
const pendingMessages: { [toUserId: string]: PendingMsg[] } = {};

export const setupChat = (server: HttpServer) => {
    io = new Server(server);

    io.on('connection', (socket: Socket) => {
        console.log(`[connect] ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`[disconnect] ${socket.id} ${socket.data.userId}`);
            const userId = socket.data.userId;
            if (userId) delete userIdToSocket[userId];
        });

        socket.on('activate', userId => {
            console.log(`[activate] ${socket.id} ${userId}`);

            socket.data.userId = userId;
            userIdToSocket[userId] = socket;

            // Send pending messages
            const msgs = pendingMessages[userId];
            if (msgs) {
                // TODO: send these all as 1 message "recvPending"
                while (msgs.length > 0) {
                    const { fromUserId, msg, datetime } = msgs.pop()!;
                    console.log(`           [recv pending] FROM ${fromUserId}`);
                    console.log(`                          msg=${msg}`);
                    socket.emit('recv', fromUserId, msg, datetime);
                }
            }
            delete pendingMessages[userId];
        });

        socket.on('send', (fromUserId, toUserId, msg, datetime) => {
            // Ignore `send` events from not active users
            if (!socket.data.userId) return;

            console.log(`[send] FROM ${fromUserId} => TO ${toUserId}`);
            console.log(`       msg=${msg}`);

            const toSocket = userIdToSocket[toUserId];
            if (toSocket) {
                // Send message to active user
                toSocket.emit('recv', fromUserId, msg, datetime);
                console.log(`       SENT`);
            } else {
                // Save message for later when user becomes active
                const pendingMsg: PendingMsg = { fromUserId, msg, datetime };
                const msgsForUser = pendingMessages[toUserId];
                if (msgsForUser) {
                    msgsForUser.push(pendingMsg);
                } else {
                    pendingMessages[toUserId] = [pendingMsg];
                }
                console.log(`       PENDING`);
            }
        });
    });
};
