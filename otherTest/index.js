// 1

function reverseAlphabetOnly(str) {
  const letters = str.replace(/[0-9]/g, '');
  const numbers = str.replace(/[A-Za-z]/g, '');

  const reversedLetters = letters.split('').reverse().join('');
  return reversedLetters + numbers;
}

const input = 'NEGIE1';
console.log(reverseAlphabetOnly(input));

// 2

function findLongestWord(sentence) {
  const words = sentence.split(' ');

  let longestWord = '';

  for (let word of words) {
    if (word.length > longestWord.length) {
      longestWord = word;
    }
  }

  return `${longestWord}: ${longestWord.length} character`;
}

const sentence = 'Saya sangat senang mengerjakan soal algoritma';
console.log(findLongestWord(sentence));

// 3

function countWordInput(input, array) {
  const output = [];

  for (let item of array) {
    const count = input.filter((word) => word === item).length;

    output.push(count);
  }

  return output;
}

const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];

console.log(countWordInput(INPUT, QUERY));

// 4

function diagonalSubstract(matrix) {
  const n = matrix.length;
  let diagonal1 = 0;
  let diagonal2 = 0;

  for (let i = 0; i < n; i++) {
    diagonal1 += matrix[i][i];
    diagonal2 += matrix[i][n - 1 - i];
  }

  return Math.abs(diagonal1 - diagonal2);
}

const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(diagonalSubstract(matrix));
