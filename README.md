<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1KaxhzDJiogo98aNBhDO8deNAquVp49Xs

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env` file in the root directory and set your API keys:
   - `VITE_API_KEY` - Your Gemini API key (Required - for AI chat and voice functionality)
     - Get your key from: https://aistudio.google.com/app/apikey
   - `VITE_OPENAI_API_KEY` - Your OpenAI API key (Optional - for enhanced TTS voice)
     - Get your key from: https://platform.openai.com/api-keys
     - If not set, will use Gemini TTS (Kore voice) instead
   - `VITE_GOOGLE_MAPS_API_KEY` - Your Google Maps API key (Optional - for address autocomplete)
     - Get your key from: https://console.cloud.google.com/google/maps-apis
     - Make sure to enable "Places API" for your project
3. Run the app:
   `npm run dev`

## Google Maps Address Autocomplete

The address autocomplete feature requires a Google Maps API key with the Places API enabled. If the API key is not set, you can still enter addresses manually. Check the browser console (F12) for debugging information about the API key status.
