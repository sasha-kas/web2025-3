const { Command } = require('commander');
const fs = require('fs');

const program = new Command();
program
  .option('-i, --input <path>', 'input file (обовʼязковий параметр)')
  .option('-o, --output <path>', 'output file (необовʼязковий параметр)')
  .option('-d, --display', 'show in console (необовʼязковий параметр)');
program.parse(process.argv);

const options = program.opts();
const inputPath = options.input;
const outputPath = options.output;
const showDisplay = options.display;

if (!inputPath) {
  console.log('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.log('Cannot find input file');
  process.exit(1);
}

try {
  const fileData = fs.readFileSync(inputPath, 'utf8');
  const jsonData = JSON.parse(fileData);

  // Фільтруємо потрібні категорії з масиву
  const targetCategories = ['Доходи, усього', 'Витрати, усього'];
  let result = '';

  jsonData.forEach(item => {
    if (item.txt && targetCategories.includes(item.txt)) {
      result += `${item.txt}:${item.value}\n`;
    }
  });

  // Якщо результат порожній
  if (!result) {
    console.log('Не знайдено потрібних категорій');
    process.exit(1);
  }

  // Записуємо в файл, якщо задано -o
  if (outputPath) {
    fs.writeFileSync(outputPath, result, 'utf8');
  }

  // Виводимо в консоль, якщо задано -d
  if (showDisplay) {
    console.log(result);
  }

} catch (error) {
  console.log('Помилка опрацювання файлу');
  process.exit(1);
}

