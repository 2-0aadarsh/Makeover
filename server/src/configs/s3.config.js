import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

let s3Client = null;

/**
 * Initialize and return S3 Client
 * Creates a singleton instance of S3Client
 * @returns {S3Client} - Configured S3 client instance
 */
const connectS3 = () => {
  try {
    // Check if client already exists (singleton pattern)
    if (s3Client) {
      return s3Client;
    }

    // Validate required environment variables
    const requiredVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET_NAME'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required S3 environment variables: ${missingVars.join(', ')}`);
    }

    // Initialize S3 Client
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    console.log('✅ Successfully connected to AWS S3');
    console.log(`   Region: ${process.env.AWS_REGION}`);
    console.log(`   Bucket: ${process.env.AWS_S3_BUCKET_NAME}`);
    
    return s3Client;
  } catch (error) {
    console.error('❌ Error connecting to AWS S3:', error.message);
    throw error;
  }
};

/**
 * Get the S3 client instance
 * @returns {S3Client} - S3 client instance
 */
const getS3Client = () => {
  if (!s3Client) {
    return connectS3();
  }
  return s3Client;
};

/**
 * Get S3 bucket name from environment
 * @returns {String} - Bucket name
 */
const getBucketName = () => {
  return process.env.AWS_S3_BUCKET_NAME;
};

export default connectS3;
export { getS3Client, getBucketName };
