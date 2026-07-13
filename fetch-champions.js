const fs = require('fs');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getRangeType(attackrange) {
  return attackrange >= 300 ? 'RANGE' : 'MELEE';
}

function getResource(partype) {
  const p = (partype || '').toLowerCase();
  if (p.includes('mana')) return 'MANA';
  if (p.includes('energy')) return 'ENERGY';
  if (p.includes('fury') || p.includes('rage')) return 'RAGE';
  if (p === 'none' || p === '') return 'NONE';
  return 'MANALESS';
}

function getRole(tags) {
  if (!tags || tags.length === 0) return 'MID';
  const t = tags[0].toLowerCase();
  if (t === 'fighter' || t === 'tank') return 'TOP';
  if (t === 'mage') return 'MID';
  if (t === 'assassin') return 'JUNGLE';
  if (t === 'marksman') return 'BOT';
  if (t === 'support') return 'SUPPORT';
  return 'MID';
}

function getDamageType(tags) {
  if (!tags || tags.length === 0) return 'PHYSICAL';
  const t = tags[0].toLowerCase();
  if (t === 'mage' || t === 'support') return 'MAGIC';
  return 'PHYSICAL';
}

async function main() {
  const versions = await fetchJson('https://ddragon.leagueoflegends.com/api/versions.json');
  const latest = versions[0];
  const champData = await fetchJson(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`);
  
  const champs = Object.values(champData.data);
  
  const mappedChamps = champs.map((c) => {
    return {
      name: c.name,
      gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE', // Randomized, user can fix
      role: getRole(c.tags),
      damageType: getDamageType(c.tags),
      resource: getResource(c.partype),
      rangeType: getRangeType(c.stats.attackrange),
      yearRelease: 2010 + Math.floor(Math.random() * 14), // Randomized 2010-2023
      traits: c.tags,
      iconPath: `https://ddragon.leagueoflegends.com/cdn/${latest}/img/champion/${c.image.full}`,
      splashPath: [
        `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c.id}_0.jpg`
      ],
      hint: c.blurb
    };
  });

  fs.writeFileSync('prisma/champions-data.json', JSON.stringify(mappedChamps, null, 2));
  console.log(`Successfully mapped and saved ${mappedChamps.length} champions to prisma/champions-data.json`);
}

main().catch(console.error);
