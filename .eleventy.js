const fs = require('fs')
const markdownIt = require('markdown-it')
const { DateTime } = require("luxon")

module.exports = (config) => {

  // Asset Watch Targets
  config.addWatchTarget('./src/assets')

  // Layouts
  config.addLayoutAlias('home-en', 'home-en.njk')
  config.addLayoutAlias('home-fi', 'home-fi.njk')

  const absoluteUrl = 'https://juhaliikala.dev'
  config.addFilter('absoluteUrl', (path) => `${absoluteUrl}${path}`)

  config.addShortcode('year', () => `${new Date().getUTCFullYear()}`)
  const currentDate = DateTime.now()
  const currentWeekday = currentDate.toFormat('cccc');
  config.addShortcode('day', () => `${currentWeekday}`)

  // Pass-through files
  config.addPassthroughCopy('src/robots.txt')
  config.addPassthroughCopy('src/assets/images')
  config.addPassthroughCopy('src/assets/fonts')
  config.addPassthroughCopy('src/assets/js')
  config.addPassthroughCopy('src/favicon.ico')
  config.addPassthroughCopy('src/icon.svg')
  config.addPassthroughCopy('src/icon-192.png')
  config.addPassthroughCopy('src/icon-512.png')
  config.addPassthroughCopy('src/apple-touch-icon.png')
  config.addPassthroughCopy('src/manifest.webmanifest')

  config.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware('*', (req, res) => {
          const content_404 = fs.readFileSync('dist/404/index.html');
          // Add 404 http status code in request header.
          res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data'
    },
    templateFormats: ['njk', 'md', 'liquid'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  }
}