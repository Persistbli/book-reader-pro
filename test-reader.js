import { chromium } from 'playwright-core'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function test() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  // 1. 打开首页
  await page.goto('http://localhost:8080')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: join(__dirname, 'screenshot-01-bookshelf.png') })
  console.log('1. 书架页面已截图')

  // 2. 上传 TXT 测试文件
  const filePath = join(__dirname, 'dist/test-book.txt')
  const input = await page.locator('input[type="file"]').first()
  await input.setInputFiles(filePath)
  await page.waitForTimeout(2000)
  await page.screenshot({ path: join(__dirname, 'screenshot-02-uploaded.png') })
  console.log('2. 文件上传后已截图')

  // 3. 点击打开书籍
  const card = await page.locator('.group').first()
  await card.click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: join(__dirname, 'screenshot-03-reader.png') })
  console.log('3. 阅读器已截图')

  // 4. 检查控制台错误
  const errors = await page.evaluate(() => {
    // 无法直接获取控制台错误，但可以检查页面内容
    return document.body.innerText.substring(0, 500)
  })
  console.log('4. 页面内容:', errors)

  await browser.close()
  console.log('测试完成')
}

test().catch(err => { console.error('Test error:', err); process.exit(1) })
