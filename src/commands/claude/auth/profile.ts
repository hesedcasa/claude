import {createAuthProfileCommand} from '@hesed/plugin-lib'

import {AUTH_CONFIG_FILE} from '../../../agent/auth-options.js'

export default createAuthProfileCommand({configFile: AUTH_CONFIG_FILE})
