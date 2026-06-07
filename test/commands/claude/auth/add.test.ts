import {expect} from 'chai'

describe('agent auth add', () => {
  // Auth:add command is a thin wrapper around @hesed/plugin-lib's createAuthAddCommand.
  // Detailed auth functionality is tested in plugin-lib's own test suite.
  // Here we only test the Claude-specific integration points.
  it('exports correct integration points', async () => {
    const {default: AuthAdd} = await import('../../../../src/commands/claude/auth/add.js')
    const {clearClients, testConnection} = await import('../../../../src/agent/agent-client.js')

    expect(AuthAdd).to.be.a('function')
    expect(clearClients).to.be.a('function')
    expect(testConnection).to.be.a('function')
  })
})
