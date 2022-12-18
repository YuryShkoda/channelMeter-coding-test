export const getRandomFromArray = <Item>(arr: Item[]): Item =>
  arr[Math.floor(Math.random() * arr.length)]
