import {createAuthListCommand} from '@hesed/plugin-lib'

import {AUTH_CONFIG_FILE} from '../../../agent/auth-options.js'

export default createAuthListCommand({configFile: AUTH_CONFIG_FILE})
