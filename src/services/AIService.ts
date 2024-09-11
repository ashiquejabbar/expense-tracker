
import { Timestamp } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Transaction {
  id: string;
  date: Date | Timestamp;
  type: "expense" | "income";
  category: string;
  amount: number;
}



// Function to call the Gemini API
async function callGeminiAPI(prompt: string) {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBK73T50RWqjjg02u6foch8sH9lw_CBZGs"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  
  return result.response.text();
}

// Function to generate the AI report using the Gemini API
async function generateAIReport(transactions: Transaction[]): Promise<string> {
  try {
    // Format transactions for prompt
    const formattedTransactions = transactions.map((t) => {
      let date: Date;
      if (t.date instanceof Timestamp) {
        date = t.date.toDate();
      } else if (t.date instanceof Date) {
        date = t.date;
      } else if (typeof t.date === "string") {
        date = new Date(t.date);
      } else {
        console.error("Unexpected date type:", t.date);
        throw new Error("Invalid date type");
      }

      return {
        ...t,
        date: date.toISOString(),
      };
    });

    // Construct the prompt for the Gemini API
    let prompt = `
    You are an AI financial advisor. Below is a list of financial transactions including date, type (expense or income), category, and amount. 
    Analyze these transactions and provide a detailed financial report. The report should include:
    1. A summary of total income and total expenses.
    2. The most frequent expense categories.
    3. Any unusual or high spending patterns.
    4. Suggestions on how to optimize expenses or increase savings.
    5. Recommendations for future budgeting and expense management.
    
    Here are the transactions:
    ${JSON.stringify(formattedTransactions, null, 2)}
    `;

    // Token limit for prompt (adjust as needed based on the API specs)
    const MAX_INPUT_TOKENS = 900;
    if (prompt.length > MAX_INPUT_TOKENS) {
      prompt = prompt.substring(0, MAX_INPUT_TOKENS);
    }

    // Call the Gemini API to generate the report
    const report = await callGeminiAPI(prompt);

    // Format the AI response for output
    return formatAIResponse(report);
  } catch (error) {
    console.error("Error generating AI report:", error);
    throw error;
  }
}

// Function to format the AI response
function formatAIResponse(response: string): string {
  // Add additional formatting logic if needed
  return response;
}

export { generateAIReport };
