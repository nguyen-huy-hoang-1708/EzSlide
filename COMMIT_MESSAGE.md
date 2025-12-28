# Commit Message

```
feat: integrate Ollama AI + PptxGenJS for local slide generation

## What's New
- ✨ Local AI slide generation using Ollama (no external API needed)
- 📄 PPTX file generation using PptxGenJS
- 🔒 100% private - AI runs locally, no data sent externally

## Features
- POST /ai/generate-slides - Generate slides with AI and export to PPTX
- GET /ai/health - Check Ollama service status
- POST /ai/pull-model - Pull AI models (admin only)
- Support Vietnamese and English content
- Customizable tone, slide count, and style

## Architecture
User Input → Backend API → Ollama (Local AI) → Slide Plans (JSON) → PptxGenJS → .pptx File → User Download

## Files Added
- backend/src/services/ollamaService.js - Ollama integration service
- backend/src/services/pptxService.js - PowerPoint generation service
- backend/src/scripts/test_ollama.js - Test script
- backend/AI_INTEGRATION_GUIDE.md - Complete guide
- test-ai-slides.html - Test UI
- QUICKSTART_AI.md - Quick start guide
- AI_INTEGRATION_SUMMARY.md - Summary document

## Files Modified
- backend/package.json - Added ollama and pptxgenjs dependencies
- backend/src/routes/ai.js - Added new endpoints
- backend/README.md - Updated documentation
- backend/.env.example - Added Ollama configuration

## Dependencies
- ollama: ^0.5.0
- pptxgenjs: ^3.12.0

## Setup Required
1. Install Ollama: `brew install ollama`
2. Start service: `ollama serve`
3. Pull model: `ollama pull llama3.2`
4. Install deps: `cd backend && npm install`
5. Start backend: `npm run dev`

## Testing
- Script: `node backend/src/scripts/test_ollama.js`
- UI: Open `test-ai-slides.html` in browser
- API: `curl http://localhost:3001/ai/health`

## Documentation
See AI_INTEGRATION_GUIDE.md for detailed setup and usage instructions.

## Security
✅ 100% local processing - no external API calls
✅ No API keys required
✅ Data never leaves your machine
```
