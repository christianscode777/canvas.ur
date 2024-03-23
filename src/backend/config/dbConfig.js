import { createConnection } from 'mysql2';

// Use environment variables or a configuration file to store your credentials
const connection = createConnection({
  host: 'localhost',
  user: 'yourUsername',
  password: 'yourPassword',
  database: 'yourDatabase'
});

export default connection;
