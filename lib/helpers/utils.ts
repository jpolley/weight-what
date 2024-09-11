export const WeightBars = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function splitArray(array: number[], partitions: number = 3): number[][] {
  const partitionSize = Math.floor(array.length / partitions);
  let arrays: number[][] = [];

  for (let i = 0; i <= array.length; i += partitionSize) {
    arrays.push(array.slice(i, i + partitionSize));
  }

  return arrays;
}

export function parseResultFromString(input: string): { leftArray: number[]; operator: string; rightArray: number[] } {
  const match = input.match(/\[(.*?)\] (>|<|=) \[(.*?)\]/);
  const operator = match[2];
  const leftArray = match[1].split(",").map(Number);
  const rightArray = match[3].split(",").map(Number);

  return { leftArray, operator, rightArray };
}

export function printSummary(bar: number, results: string[]) {
  console.log(`The fake bar is: ${bar}`);
  console.log("\nWeighing steps:");

  results.forEach((result, i) => {
    console.log(`${i + 1}. ${result}`);
  });
}
