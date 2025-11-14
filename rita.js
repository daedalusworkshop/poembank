#!/usr/bin/env node

const RiTa = require('rita').RiTa;
const inquirer = require('inquirer');
const chalk = require('chalk');

// Beautiful banner
function showBanner() {
  console.log(chalk.cyan.bold('\n╔═══════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║') + chalk.white.bold('           🌸  R I T A  P O E M  C H A L L E N G E  🌸          ') + chalk.cyan.bold('║'));
  console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════════╝\n'));
  console.log(chalk.gray('  A creative constraint tool for poetic expression\n'));
}

// Generate a single word bank with exactly 15 words based on emotion
function generateWordBank(emotionText) {
  const words = RiTa.tokenize(emotionText);
  const poses = RiTa.pos(emotionText);
  
  // Extract unique parts of speech from the emotion description
  const uniquePOS = [...new Set(poses.filter(pos => 
    pos && pos.length > 0 && !['.', ',', '!', '?', ':', ';', '...'].includes(pos)
  ))];
  
  const wordBank = new Set();
  
  // Strategy: Mix words based on POS from emotion + texture words
  // Try to get a diverse mix
  const posTypes = ['nn', 'jj', 'vb', 'rb', 'prp', 'dt'];
  
  // Add words based on emotion's POS
  uniquePOS.forEach(pos => {
    if (wordBank.size < 15) {
      try {
        const word = RiTa.randomWord({ pos });
        if (word && word.length > 0) {
          wordBank.add(word.toLowerCase());
        }
      } catch (e) {
        // Skip if word generation fails
      }
    }
  });
  
  // Fill to exactly 15 words with diverse parts of speech
  while (wordBank.size < 15) {
    try {
      const randomPos = posTypes[Math.floor(Math.random() * posTypes.length)];
      const word = RiTa.randomWord({
        pos: randomPos,
        syllables: Math.floor(Math.random() * 3) + 1 // 1-3 syllables
      });
      if (word && word.length > 0) {
        wordBank.add(word.toLowerCase());
      }
    } catch (e) {
      // If specific POS fails, try any random word
      try {
        const word = RiTa.randomWord({
          syllables: Math.floor(Math.random() * 3) + 1
        });
        if (word && word.length > 0) {
          wordBank.add(word.toLowerCase());
        }
      } catch (e2) {
        // If all else fails, break
        break;
      }
    }
  }
  
  // Trim to exactly 15 if we somehow got more
  const bankArray = Array.from(wordBank).sort();
  return bankArray.slice(0, 15);
}

// Generate 3 different word bank options
function generateThreeWordBanks(emotionText) {
  const banks = [];
  for (let i = 0; i < 3; i++) {
    banks.push(generateWordBank(emotionText));
  }
  return banks;
}

// Validate poem uses only words from the bank
function validatePoem(poem, wordBank) {
  const poemWords = RiTa.tokenize(poem.toLowerCase());
  const bankSet = new Set(wordBank.map(w => w.toLowerCase()));
  const invalidWords = [];
  
  poemWords.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    if (cleanWord.length > 0 && !bankSet.has(cleanWord)) {
      invalidWords.push(word);
    }
  });
  
  return {
    valid: invalidWords.length === 0,
    invalidWords: [...new Set(invalidWords)]
  };
}

// Main flow
async function main() {
  showBanner();
  
  try {
    // Step 1: Collect emotion description
    const { emotion } = await inquirer.prompt([
      {
        type: 'input',
        name: 'emotion',
        message: chalk.yellow('✨ Describe an emotion that\'s been feeling alive for you lately:'),
        validate: (input) => {
          if (!input || input.trim().length < 3) {
            return 'Please describe your emotion (at least 3 characters)';
          }
          return true;
        }
      }
    ]);
    
    console.log(chalk.gray('\n  Rita is weaving three word bank options...\n'));
    
    // Step 2: Generate 3 word bank options
    const wordBanks = generateThreeWordBanks(emotion);
    
    // Display all three options
    console.log(chalk.cyan.bold('╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║') + chalk.white.bold('              CHOOSE YOUR WORD BANK (15 WORDS)            ') + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════════╝\n'));
    
    // Display each option
    const wordsPerLine = 5;
    wordBanks.forEach((bank, index) => {
      console.log(chalk.yellow.bold(`\n  Option ${index + 1}:\n`));
      for (let i = 0; i < bank.length; i += wordsPerLine) {
        const line = bank.slice(i, i + wordsPerLine)
          .map(word => chalk.green.bold(word.padEnd(15)))
          .join('  ');
        console.log(chalk.white('  ' + line));
      }
      console.log();
    });
    
    // Step 2.5: Let user choose which bank to use
    const { selectedBank } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedBank',
        message: chalk.yellow('✨ Which word bank would you like to use?'),
        choices: [
          { name: 'Option 1', value: 0 },
          { name: 'Option 2', value: 1 },
          { name: 'Option 3', value: 2 }
        ]
      }
    ]);
    
    const wordBank = wordBanks[selectedBank];
    
    // Clear screen and show only selected bank
    console.clear();
    showBanner();
    console.log(chalk.cyan.bold('╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║') + chalk.white.bold('                    YOUR WORD BANK                    ') + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════════╝\n'));
    
    // Display selected words
    for (let i = 0; i < wordBank.length; i += wordsPerLine) {
      const line = wordBank.slice(i, i + wordsPerLine)
        .map(word => chalk.green.bold(word.padEnd(15)))
        .join('  ');
      console.log(chalk.white('  ' + line));
    }
    
    console.log(chalk.gray(`\n  You have ${chalk.white.bold(wordBank.length)} words to work with.\n`));
    console.log(chalk.yellow('  💡 Tip: Use only these words to write your poem!\n'));
    
    // Step 3: Collect poem
    let poemValid = false;
    let poem = '';
    
    while (!poemValid) {
      const { poemInput } = await inquirer.prompt([
        {
          type: 'input',
          name: 'poemInput',
          message: chalk.yellow('✍️  Write your poem using only the words above:'),
          validate: (input) => {
            if (!input || input.trim().length < 5) {
              return 'Please write a poem (at least 5 characters)';
            }
            return true;
          }
        }
      ]);
      
      poem = poemInput;
      const validation = validatePoem(poem, wordBank);
      
      if (validation.valid) {
        poemValid = true;
      } else {
        console.log(chalk.red.bold('\n  ⚠️  Invalid words detected:'));
        console.log(chalk.red('  ' + validation.invalidWords.join(', ')));
        console.log(chalk.yellow('\n  Please use only words from your word bank.\n'));
        
        const { retry } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'retry',
            message: 'Would you like to try again?',
            default: true
          }
        ]);
        
        if (!retry) {
          console.log(chalk.gray('\n  Exiting...\n'));
          process.exit(0);
        }
      }
    }
    
    // Step 4: Display final poem
    console.log(chalk.cyan.bold('\n╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║') + chalk.white.bold('                      YOUR POEM                      ') + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════════╝\n'));
    console.log(chalk.white(poem.split('\n').map(line => '  ' + line).join('\n')));
    console.log(chalk.cyan.bold('\n╚═══════════════════════════════════════════════════════╝\n'));
    console.log(chalk.gray('  ✨ Beautiful! Your poem has been created within the constraints.\n'));
    
    // Ask if they want to create another
    const { another } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'another',
        message: chalk.yellow('Would you like to create another poem?'),
        default: false
      }
    ]);
    
    if (another) {
      console.log('\n');
      main();
    } else {
      console.log(chalk.gray('\n  Thank you for creating with Rita! 🌸\n'));
      process.exit(0);
    }
    
  } catch (error) {
    if (error.isTtyError) {
      console.error(chalk.red('  Error: Prompt couldn\'t be rendered in the current environment'));
    } else {
      console.error(chalk.red('  Error:'), error.message);
    }
    process.exit(1);
  }
}

// Run the program
main();

