require('dotenv').config();  // Load environment variables from .env file
const crypto = require('crypto');

// Ensure that the SECRET environment variable is loaded
if (!process.env.SEC) {
  console.error('SECRET environment variable is not set');
  process.exit(1);  // Exit the program if SECRET is not set
}

const secretKey = crypto.scryptSync('criptoSecret', 'salt', 32); // Generate a 256-bit key from a password (32 bytes)

// Function to encrypt userID
const encryptUserID = (userID, secretKey) => {
  const iv = crypto.randomBytes(16); // Generate a random initialization vector (IV)
  const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv); // Create a cipher instance with AES-256-CTR
  let encrypted = cipher.update(userID, 'utf8', 'hex'); // Encrypt the userID
  encrypted += cipher.final('hex'); // Finalize the encryption
  return { encryptedData: encrypted, iv: iv.toString('hex') }; // Return the encrypted data and IV (as hex)
};

// Function to decrypt userID
const decryptUserID = (encryptedData, secretKey, ivHex) => {
  const iv = Buffer.from(ivHex, 'hex'); // Convert the IV from hex back to a Buffer
  const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, iv); // Create a decipher instance
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8'); // Decrypt the encrypted data
  decrypted += decipher.final('utf8'); // Finalize the decryption
  return decrypted; // Return the decrypted userID
};

// Example usage

// Encrypt the userID
const { encryptedData, iv } = encryptUserID('12345', secretKey);
console.log('Encrypted UserID:', encryptedData);
console.log('Initialization Vector (IV):', iv);

// Decrypt the userID
const decryptedUserID = decryptUserID(encryptedData, secretKey, iv);
console.log('Decrypted UserID:', decryptedUserID);


module.exports = {
    encryptUserID,
    decryptUserID
  };