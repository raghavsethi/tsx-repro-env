import "dotenv/config";
import { createVertex } from "@ai-sdk/google-vertex/edge";
import { generateText } from "ai"
import { initLogger, wrapAISDKModel } from "braintrust";

initLogger({
	projectName: "Query Decomposition",
	apiKey: process.env.BRAINTRUST_API_KEY,
});

const vertex = createVertex({
    project: process.env.GOOGLE_PROJECT_ID,
    location: process.env.GOOGLE_VERTEX_LOCATION,
    googleCredentials: {
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL!,
        privateKey: process.env.GOOGLE_PRIVATE_KEY!,
        privateKeyId: process.env.GOOGLE_PRIVATE_KEY_ID,
    },
});

const model = wrapAISDKModel(vertex.languageModel("gemini-2.0-flash"));
generateText({
    model,
    messages: [
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "What is this video about?",
                },
                {
                    type: "file",
                    
                    // THIS WORKS WITH OR WITHOUT wrapAISDKModel
                    data: 'gs://<bucket-name>/<object-name>',
                    
                    // THIS DOES NOT WORK WITH wrapAISDKModel
                    // data: "https://storage.googleapis.com/<bucket-name>/<object-name>",
                    
                    mimeType: "video/mp4",
                },
            ],
        },
    ],
}).then(({ text }) => {
    console.log(text);
});
