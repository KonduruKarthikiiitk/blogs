import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function to add timeout to promises
const withTimeout = (promise, timeoutMs = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);
};

// Check if API key is available
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (!apiKey) {
  console.error("REACT_APP_GEMINI_API_KEY is not set in environment variables");
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(apiKey);

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const geminiService = {
  // Generate title suggestions based on content
  generateTitleSuggestions: async (content) => {
    try {
      if (!apiKey) {
        throw new Error("Gemini API key is not configured");
      }

      if (!content || content.trim().length < 10) {
        throw new Error("Content is too short for title generation");
      }

      const prompt = `Based on the following blog post content, generate 3 engaging and SEO-friendly title suggestions. Make them catchy, clear, and under 60 characters each. Return only the titles, one per line:

Content: ${content}

Titles:`;

      const generatePromise = model.generateContent(prompt);
      const result = await withTimeout(generatePromise, 15000); // 15 second timeout
      const response = await result.response;
      const text = response.text();

      const titles = text
        .split("\n")
        .filter((title) => title.trim())
        .slice(0, 3);

      const cleanTitles = titles.map((title) =>
        title.trim().replace(/^\d+\.\s*/, "")
      );

      return cleanTitles;
    } catch (error) {
      console.error("Error generating title suggestions:", error);
      throw new Error(`Failed to generate title suggestions: ${error.message}`);
    }
  },

  // Generate content based on title and topic
  generateContent: async (title, topic, tags = []) => {
    try {
      if (!apiKey) {
        throw new Error("Gemini API key is not configured");
      }

      if (!title || title.trim().length < 3) {
        throw new Error("Title is too short for content generation");
      }

      const prompt = `Write a comprehensive blog post with the title "${title}". 
      
Topic: ${topic}
Tags: ${tags.join(", ")}

Please write engaging, well-structured content that includes:
- An introduction that hooks the reader
- 3-4 main sections with clear headings
- Practical examples or insights
- A conclusion that summarizes key points
- Use HTML formatting for headings, paragraphs, and lists
- Keep it between 500-800 words
- Make it informative and engaging

Content:`;

      const generatePromise = model.generateContent(prompt);
      const result = await withTimeout(generatePromise, 25000); // 25 second timeout
      const response = await result.response;
      const content = response.text();

      return content;
    } catch (error) {
      console.error("Error generating content:", error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  },

  // Generate content outline
  generateOutline: async (title, topic) => {
    try {
      const prompt = `Create a detailed outline for a blog post titled "${title}" about "${topic}". 
      
Return the outline in HTML format with:
- Main headings as <h2> tags
- Sub-headings as <h3> tags
- Brief descriptions for each section
- Keep it structured and easy to follow

Outline:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating outline:", error);
      throw new Error("Failed to generate outline");
    }
  },

  // Improve existing content
  improveContent: async (content) => {
    try {
      const prompt = `Improve the following blog post content to make it more engaging, clear, and well-structured. 
      
Keep the same topic and main points but enhance:
- Clarity and readability
- Flow and structure
- Engagement and interest
- Grammar and style
- Add relevant subheadings if needed

Return the improved content in HTML format.

Original content: ${content}

Improved content:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error improving content:", error);
      throw new Error("Failed to improve content");
    }
  },
};
