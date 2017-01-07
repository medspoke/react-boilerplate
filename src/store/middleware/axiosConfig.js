import axios from 'axios'
import _ from 'lodash'
import { browserHistory } from 'react-router'

import { TOKEN_EXPIRED } from './actionTypes'
import * as helpers from '../common_module/helpers'

// rootURL configured by webpack -- do not change this!
// to edit the variable, look in the webpack configuration file for the environment you are working in
// i.e. webpack.staging.config.js, or for development, simply webpack.config.js
// ====================================================
const rootUrl = process.env.API_ROOT_URL || 'http://localhost:3000'
// ====================================================
// rootURL configured by webpack -- do not change this!

const userTypeFromRoute = () => {
  const adminTest = /^.*(\/admin)/
  const groupTest = /^.*(\/group)/
  const providerTest = /^.*(\/provider)/

  const path = String(window.location.pathname)

  if (adminTest.test(path)) {
 return 'admin'
}
  if (groupTest.test(path)) {
 return 'groups'
}
  if (providerTest.test(path)) {
 return 'provider'
}
}

const deviceTokenRequired = () => {
  // In the case of sign-in/device verification paths,
  // we need to send the device token back instead of the Authorization
  const pathTest = /^.*(\/sign-in|\/device|\/phone-number|\/mfa-verify)/

  const path = String(window.location.pathname)

  return pathTest.test(path)
}

export const interceptRequests = () => {
  axios.defaults.baseURL = `${rootUrl}/`

  axios.interceptors.request.use(config => {
    console.log(config)

    const userType = userTypeFromRoute()

    if (userType === undefined) {
      throw new Error('Could not determine the user type based on the route.')
    }

 else {
      console.log(`Using ${userType}AuthToken`)
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${helpers.getLocalStorage('Auth', userType)}`,
      }
    }

    return config
  }, (error) => {
    console.log('API Request Error: ---------------------')
    return Promise.reject(error)
  })
}

export const interceptResponses = (store) => {
  axios.interceptors.response.use(response => response, _err => {
    const errorResponse = _err.response

    console.error('API Response Error: ---------------------', errorResponse)

    const tokenErr = _.find(errorResponse.data.errors || [], err => err.code === 'token_expired' || err.code === 'invalid_token')

    if (tokenErr !== undefined) {
      const userType = userTypeFromRoute()

      console.error('TOKEN EXPIRED OR INVALID')

      store.dispatch({ type: TOKEN_EXPIRED })
      browserHistory.push(`/${userType}/auth/sign-in`)
    }

    return Promise.reject(errorResponse)
  })
}
