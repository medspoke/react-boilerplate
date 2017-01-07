# Medspoke Project Boilerplate

## Installation
```bash
npm i
```

## Development
### Storybook
We use Storybook to build components in isolation from the app.

```bash
npm run storybook
```
[http://localhost:9001](http://localhost:9001) to view stories.

### Running the app locally
To run the actual app locally, you will need to have the core rails server running
and then:
```bash
npm start
```
[http://localhost:8080](http://localhost:8080) to view web app.

### Recommended editor setup
This project uses editorconfig and eslint to help ensure code quality.
Be sure to have a plugin for these installed.

#### Atom plugins
```bash
apm install editorconfig
apm install language-babel
apm install linter
apm install linter-eslint
```

#### Webstorm plugins
```bash
```

### Best practices
#### Proptype checking
Proper use of proptypes can help tremendously when trying to understand components in addition
to adding great error checking in the console while developing.
ESLint is set up to warn on missing validations. Please use the official docs as reference if you
are unsure on how to validate certain props.
[Proptype validation reference](https://facebook.github.io/react/docs/typechecking-with-proptypes.html)
Prop types are validated in static objects IE:
```javascript
import React, { PureComponent, PropTypes as PT } from 'react'

class ComponentName extends PureComponent {
  static propTypes = {
    someProp: PT.string.isRequired,
  }
}
```
