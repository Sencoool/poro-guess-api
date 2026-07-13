import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import * as dotenv from 'dotenv';
import pLimit from 'p-limit';

// Load environment variables
dotenv.config();

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('Missing required R2 environment variables.');
  process.exit(1);
}

// Initialize S3 Client pointing to Cloudflare R2
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for Cloudflare R2 to avoid SSL handshake failures
});

const VERSION = '14.13.1'; // Ensure this matches your desired patch

interface AssetTask {
  url: string;
  key: string;
  type: 'icon' | 'splash';
}

async function fetchChampionList(): Promise<string[]> {
  console.log(`Fetching champion list for version ${VERSION}...`);
  const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/champion.json`);
  const champions = response.data.data;
  return Object.keys(champions);
}

async function fetchChampionDetails(championId: string): Promise<any> {
  const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/champion/${championId}.json`);
  return response.data.data[championId];
}

async function uploadBufferToR2(buffer: Buffer, key: string, contentType: string) {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );
  } catch (error) {
    console.error(`❌ Failed to upload ${key} to R2:`, error.message);
    throw error;
  }
}

async function downloadAndUpload(task: AssetTask) {
  try {
    // console.log(`Downloading ${task.url}...`);
    const response = await axios.get(task.url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const contentType = task.type === 'icon' ? 'image/png' : 'image/jpeg';
    
    // console.log(`Uploading ${task.key} to R2...`);
    await uploadBufferToR2(buffer, task.key, contentType);
    
    console.log(`✅ Successfully processed ${task.key}`);
  } catch (error) {
    console.error(`❌ Error processing ${task.key}:`, error.message);
  }
}

async function main() {
  console.log('--- Started R2 Asset Upload Script ---');
  
  const championIds = await fetchChampionList();
  console.log(`Found ${championIds.length} champions.`);

  const tasks: AssetTask[] = [];

  for (const [index, champId] of championIds.entries()) {
    console.log(`[${index + 1}/${championIds.length}] Fetching details for ${champId}...`);
    const details = await fetchChampionDetails(champId);
    
    // Add Icon Task
    tasks.push({
      url: `http://ddragon.leagueoflegends.com/cdn/${VERSION}/img/champion/${champId}.png`,
      key: `icons/${champId}.png`,
      type: 'icon',
    });

    // Add Splash Art Tasks
    if (details.skins && details.skins.length > 0) {
      for (const skin of details.skins) {
        tasks.push({
          url: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_${skin.num}.jpg`,
          key: `splash/${champId}_${skin.num}.jpg`,
          type: 'splash',
        });
      }
    }
  }

  console.log(`\nGenerated ${tasks.length} total download/upload tasks.`);
  console.log(`Starting processing with concurrency limit...`);

  // Limit concurrency to avoid rate limits or memory exhaustion
  const limit = pLimit(15); 
  
  const promises = tasks.map((task) => limit(() => downloadAndUpload(task)));
  
  await Promise.all(promises);

  console.log('\n--- 🎉 All assets processed successfully! ---');
}

main().catch(console.error);
