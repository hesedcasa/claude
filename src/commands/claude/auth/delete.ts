import {createAuthDeleteCommand} from '@hesed/plugin-lib'

import {AUTH_CONFIG_FILE} from '../../../agent/auth-options.js'

export default createAuthDeleteCommand({configFile: AUTH_CONFIG_FILE})
