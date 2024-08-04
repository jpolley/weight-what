export function evalutateResult(input: string): number[][] {
  // Extract arrays and comparison operator
  const match = input.match(/\[(.*?)\] (>|<) \[(.*?)\]/);
  const leftArrayStr = match[1];
  const operator = match[2];
  const rightArrayStr = match[3];

  // Convert string array to arrays of numbers
  const leftArray = leftArrayStr.split(",").map(Number);
  const rightArray = rightArrayStr.split(",").map(Number);

  let lesserArray: number[];

  if (operator === "<") {
    lesserArray = leftArray;
  } else {
    lesserArray = rightArray;
  }

  // Split the lesser array into two sub-arrays to make it easier to weigh
  const midIndex = Math.ceil(lesserArray.length / 2);
  const firstHalf = lesserArray.slice(0, midIndex);
  const secondHalf = lesserArray.slice(midIndex);

  return [firstHalf, secondHalf];
}