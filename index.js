const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .option('-i, --input <path>', 'Path to input file')
  .option('-o, --output <path>', 'Path to output file')
  .option('-d, --display', 'Display result in console');

program.parse(process.argv);

const options = program.opts();
const inputPath = options.input;
const outputPath = options.output;
const display = options.display;

if (!inputPath) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error('Cannot find input file');
  process.exit(1);
}

fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input file:', err.message);
    process.exit(1);
  }

  try {
    const parsedData = JSON.parse(data);
    const result = JSON.stringify(parsedData, null, 2);

    if (!outputPath && !display) {
      process.exit(0);
    }

    if (outputPath) {
      fs.writeFileSync(outputPath, result, 'utf8');
    }

    if (display) {
      console.log(result);
    }
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError.message);
    process.exit(1);
  }
});

