import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

async function fetchChampionDetails(championId: string, version: string): Promise<any> {
  const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${championId}.json`);
  return response.data.data[championId];
}

async function main() {
  const versionsResponse = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
  const VERSION = versionsResponse.data[0];
  console.log(`Using latest Data Dragon version: ${VERSION}`);

  const dataPath = path.join(__dirname, '../prisma/champions-data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const champions = JSON.parse(rawData);

  console.log(`Updating paths for ${champions.length} champions...`);

  for (let i = 0; i < champions.length; i++) {
    const champ = champions[i];
    
    // Extract Riot's internal ID from the existing URL
    const championId = champ.iconPath.split('/').pop().replace('.png', '');
    
    console.log(`[${i + 1}/${champions.length}] Processing ${champ.name} (ID: ${championId})...`);
    
    // Set R2 Icon Path using the internal ID to match the uploaded files
    champ.iconPath = `icons/${championId}.png`;

    // Fetch detailed data to get all skins using the internal ID
    const details = await fetchChampionDetails(championId, VERSION);
    
    const splashPaths: string[] = [];
    if (details.skins && details.skins.length > 0) {
      for (const skin of details.skins) {
        splashPaths.push(`splash/${championId}_${skin.num}.jpg`);
      }
    }
    
    champ.splashPath = splashPaths;
  }

  // Write updated data back to file
  fs.writeFileSync(dataPath, JSON.stringify(champions, null, 2));
  console.log('✅ Successfully updated prisma/champions-data.json with R2 paths and all skins!');
}

main().catch(console.error);
