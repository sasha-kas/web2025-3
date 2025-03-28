const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();
program
  .option('-i, --input <path>', 'input file')
  .option('-o, --output <path>', 'output file')
  .option('-d, --display', 'show in console');
program.parse(process.argv);

const options = program.opts();
const inputPath = options.input;
const outputPath = options.output;
const showDisplay = options.display;

if (!inputPath) {
  console.log('Вкажіть файл для обробки');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.log('Файл не знайдено');
  process.exit(1);
}

try {
  const fileData = fs.readFileSync(inputPath, 'utf8');
  const jsonData = JSON.parse(fileData);
  
  const targetCategories = ['Доходи, усього', 'Витрати, усього'];
  const result = targetCategories
    .filter(category => jsonData[category] && jsonData[category].value !== undefined)
    .map(category => `${category}:${jsonData[category].value}`)
    .join('\n');
  
  if (!result) {
    console.log('Не знайдено потрібних категорій');
    process.exit(1);
  }
  
  if (outputPath) {
    fs.writeFileSync(outputPath, result, 'utf8');
  }
  
  if (showDisplay) {
    console.log(result);
  }
} catch (error) {
  console.log('Помилка опрацювання файлу');
  process.exit(1);
}
