import {expect} from 'chai'

describe('agent:auth:delete', () => {
  // Auth:delete is a thin wrapper around @hesed/plugin-lib's createAuthDeleteCommand.
  // Detailed functionality is tested in plugin-lib's own test suite.
  it('exports the command', async () => {
    const {default: AuthDelete} = await import('../../../../src/commands/claude/auth/delete.js')

    expect(AuthDelete).to.be.a('function')
  })
})
