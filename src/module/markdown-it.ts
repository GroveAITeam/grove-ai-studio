import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
// import emoji from 'markdown-it-emoji'
import footnote from 'markdown-it-footnote'
import ins from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import taskLists from 'markdown-it-task-lists'
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
const markdownIt = new MarkdownIt(config)

markdownIt
  // .use(emoji)
  .use(footnote)
  .use(ins)
  .use(mark)
  .use(taskLists)
  .use(container, 'hljs-left')
  .use(container, 'hljs-center')
  .use(container, 'hljs-right')
  .use(toc)

export default markdownIt
