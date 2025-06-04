import scenariosPt from '@/data/scenarios-pt.json';
import scenariosEn from '@/data/scenarios-en.json';

type Scenario = {
  id: number;
  title: string;
  description: string;
  options: { id: number; text: string; isCorrect: boolean }[];
};

export function getScenarios(locale: 'pt' | 'en'): Scenario[] {
  return locale === 'pt' ? scenariosPt : scenariosEn;
}