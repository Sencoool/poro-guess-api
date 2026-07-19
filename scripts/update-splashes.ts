import * as fs from 'fs';
import * as path from 'path';

async function updateSplashes() {
  console.log('Fetching splash images from GitHub...');
  
  // Use a recursive tree fetch instead of contents API because contents API has a limit of 1000 files, and LoL has > 1000 skins!
  // Wait, let's check how many files. Aatrox alone has like 10, total champs 160 = 1600+ skins.
  // The Contents API maxes at 1000 items. We should use the Git Trees API!
  // repo: noxelisdev/LoL_DDragon, tree sha for img/champion/splash is needed.
  // Actually, we can just fetch the whole master tree recursively:
  const treeUrl = 'https://api.github.com/repos/noxelisdev/LoL_DDragon/git/trees/master?recursive=1';
  
  const response = await fetch(treeUrl, {
    headers: { 'User-Agent': 'NodeJS' }
  });
  const data = await response.json();
  
  const splashFiles = new Set<string>();
  let count = 0;
  
  if (data && data.tree) {
    for (const item of data.tree) {
      if (item.path.startsWith('img/champion/splash/') && item.path.endsWith('.jpg')) {
        const filename = item.path.split('/').pop();
        splashFiles.add(`splash/${filename}`);
        count++;
      }
    }
  }
  
  console.log(`Found ${count} splash images on GitHub.`);
  
  const dataPath = path.join(__dirname, '../prisma/champions-data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const champions = JSON.parse(rawData);
  
  let totalRemoved = 0;
  
  for (const champ of champions) {
    if (champ.splashPath) {
      const originalLength = champ.splashPath.length;
      champ.splashPath = champ.splashPath.filter((p: string) => splashFiles.has(p));
      const newLength = champ.splashPath.length;
      totalRemoved += (originalLength - newLength);
    }
  }
  
  console.log(`Removed ${totalRemoved} invalid splash paths.`);
  
  fs.writeFileSync(dataPath, JSON.stringify(champions, null, 2));
  console.log('champions-data.json updated successfully!');
}

updateSplashes().catch(console.error);
