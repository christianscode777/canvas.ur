import { createConnection } from 'mysql2';
import dbConfig from '../config/dbConfig'; 

const connection = createConnection(dbConfig);

export async function sendMessage(senderId, recipientId, messageText, image) {
    await connection.promise().query(
        'INSERT INTO messages (sender_id, recipient_id, message_text, image) VALUES (?, ?, ?, ?)',
        [senderId, recipientId, messageText, image]
    );
} 

export async function getMessagesBetweenUsers(user1Id, user2Id) {
    const [rows] = await connection.promise().query(
        // Your message history query from earlier
    );
    return rows;
}