import { type BingoCard, type Column } from "~/types";

const cellBank: string[] = [
  "Tiny finger claps",
  "Tongue pop",
  "Shooketh",
  "YAAASS",
  "And I OOP",
  "Sneezes",
  "Labubu",
  "Snorts",
  "Hand twirls",
  '"I\'ll get one if you get one"',
  "Face pose",
  "Suggests to buy things",
  '"Girl"',
  "Mentions shisha",
  "Mentions Marvel Rivals",
  "Talks about Karen",
  '"Wack-ass feet"',
  "Wants to do shots",
  "Mentions graphic design",
  "Spills drink",
  "Gossips",
  "Talks about jewelery",
  "Talks about new job",
  "Mentions Fed",
  "Mentions Hercules",
  "Mentions Korea",
  "Mentions anime",
];

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
