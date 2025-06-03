import enScenarios from '@/data/scenarios-en.json';
import ptScenarios from '@/data/scenarios-pt.json';
import { Scenario } from './types';

export function getScenarios(locale: 'pt' | 'en'): Scenario[] {
  return locale === 'pt' ? ptScenarios.levels : enScenarios.levels;
}