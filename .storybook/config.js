import { configure } from '@kadira/storybook'
// import { FocusStyleManager } from '@blueprintjs/core'
import '../src/style/app.scss'

// details at http://blueprintjs.com/docs/#a11y.focus
// FocusStyleManager.onlyShowFocusOnTabs()

const srcStories = require.context('../src/', true, /\.story\.js$/)
function loadStories() {
  srcStories.keys().forEach(srcStories)
}

configure(loadStories, module)
