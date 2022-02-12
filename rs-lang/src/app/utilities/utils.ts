import { SprintStatistic } from '../interfaces/interfaces';

function isRight(): boolean {
  return Math.random() < 0.5;
}

function getRandomNumber(count: number): number {
  return Math.floor(Math.random() * count);
}

function getSprintStatistic(): SprintStatistic[] {
  const sprintData: string = localStorage.getItem('sprint') ?? '[]';
  const statistics: SprintStatistic[] = JSON.parse(sprintData);
  return statistics;
}

function setSprintStatistic(gameStatistic: SprintStatistic[]): void {
  const statisticJSON: string = JSON.stringify(gameStatistic);
  localStorage.setItem('sprint', statisticJSON);
}

export { isRight, getRandomNumber, getSprintStatistic, setSprintStatistic };
