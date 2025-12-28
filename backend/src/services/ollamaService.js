import { Ollama } from 'ollama'

/**
 * Service để tương tác với Ollama AI local
 */
class OllamaService {
  constructor() {
    // Khởi tạo client Ollama (mặc định connect tới localhost:11434)
    this.client = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    })
    this.defaultModel = process.env.OLLAMA_MODEL || 'llama3.2'
  }

  /**
   * Generate kế hoạch slides từ prompt của user
   * @param {Object} params - Tham số đầu vào
   * @param {string} params.topic - Chủ đề presentation
   * @param {number} params.slideCount - Số lượng slide cần tạo
   * @param {string} params.tone - Tone của nội dung (formal, casual, professional, creative)
   * @param {string} params.language - Ngôn ngữ (vi, en)
   * @param {boolean} params.includeImages - Có đề xuất hình ảnh không
   * @returns {Promise<Array>} Danh sách slide plans
   */
  async generateSlidePlan({ topic, slideCount = 5, tone = 'professional', language = 'vi', includeImages = false }) {
    try {
      const prompt = this.buildPrompt({ topic, slideCount, tone, language, includeImages })
      
      const response = await this.client.chat({
        model: this.defaultModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional presentation designer. Generate structured slide content in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: false,
        format: 'json'
      })

      // Parse response từ AI
      const slidePlan = JSON.parse(response.message.content)
      return slidePlan.slides || []
    } catch (error) {
      console.error('Ollama generation error:', error)
      throw new Error(`Failed to generate slides with AI: ${error.message}`)
    }
  }

  /**
   * Xây dựng prompt cho AI
   */
  buildPrompt({ topic, slideCount, tone, language, includeImages }) {
    const languageInstruction = language === 'vi' 
      ? 'Trả lời bằng tiếng Việt.' 
      : 'Respond in English.'
    
    const imageInstruction = includeImages
      ? 'For each slide, suggest a relevant image description in the "imageHint" field.'
      : 'Do not include image suggestions.'

    return `
${languageInstruction}

Create a presentation about: "${topic}"

Requirements:
- Number of slides: ${slideCount}
- Tone: ${tone}
- ${imageInstruction}

Return ONLY valid JSON in this exact format:
{
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "notes": "Speaker notes for this slide",
      "imageHint": "Description of relevant image (optional)"
    }
  ]
}

Rules:
1. First slide should be a title slide with the main topic
2. Last slide should be a conclusion or call-to-action
3. Middle slides should cover key points about the topic
4. Each slide should have 2-5 bullet points
5. Keep bullet points concise (max 15 words each)
6. Include helpful speaker notes
7. Make sure the JSON is valid and parseable
`.trim()
  }

  /**
   * Kiểm tra xem Ollama service có đang chạy không
   */
  async healthCheck() {
    try {
      const response = await this.client.list()
      return {
        status: 'healthy',
        models: response.models.map(m => m.name)
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      }
    }
  }

  /**
   * Pull một model về máy nếu chưa có
   */
  async pullModel(modelName = this.defaultModel) {
    try {
      console.log(`Pulling model ${modelName}...`)
      const response = await this.client.pull({ 
        model: modelName,
        stream: false 
      })
      return { success: true, model: modelName }
    } catch (error) {
      console.error('Failed to pull model:', error)
      throw new Error(`Cannot pull model ${modelName}: ${error.message}`)
    }
  }
}

export default new OllamaService()
