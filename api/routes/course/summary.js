const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("langchain/document");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { HuggingFaceTransformersEmbeddings } = require("@langchain/community/embeddings/hf_transformers");
const { YoutubeTranscript } = require('youtube-transcript');
const { RetrievalQAChain } = require("langchain/chains");
const { OpenAI } = require("@langchain/openai");


let vectorStore
async function generateEmbeddings(transcript) {
    const embeddings = new HuggingFaceTransformersEmbeddings({
        modelName: "Xenova/all-MiniLM-L6-v2",
    });
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments([
        new Document({ pageContent: transcript }),
    ]);
    vectorStore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddings
    );
    // console.log("vectorStore", vectorStore)
    return true
}

async function createSummary(question) {
    const model = new OpenAI({
        streaming: false,
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0,

    });
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const result = await chain.call({query: question});
    return result
}



async function getTranscript(videoURL) {
    try {
        let transcript = ""
        const transcriptChunks = await YoutubeTranscript.fetchTranscript(videoURL)
        if (transcriptChunks.length > 0) {
            for (let chunk of transcriptChunks) {
                transcript += " " + chunk.text
            }
        }
        console.log('transcript', transcript.length, transcript)
        return transcript
    } catch (error) {
        return ""
    }
}

module.exports = {
    getTranscript,
    generateEmbeddings,
    createSummary
}