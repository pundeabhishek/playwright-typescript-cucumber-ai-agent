import {test} from '@playwright/test';
import { generatePlaywrightSteps } from './ai/gemini-helper';
import fs from 'fs';


test('gemini-test', async () => {
  
    const task = `
    1. Open the URL: https://way2automation.com/way2auto_jquery/index.php
    2. Enter the name as "Abhishek Punde" in the name field
    3. Enter the mobile number as "9999999999" in the phone field
    4. Enter the email as "trainer@way2automation.com" in the email field
    5. Select "Germany" from the country dropdown
    6. Enter the city as "Berlin" in the city field
    `;

    const code = await generatePlaywrightSteps(task);

    await fs.promises.writeFile('tests\\generated-code.spec.ts', code, 'utf8');


});