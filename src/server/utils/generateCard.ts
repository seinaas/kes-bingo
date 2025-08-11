import { type BingoCard, type Column } from "~/types";

const cellBank: string[] = [];
for (let i = 0; i < 50; i++) {
  cellBank.push(`Temp #${i}`);
}

const randomNoRepeats = (array: string[]) => {
  let copy = array.slice(0);
  return function () {
    if (copy.length < 1) {
      copy = array.slice(0);
    }
    const index = Math.floor(Math.random() * copy.length);
    const item = copy[index];
    copy.splice(index, 1);
    return item;
  };
};

export const generateCard = (): BingoCard => {
  const chooser = randomNoRepeats(cellBank);
  const card: BingoCard = [] as unknown as BingoCard;

  for (let i = 0; i < 5; i++) {
    const column: Column = [] as unknown as Column;
    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2) {
        column.push({
          text: "FREE",
          checked: true,
        });
      } else {
        column.push({
          text: chooser()!,
          checked: false,
        });
      }
    }

    card.push(column);
  }

  return card;
};
