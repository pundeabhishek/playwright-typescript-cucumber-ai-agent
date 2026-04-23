import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyDdEU-_MU2f8o84dGEvdI7gtXLr5jDrnnc';

export async function generatePlaywrightSteps(task: string): Promise<string> {
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
    {
      contents: [{ parts: [{ text: `Convert this test case to Playwright TypeScript code:\n\n${task} and no explaination required`  }] }]
    }
  );
  
  return response.data.candidates[0].content.parts[0].text;
}
