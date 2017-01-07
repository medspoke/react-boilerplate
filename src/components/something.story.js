import React from 'react'
import { storiesOf, action } from '@kadira/storybook'

import SomeThing from './SomeThing'

storiesOf('Some Thing', module)
  .addDecorator((story) => (
    <div>
      <h1>I&apos;m a story hotdog</h1>
      {story()}
      <h1>Yummy</h1>
    </div>
  ))
  .add('Something', () => (
    <SomeThing />
  ))
