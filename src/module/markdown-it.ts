import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import toc from 'markdown-it-toc-done-right'

const config = {
  html: true,
  xhtmlOut: true,
  breaks: true,
  langPrefix: 'lang-',
  linkify: false,
  typographer: true,
  quotes: '“”‘’',
}
const md = new MarkdownIt(config)

md
  .use(container)
  .use(container, 'hljs-left')
  .use(container, 'hljs-center')
  .use(container, 'hljs-right')
  .use(toc)

md.set({
  highlight(str, lang) {
    let html = ``
    const linesLength = str.split(/\n/).length - 1
    // 生成行号
    let linesNum = '<span aria-hidden="true" class="line-numbers-rows">'
    for (let index = 0; index < linesLength; index++) {
      linesNum = `${linesNum}<span></span>`
    }
    linesNum += '</span>'
    if (lang && hljs.getLanguage(lang)) {
      try {
        // highlight.js 高亮代码
        const preCode = hljs.highlight(lang, str, true).value
        html = html + preCode
        // if (linesLength) {
        //   html += '<b class="name">' + lang + '</b>'
        // }
        return `<pre class="hljs"><code>${html}</code>${linesNum}</pre>`
      } catch (error) {
        console.log(error)
      }
    }

    const preCode = md.utils.escapeHtml(str)
    html = html + preCode
    return `<pre class="hljs"><code>${html}</code>${linesNum}</pre>`
  },
})
export default md
