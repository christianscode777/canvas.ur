import { createConnection } from 'mysql2';
import dbConfig from '../config/dbConfig'; // Import your configuration

const connection = createConnection(dbConfig);

// Example functions
async function getUserById(userId) {
   const [rows] = await connection.promise().query(
       'SELECT username, profile_picture, status, bio FROM users WHERE id = ?',
       [userId]
   );
   return rows[0]; // Return the first matching user
}

async function updateUserProfile(userId, newUsername, newProfilePicture, ...) {
    await connection.promise().query(
        'UPDATE users SET username = ?, profile_picture = ?, ... WHERE id = ?',
        [newUsername, newProfilePicture, ..., userId]
    );
}

// ... Other user-related functions 

export default {
    getUserById,
    updateUserProfile,
    // ... Add more functions here
};
