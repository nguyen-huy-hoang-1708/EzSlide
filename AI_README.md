# 🤖 AI Slides Generation - Quick Reference

## 🚀 TL;DR

```bash
# 1. Setup (once)
brew install ollama
ollama pull llama3.2

# 2. Run (every time)
# Terminal 1
ollama serve

# Terminal 2
cd backend && npm install && npm run dev

# Terminal 3
cd frontend && npm install && npm run dev

# 3. Use
# Open browser → Login → Click "AIで作成" → Generate!
```

## 📁 Files Structure

```
EzSlide/
├── 📄 AI_COMPLETE_INTEGRATION.md      ← Full guide
├── 📄 QUICKSTART_AI.md                 ← Quick start
├── 📄 TESTING_CHECKLIST.md             ← Testing guide
├── 📄 AI_INTEGRATION_SUMMARY.md        ← Technical summary
│
├── backend/
│   ├── 📄 AI_INTEGRATION_GUIDE.md     ← Backend detailed guide
│   ├── src/
│   │   ├── services/
│   │   │   ├── ollamaService.js       ← Ollama integration
│   │   │   └── pptxService.js         ← PPTX generation
│   │   ├── routes/
│   │   │   └── ai.js                  ← API endpoints (updated)
│   │   └── scripts/
│   │       └── test_ollama.js         ← Test script
│   ├── package.json                    ← +ollama, +pptxgenjs
│   └── .env.example                    ← +OLLAMA_HOST, +OLLAMA_MODEL
│
└── frontend/
    ├── 📄 AI_FRONTEND_INTEGRATION.md  ← Frontend guide
    └── src/
        ├── pages/
        │   └── GenerateAI.jsx          ← Main AI page (updated)
        └── components/
            └── Sidebar.jsx             ← +AI menu (updated)
```

## ⚡ Quick Commands

```bash
# Check Ollama health
curl http://localhost:4000/ai/health

# Test backend
node backend/src/scripts/test_ollama.js

# Generate slides (API)
curl -X POST http://localhost:4000/ai/generate-slides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"topic":"AI in Education","slideCount":5,"language":"en"}'
```

## 🎯 Key Features

✅ Local AI (Ollama) - No external API  
✅ PPTX export - Auto-download  
✅ Beautiful UI - Modern gradient design  
✅ Real-time status - Ollama health monitoring  
✅ Multi-language - Vietnamese & English  
✅ Customizable - Topic, count, tone, language  
✅ Preview - See slides before download  
✅ Secure - 100% private, local processing  

## 📚 Documentation

| File | Description |
|------|-------------|
| `AI_COMPLETE_INTEGRATION.md` | Complete overview & setup |
| `QUICKSTART_AI.md` | Fast setup guide |
| `TESTING_CHECKLIST.md` | Testing procedures |
| `backend/AI_INTEGRATION_GUIDE.md` | Backend technical details |
| `frontend/AI_FRONTEND_INTEGRATION.md` | Frontend implementation |

## 🐛 Troubleshooting

**Ollama not running?**
```bash
ollama serve
```

**Model not found?**
```bash
ollama pull llama3.2
```

**Backend error?**
```bash
cd backend && npm install
```

**Frontend can't connect?**
- Check backend is on port 4000
- Check you're logged in (JWT token)

## 🎉 Success Criteria

- [ ] Ollama health shows ✅
- [ ] Can generate 5 slides in ~15 seconds
- [ ] PPTX downloads automatically
- [ ] Slides look professional
- [ ] No errors in console

## 💡 Tips

- Use `llama3.2` for best balance (speed + quality)
- Start with 3-5 slides (faster)
- Vietnamese works better than English (model trained on more data)
- PPTX format is recommended for most use cases
- Keep topics clear and specific

## 🔗 Workflow

```
User Input → Backend → Ollama AI → Slide Plans → PptxGenJS → .pptx → Download
```

---

**Need help? Read:** `AI_COMPLETE_INTEGRATION.md`  
**Quick start? Read:** `QUICKSTART_AI.md`  
**Want to test? Read:** `TESTING_CHECKLIST.md`

**Made with ❤️ for EzSlide**
