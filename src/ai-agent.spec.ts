import { test } from '@playwright/test';
import { generatePlaywrightSteps } from './ai/gemini-helper';
import fs from 'fs/promises';

test('AI-generated Playwright Test', async () => {
  const task = `
    1. Open website https://qa.way2automation.com/
    2. Enter name as Rahul Arora
    3. Phone as 9711111558
    4. Email as trainer@way2automation.com
    5. Select county as Japan
    6. Enter city as Tokyo
    `;

  const code = await generatePlaywrightSteps(task);


  await fs.writeFile('tests\\generate-test.spec.ts', code);
  
});
