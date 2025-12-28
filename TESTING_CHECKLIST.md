# ✅ Testing Checklist - AI Integration

## Pre-requisites
- [ ] Ollama installed: `brew install ollama`
- [ ] Model downloaded: `ollama pull llama3.2`
- [ ] Backend dependencies: `cd backend && npm install`
- [ ] Frontend dependencies: `cd frontend && npm install`

## Backend Testing

### 1. Start Services
- [ ] Terminal 1: `ollama serve` (keep running)
- [ ] Terminal 2: `cd backend && npm run dev` (should see "Backend listening on http://localhost:4000")

### 2. Health Check
- [ ] Run: `curl http://localhost:4000/ai/health`
- [ ] Expected: `{"status":"healthy","models":["llama3.2:latest"]}`
- [ ] If unhealthy: Check Ollama is running

### 3. Test Script
- [ ] Run: `node backend/src/scripts/test_ollama.js`
- [ ] Expected: 
  - ✅ Ollama is healthy
  - ✅ Slide plans generated (3 slides)
  - ✅ PowerPoint created successfully
  - File saved in: `backend/uploads/presentations/`
- [ ] Open the generated PPTX file
- [ ] Verify slides look good

### 4. API Test with cURL
```bash
# Get your JWT token first (login through frontend or use existing token)
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:4000/ai/generate-slides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "topic": "Test Topic",
    "slideCount": 3,
    "tone": "professional",
    "language": "vi",
    "exportFormat": "pptx"
  }'
```

- [ ] Expected: JSON response with `success: true` and file URL
- [ ] Check file exists in `backend/uploads/presentations/`

## Frontend Testing

### 1. Start Frontend
- [ ] Terminal 3: `cd frontend && npm run dev`
- [ ] Open browser to URL shown (usually http://localhost:5173)

### 2. Login
- [ ] Navigate to login page
- [ ] Login with test credentials
- [ ] Should redirect to dashboard

### 3. Navigate to AI Page
- [ ] Method 1: Click "✨ AIで作成" button in top-right
- [ ] Method 2: Click "🤖 AIスライド" in sidebar (should have NEW badge)
- [ ] Should see AI Slides page with form

### 4. Check UI Elements
- [ ] Ollama status badge shows "✅ Ollama is running" (green)
- [ ] Topic textarea is visible
- [ ] Slide count controls (+/- buttons) work
- [ ] Tone dropdown has 4 options
- [ ] Language dropdown has vi/en
- [ ] Export format dropdown has pptx/json
- [ ] Generate button is enabled and styled with gradient

### 5. Generate Slides (PPTX)
- [ ] Enter topic: "Trí tuệ nhân tạo trong giáo dục"
- [ ] Set slideCount: 5
- [ ] Set tone: professional
- [ ] Set language: vi
- [ ] Set exportFormat: pptx
- [ ] Click "🚀 Tạo Slides với AI"
- [ ] Should see loading spinner with message
- [ ] Wait 10-30 seconds
- [ ] Should see success message
- [ ] File should auto-download to Downloads folder
- [ ] Should see slides preview on page
- [ ] Verify preview shows 5 slides with titles and bullets

### 6. Download Again
- [ ] Click "⬇️ Tải lại file PowerPoint" button
- [ ] File should download again

### 7. Generate Slides (JSON)
- [ ] Change exportFormat to: json
- [ ] Enter new topic: "Machine Learning Basics"
- [ ] Set language: en
- [ ] Click generate
- [ ] Should see success message
- [ ] Should see slides preview
- [ ] Should see "💾 Tải JSON" button
- [ ] Click button to download JSON file
- [ ] Open JSON - verify it's valid and contains slides array

### 8. Error Cases

#### Test: Empty Topic
- [ ] Clear topic field
- [ ] Click generate
- [ ] Should see error: "Vui lòng nhập chủ đề!"

#### Test: Ollama Not Running
- [ ] Stop Ollama (Ctrl+C in Terminal 1)
- [ ] Refresh page
- [ ] Status badge should turn red: "❌ Ollama is not available"
- [ ] Generate button should be disabled
- [ ] Should see help text with instructions

#### Test: Invalid Slide Count
- [ ] Try to set slideCount to 0 or negative
- [ ] Should be capped at minimum 2
- [ ] Try to set slideCount to 30
- [ ] Should be capped at maximum 20

### 9. UI/UX Checks
- [ ] All text is readable
- [ ] Colors match design (purple/indigo gradient)
- [ ] Loading state shows spinner
- [ ] Success/error alerts are visible
- [ ] Slides preview cards look good
- [ ] Responsive on mobile (optional)
- [ ] No console errors

### 10. Open Generated PPTX
- [ ] Open the downloaded .pptx file in PowerPoint/Keynote/Google Slides
- [ ] Verify slides:
  - [ ] Slide 1: Title slide with topic name
  - [ ] Slides 2-N: Content slides with bullets
  - [ ] Each slide has appropriate styling
  - [ ] Speaker notes are present
  - [ ] Slide numbers are visible
  - [ ] Font and colors look professional

## Final Checks

- [ ] All features work end-to-end
- [ ] No errors in browser console
- [ ] No errors in backend logs
- [ ] PPTX files open correctly
- [ ] User experience is smooth
- [ ] Documentation is clear

## If Everything Works:

🎉 **Success! Integration is complete!**

You can now:
- Generate slides with AI
- Export to PowerPoint
- Customize topic, tone, language
- Download and use presentations

## If Something Fails:

Check:
1. Ollama is running: `ollama serve`
2. Model is available: `ollama list`
3. Backend is running: `curl http://localhost:4000/ai/health`
4. Frontend can reach backend: Check VITE_API_BASE
5. JWT token is valid: Re-login if needed
6. Console for error messages

Refer to documentation:
- `AI_COMPLETE_INTEGRATION.md`
- `backend/AI_INTEGRATION_GUIDE.md`
- `frontend/AI_FRONTEND_INTEGRATION.md`

---

**Happy Testing! 🚀**
