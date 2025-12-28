import PptxGenJS from 'pptxgenjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Service để tạo file PowerPoint từ slide plans
 */
class PptxService {
  constructor() {
    // Cấu hình theme mặc định
    this.defaultTheme = {
      background: 'FFFFFF',
      primaryColor: '4472C4',
      secondaryColor: '70AD47',
      textColor: '000000',
      titleFont: 'Arial',
      bodyFont: 'Calibri'
    }
  }

  /**
   * Tạo file PPTX từ slide plans
   * @param {Array} slides - Danh sách slide plans từ AI
   * @param {Object} options - Tùy chọn theme và metadata
   * @returns {Promise<string>} Đường dẫn đến file PPTX đã tạo
   */
  async generatePresentation(slides, options = {}) {
    try {
      const pptx = new PptxGenJS()
      
      // Thiết lập metadata
      pptx.author = options.author || 'EzSlide'
      pptx.company = options.company || 'EzSlide Platform'
      pptx.subject = options.subject || 'AI Generated Presentation'
      pptx.title = options.title || 'Presentation'

      // Thiết lập layout (16:9)
      pptx.layout = 'LAYOUT_16x9'

      // Áp dụng theme
      const theme = { ...this.defaultTheme, ...options.theme }

      // Tạo từng slide
      for (const slideData of slides) {
        if (slideData.slideNumber === 1) {
          this.createTitleSlide(pptx, slideData, theme)
        } else {
          this.createContentSlide(pptx, slideData, theme)
        }
      }

      // Lưu file
      const outputDir = path.join(__dirname, '../../uploads/presentations')
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      const filename = `presentation_${Date.now()}.pptx`
      const filepath = path.join(outputDir, filename)

      await pptx.writeFile({ fileName: filepath })

      return {
        filepath,
        filename,
        url: `/uploads/presentations/${filename}`
      }
    } catch (error) {
      console.error('PPTX generation error:', error)
      throw new Error(`Failed to generate PowerPoint: ${error.message}`)
    }
  }

  /**
   * Tạo title slide (slide đầu tiên)
   */
  createTitleSlide(pptx, slideData, theme) {
    const slide = pptx.addSlide()

    // Background
    slide.background = { color: theme.background }

    // Title chính (lớn, ở giữa)
    slide.addText(slideData.title, {
      x: 1,
      y: 2.5,
      w: 8,
      h: 1.5,
      align: 'center',
      fontSize: 44,
      bold: true,
      color: theme.primaryColor,
      fontFace: theme.titleFont
    })

    // Subtitle nếu có
    if (slideData.bullets && slideData.bullets.length > 0) {
      slide.addText(slideData.bullets[0], {
        x: 1,
        y: 4.2,
        w: 8,
        h: 0.5,
        align: 'center',
        fontSize: 20,
        color: theme.textColor,
        fontFace: theme.bodyFont
      })
    }

    // Date ở footer
    const today = new Date().toLocaleDateString('vi-VN')
    slide.addText(today, {
      x: 8.5,
      y: 5.2,
      w: 1,
      h: 0.3,
      align: 'right',
      fontSize: 12,
      color: '666666',
      fontFace: theme.bodyFont
    })

    // Speaker notes
    if (slideData.notes) {
      slide.addNotes(slideData.notes)
    }
  }

  /**
   * Tạo content slide (slide nội dung)
   */
  createContentSlide(pptx, slideData, theme) {
    const slide = pptx.addSlide()

    // Background
    slide.background = { color: theme.background }

    // Title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.7,
      fontSize: 32,
      bold: true,
      color: theme.primaryColor,
      fontFace: theme.titleFont
    })

    // Đường gạch ngang dưới title
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 1.3,
      w: 9,
      h: 0.02,
      fill: { color: theme.secondaryColor }
    })

    // Bullets (content chính)
    if (slideData.bullets && slideData.bullets.length > 0) {
      const bulletText = slideData.bullets.map((bullet, index) => ({
        text: bullet,
        options: {
          bullet: true,
          breakLine: index < slideData.bullets.length - 1
        }
      }))

      slide.addText(bulletText, {
        x: 0.8,
        y: 2.0,
        w: 8.5,
        h: 3.5,
        fontSize: 18,
        color: theme.textColor,
        fontFace: theme.bodyFont,
        lineSpacing: 28
      })
    }

    // Image hint placeholder (nếu có)
    if (slideData.imageHint) {
      slide.addText(`🖼️ ${slideData.imageHint}`, {
        x: 6.5,
        y: 2.0,
        w: 3,
        h: 2,
        fontSize: 12,
        color: '888888',
        fontFace: theme.bodyFont,
        align: 'center',
        valign: 'middle',
        fill: { color: 'F0F0F0' }
      })
    }

    // Slide number ở footer
    slide.addText(`${slideData.slideNumber}`, {
      x: 9.2,
      y: 5.2,
      w: 0.5,
      h: 0.3,
      align: 'right',
      fontSize: 12,
      color: '666666',
      fontFace: theme.bodyFont
    })

    // Speaker notes
    if (slideData.notes) {
      slide.addNotes(slideData.notes)
    }
  }

  /**
   * Tạo presentation từ template có sẵn
   */
  async generateFromTemplate(slides, templateId) {
    // TODO: Tích hợp với hệ thống template có sẵn
    // Load template theme từ database
    // Apply theme đó vào presentation
    return this.generatePresentation(slides, {})
  }
}

export default new PptxService()
