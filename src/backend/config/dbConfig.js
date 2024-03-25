import { createConnection } from 'mysql2';

// Use environment variables or a configuration file to store your credentials
const connection = createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'chatur'
});

export default connection;
