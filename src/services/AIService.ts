import axios from 'axios';
import { Timestamp } from 'firebase/firestore';

interface Transaction {
  id: string;
  date: Date | Timestamp;
  type: 'expense' | 'income';
  category: string;
  amount: number;
}

const HUGGING_FACE_API_KEY = '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'; // Replace with your actual Hugging Face Access Token

async function callAIService(prompt: string): Promise<string> {
  const url = 'https://api-inference.huggingface.co/models/gpt2'; // Example model endpoint
  try {
    const response = await axios.post(
      url,
      {
        inputs: prompt,
        parameters: {
          max_length: 500, // Adjust as needed
          temperature: 0.7,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data[0]?.generated_text?.trim() || 'No text generated';
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error calling AI service:', error.response.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

async function generateAIReport(transactions: Transaction[]): Promise<string> {
  try {
    // Convert transactions to a format that includes ISO date strings
    const formattedTransactions = transactions.map(t => {
      let date: Date;

      if (t.date instanceof Timestamp) {
        date = t.date.toDate();
      } else if (t.date instanceof Date) {
        date = t.date;
      } else if (typeof t.date === 'string') {
        date = new Date(t.date);
      } else {
        console.error('Unexpected date type:', t.date);
        throw new Error('Invalid date type');
      }

      return {
        ...t,
        date: date.toISOString()
      };
    });

    // Construct the prompt for the AI service
    let prompt = `Generate a concise report analyzing the following transactions and suggest improvements:\n${JSON.stringify(formattedTransactions, null, 2)}`;

    // Token limits
    const MAX_INPUT_TOKENS = 900; // Adjust as needed
  

    // Truncate the prompt if it exceeds the maximum input tokens
    if (prompt.length > MAX_INPUT_TOKENS) {
      prompt = prompt.substring(0, MAX_INPUT_TOKENS);
    }

    // Call the AI service
    const report = await callAIService(prompt);

    // Format the AI response to be user-friendly
    return formatAIResponse(report);
  } catch (error) {
    console.error('Error generating AI report:', error);
    throw error;
  }
}

function formatAIResponse(response: string): string {
  // Here you can further format or clean up the AI response if needed
  // For now, we're assuming the response is ready to use
  return response;
}

export { generateAIReport };
