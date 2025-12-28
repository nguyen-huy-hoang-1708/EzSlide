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
    // Cấu hình theme mặc định - Modern Professional
    this.defaultTheme = {
      backgroundColor: 'F8F9FA', // Light gray background
      primaryColor: '667EEA',
      secondaryColor: '764BA2',
      accentColor: 'FF6B6B',
      textColor: '2D3748',
      lightTextColor: 'FFFFFF',
      titleFont: 'Segoe UI',
      bodyFont: 'Segoe UI'
    }
    
    // Theme variations
    this.themes = {
      professional: {
        name: 'Professional Blue',
        backgroundColor: 'F8F9FA',
        primary: '667EEA',
        secondary: '764BA2',
        accent: '4ECDC4'
      },
      modern: {
        name: 'Modern Dark',
        backgroundColor: '1A202C',
        primary: '4ECDC4',
        secondary: '2D3748',
        accent: 'FF6B6B'
      },
      elegant: {
        name: 'Elegant Gold',
        backgroundColor: 'FFFBF5',
        primary: 'C9A74A',
        secondary: '8B6914',
        accent: '2D3748'
      },
      vibrant: {
        name: 'Vibrant Colors',
        backgroundColor: 'FFF5F7',
        primary: 'FF6B9D',
        secondary: 'C44569',
        accent: '4834DF'
      }
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

      // Chọn theme
      const themeName = options.themeName || 'professional'
      const selectedTheme = this.themes[themeName] || this.themes.professional
      
      const theme = {
        ...this.defaultTheme,
        backgroundColor: selectedTheme.backgroundColor,
        primaryColor: selectedTheme.primary,
        secondaryColor: selectedTheme.secondary,
        accentColor: selectedTheme.accent,
        ...options.theme
      }

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
   * Tạo title slide (slide đầu tiên) - ENHANCED
   */
  createTitleSlide(pptx, slideData, theme) {
    const slide = pptx.addSlide()

    // Simple solid background
    slide.background = { color: theme.backgroundColor }

    // Top gradient bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 2.5,
      fill: { type: 'solid', color: theme.primaryColor }
    })

    // Decorative circle - top right
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 8.5,
      y: 0.3,
      w: 1.5,
      h: 1.5,
      fill: { type: 'solid', color: theme.accentColor, transparency: 70 },
      line: { type: 'none' }
    })

    // Decorative circle - bottom left
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.3,
      y: 4.8,
      w: 1.2,
      h: 1.2,
      fill: { type: 'solid', color: theme.primaryColor, transparency: 80 },
      line: { type: 'none' }
    })

    // Main title with shadow
    slide.addText(slideData.title, {
      x: 1,
      y: 2.8,
      w: 8,
      h: 1.5,
      align: 'center',
      valign: 'middle',
      fontSize: 48,
      bold: true,
      color: theme.primaryColor,
      fontFace: theme.titleFont,
      shadow: {
        type: 'outer',
        blur: 8,
        offset: 3,
        angle: 45,
        color: '000000',
        opacity: 0.3
      }
    })

    // Subtitle with modern style
    if (slideData.bullets && slideData.bullets.length > 0) {
      slide.addText(slideData.bullets[0], {
        x: 1.5,
        y: 4.5,
        w: 7,
        h: 0.6,
        align: 'center',
        fontSize: 20,
        color: theme.textColor,
        fontFace: theme.bodyFont,
        italic: true
      })
    }

    // Bottom accent bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 5.5,
      w: '100%',
      h: 0.15,
      fill: { type: 'solid', color: theme.secondaryColor }
    })

    // Modern date badge
    const today = new Date().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    slide.addText(today, {
      x: 7.5,
      y: 5.25,
      w: 2,
      h: 0.35,
      align: 'right',
      fontSize: 11,
      color: '718096',
      fontFace: theme.bodyFont
    })

    // "Powered by AI" badge
    slide.addText('🤖 Powered by AI', {
      x: 0.5,
      y: 5.25,
      w: 2,
      h: 0.35,
      align: 'left',
      fontSize: 10,
      color: theme.primaryColor,
      fontFace: theme.bodyFont,
      bold: true
    })

    // Speaker notes
    if (slideData.notes) {
      slide.addNotes(slideData.notes)
    }
  }

  /**
   * Tạo content slide (slide nội dung) - ENHANCED
   */
  createContentSlide(pptx, slideData, theme) {
    const slide = pptx.addSlide()

    // Soft background
    slide.background = { color: theme.backgroundColor }

    // Decorative top-right shape
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8,
      y: 0,
      w: 2,
      h: 1.5,
      fill: { type: 'solid', color: theme.primaryColor },
      line: { type: 'none' },
      rectRadius: 0.2
    })

    // Side accent bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.15,
      h: '100%',
      fill: { type: 'solid', color: theme.primaryColor }
    })

    // Title background box
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 0.8,
      fill: { type: 'solid', color: theme.primaryColor },
      line: { type: 'none' }
    })

    // Title text (white on gradient)
    slide.addText(slideData.title, {
      x: 0.7,
      y: 0.5,
      w: 8.5,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: 'FFFFFF',
      fontFace: theme.titleFont,
      valign: 'middle'
    })

    // Slide number badge
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 9.2,
      y: 0.45,
      w: 0.7,
      h: 0.7,
      fill: { type: 'solid', color: theme.accentColor },
      line: { type: 'none' }
    })

    slide.addText(slideData.slideNumber.toString(), {
      x: 9.2,
      y: 0.45,
      w: 0.7,
      h: 0.7,
      fontSize: 16,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle',
      fontFace: theme.bodyFont
    })

    // Content area with subtle shadow
    const contentBox = {
      x: 0.7,
      y: 1.6,
      w: 8.6,
      h: 3.8
    }

    // Content background
    slide.addShape(pptx.ShapeType.rect, {
      x: contentBox.x,
      y: contentBox.y,
      w: contentBox.w,
      h: contentBox.h,
      fill: { type: 'solid', color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 1 }
    })

    // Bullets with custom icons
    if (slideData.bullets && slideData.bullets.length > 0) {
      const bulletStartY = contentBox.y + 0.4
      const bulletSpacing = 0.65
      const iconSize = 0.35

      slideData.bullets.forEach((bullet, index) => {
        const yPos = bulletStartY + (index * bulletSpacing)
        
        // Custom bullet icon (colored circle with number)
        slide.addShape(pptx.ShapeType.ellipse, {
          x: contentBox.x + 0.3,
          y: yPos,
          w: iconSize,
          h: iconSize,
          fill: { type: 'solid', color: theme.primaryColor },
          line: { type: 'none' }
        })

        // Number in circle
        slide.addText((index + 1).toString(), {
          x: contentBox.x + 0.3,
          y: yPos,
          w: iconSize,
          h: iconSize,
          fontSize: 12,
          bold: true,
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          fontFace: theme.bodyFont
        })

        // Bullet text with better spacing
        slide.addText(bullet, {
          x: contentBox.x + 0.8,
          y: yPos - 0.05,
          w: contentBox.w - 1.2,
          h: 0.5,
          fontSize: 16,
          color: theme.textColor,
          fontFace: theme.bodyFont,
          valign: 'top',
          lineSpacing: 20
        })
      })
    }

    // Image hint placeholder với icon đẹp
    if (slideData.imageHint) {
      const imgBox = {
        x: 6.5,
        y: contentBox.y + 0.4,
        w: 2.6,
        h: 2
      }

      // Image placeholder background
      slide.addShape(pptx.ShapeType.rect, {
        x: imgBox.x,
        y: imgBox.y,
        w: imgBox.w,
        h: imgBox.h,
        fill: { type: 'solid', color: theme.primaryColor, transparency: 85 },
        line: { color: theme.primaryColor, width: 2, dashType: 'dash' }
      })

      // Icon
      slide.addText('🖼️', {
        x: imgBox.x,
        y: imgBox.y + 0.3,
        w: imgBox.w,
        h: 0.5,
        fontSize: 32,
        align: 'center'
      })

      // Hint text
      slide.addText(slideData.imageHint, {
        x: imgBox.x + 0.2,
        y: imgBox.y + 1,
        w: imgBox.w - 0.4,
        h: 0.8,
        fontSize: 10,
        color: theme.textColor,
        fontFace: theme.bodyFont,
        align: 'center',
        valign: 'middle',
        italic: true
      })
    }

    // Footer bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 5.5,
      w: '100%',
      h: 0.06,
      fill: { type: 'solid', color: theme.secondaryColor }
    })

    // Page indicator
    slide.addText(`Slide ${slideData.slideNumber}`, {
      x: 8.5,
      y: 5.15,
      w: 1,
      h: 0.3,
      align: 'right',
      fontSize: 10,
      color: '718096',
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
