import { ChampionEntity } from '../../champion/entities/champion.entity';
import { MatchStatus, ChampionAttributeComparison } from '../types';

export function compareChampions(
  guess: ChampionEntity,
  target: ChampionEntity,
): ChampionAttributeComparison {
  return {
    gender: guess.gender === target.gender ? MatchStatus.MATCH : MatchStatus.WRONG,
    role: guess.role === target.role ? MatchStatus.MATCH : MatchStatus.WRONG,
    damageType: guess.damageType === target.damageType ? MatchStatus.MATCH : MatchStatus.WRONG,
    resource: guess.resource === target.resource ? MatchStatus.MATCH : MatchStatus.WRONG,
    rangeType: guess.rangeType === target.rangeType ? MatchStatus.MATCH : MatchStatus.WRONG,
    yearRelease: compareYear(guess.yearRelease, target.yearRelease),
  };
}

function compareYear(guessYear: number, targetYear: number): MatchStatus {
  if (guessYear === targetYear) {
    return MatchStatus.MATCH;
  }
  return targetYear > guessYear ? MatchStatus.HIGHER : MatchStatus.LOWER;
}
