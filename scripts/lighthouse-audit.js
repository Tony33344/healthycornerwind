const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const path = require('path')

const urls = [
  'http://localhost:3002/en',
  'http://localhost:3002/en/services',
  'http://localhost:3002/en/menu',
  'http://localhost:3002/en/schedule',
  'http://localhost:3002/en/gallery',
  'http://localhost:3002/en/contact'
]

const options = {
  logLevel: 'info',
  output: 'html',
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  port: 0,
  chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
}

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: options.chromeFlags })
  options.port = chrome.port

  const results = []

  for (const url of urls) {
    console.log(`Running Lighthouse audit for: ${url}`)
    
    try {
      const runnerResult = await lighthouse(url, options)
      const reportHtml = runnerResult.report
      const scores = runnerResult.lhr.categories
      
      // Save individual reports
      const urlPath = new URL(url).pathname.replace(/\//g, '_') || 'home'
      const reportPath = path.join(__dirname, '..', 'lighthouse-reports', `${urlPath}.html`)
      
      // Ensure directory exists
      const reportsDir = path.dirname(reportPath)
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true })
      }
      
      fs.writeFileSync(reportPath, reportHtml)
      
      // Collect scores
      const result = {
        url,
        scores: {
          performance: Math.round(scores.performance.score * 100),
          accessibility: Math.round(scores.accessibility.score * 100),
          bestPractices: Math.round(scores['best-practices'].score * 100),
          seo: Math.round(scores.seo.score * 100)
        },
        reportPath
      }
      
      results.push(result)
      console.log(`✅ ${url}:`, result.scores)
      
    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message)
      results.push({
        url,
        error: error.message
      })
    }
  }

  await chrome.kill()

  // Generate summary report
  const summaryPath = path.join(__dirname, '..', 'lighthouse-reports', 'summary.json')
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2))

  // Calculate averages
  const validResults = results.filter(r => !r.error)
  if (validResults.length > 0) {
    const averages = {
      performance: Math.round(validResults.reduce((sum, r) => sum + r.scores.performance, 0) / validResults.length),
      accessibility: Math.round(validResults.reduce((sum, r) => sum + r.scores.accessibility, 0) / validResults.length),
      bestPractices: Math.round(validResults.reduce((sum, r) => sum + r.scores.bestPractices, 0) / validResults.length),
      seo: Math.round(validResults.reduce((sum, r) => sum + r.scores.seo, 0) / validResults.length)
    }

    console.log('\n📊 LIGHTHOUSE AUDIT SUMMARY')
    console.log('============================')
    console.log(`Performance: ${averages.performance}/100 ${averages.performance >= 90 ? '✅' : '❌'}`)
    console.log(`Accessibility: ${averages.accessibility}/100 ${averages.accessibility >= 90 ? '✅' : '❌'}`)
    console.log(`Best Practices: ${averages.bestPractices}/100 ${averages.bestPractices >= 90 ? '✅' : '❌'}`)
    console.log(`SEO: ${averages.seo}/100 ${averages.seo >= 90 ? '✅' : '❌'}`)
    
    const overallScore = Math.round((averages.performance + averages.accessibility + averages.bestPractices + averages.seo) / 4)
    console.log(`\n🎯 Overall Score: ${overallScore}/100 ${overallScore >= 90 ? '🎉 EXCELLENT!' : overallScore >= 75 ? '👍 GOOD' : '⚠️ NEEDS IMPROVEMENT'}`)

    // Check if we meet the 90+ requirement
    if (averages.performance >= 90 && averages.accessibility >= 90 && averages.bestPractices >= 90 && averages.seo >= 90) {
      console.log('\n🎉 SUCCESS: All Lighthouse scores are 90+ !')
      process.exit(0)
    } else {
      console.log('\n⚠️ Some scores are below 90. Check individual reports for optimization opportunities.')
      process.exit(1)
    }
  } else {
    console.log('\n❌ No successful audits completed.')
    process.exit(1)
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nShutting down Lighthouse audit...')
  process.exit(0)
})

runLighthouse().catch(console.error)
