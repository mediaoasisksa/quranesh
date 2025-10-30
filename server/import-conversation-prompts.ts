import { readFileSync } from 'fs';
import { storage } from './storage';

async function importConversationPrompts() {
  try {
    const fileContent = readFileSync('attached_assets/Pasted---1761804135607_1761804135607.txt', 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    console.log(`Found ${lines.length} lines in file`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine === '') {
        skipped++;
        continue;
      }
      
      const match = trimmedLine.match(/^(.+?)«(.+?)»(.*)$/);
      
      if (match) {
        const question = match[1].trim();
        const suggestedVerse = match[2].trim();
        
        if (question && suggestedVerse) {
          await storage.createConversationPrompt({
            question,
            suggestedVerse,
            category: null,
          });
          
          imported++;
          console.log(`✓ Imported: ${question} → ${suggestedVerse}`);
        } else {
          console.log(`✗ Skipped (missing data): ${trimmedLine}`);
          skipped++;
        }
      } else {
        console.log(`✗ Skipped (invalid format): ${trimmedLine}`);
        skipped++;
      }
    }
    
    console.log(`\n✅ Import complete:`);
    console.log(`   - Imported: ${imported} prompts`);
    console.log(`   - Skipped: ${skipped} lines`);
    
  } catch (error) {
    console.error('Error importing conversation prompts:', error);
    process.exit(1);
  }
}

importConversationPrompts()
  .then(() => {
    console.log('\n✅ All conversation prompts imported successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to import conversation prompts:', error);
    process.exit(1);
  });
