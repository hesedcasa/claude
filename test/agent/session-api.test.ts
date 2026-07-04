/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import {type SinonStub, stub} from 'sinon'

describe('session-api', () => {
  let sessionApi: any
  let deleteSessionStub: SinonStub
  let forkSessionStub: SinonStub
  let getSessionInfoStub: SinonStub
  let getSessionMessagesStub: SinonStub
  let listSessionsStub: SinonStub
  let renameSessionStub: SinonStub
  let tagSessionStub: SinonStub

  beforeEach(async () => {
    deleteSessionStub = stub().resolves()
    forkSessionStub = stub().resolves({sessionId: 'fork-1'})
    getSessionInfoStub = stub().resolves({sessionId: 'sess-1', summary: 'Analyze auth'})
    getSessionMessagesStub = stub().resolves([{type: 'user', uuid: 'u1'}])
    listSessionsStub = stub().resolves([{sessionId: 'sess-1', summary: 'Analyze auth'}])
    renameSessionStub = stub().resolves()
    tagSessionStub = stub().resolves()

    sessionApi = await esmock('../../src/agent/session-api.js', {
      '@anthropic-ai/claude-agent-sdk': {
        deleteSession: deleteSessionStub,
        forkSession: forkSessionStub,
        getSessionInfo: getSessionInfoStub,
        getSessionMessages: getSessionMessagesStub,
        listSessions: listSessionsStub,
        renameSession: renameSessionStub,
        tagSession: tagSessionStub,
      },
    })
  })

  describe('listAgentSessions', () => {
    it('returns the sessions from the SDK', async () => {
      const result = await sessionApi.listAgentSessions({dir: '/code/repo-a', limit: 5})

      expect(result.success).to.be.true
      expect(result.data.sessions).to.deep.equal([{sessionId: 'sess-1', summary: 'Analyze auth'}])
      expect(listSessionsStub.firstCall.args[0]).to.deep.equal({dir: '/code/repo-a', limit: 5})
    })

    it('returns an error result when the SDK throws', async () => {
      listSessionsStub.rejects(new Error('boom'))

      const result = await sessionApi.listAgentSessions()

      expect(result.success).to.be.false
      expect(result.error).to.equal('boom')
    })
  })

  describe('getAgentSessionInfo', () => {
    it('returns session metadata', async () => {
      const result = await sessionApi.getAgentSessionInfo('sess-1', '/code/repo-a')

      expect(result.success).to.be.true
      expect(result.data).to.deep.equal({sessionId: 'sess-1', summary: 'Analyze auth'})
      expect(getSessionInfoStub.firstCall.args).to.deep.equal(['sess-1', {dir: '/code/repo-a'}])
    })

    it('returns an error result when the session is not found', async () => {
      getSessionInfoStub.resolves()

      const result = await sessionApi.getAgentSessionInfo('missing')

      expect(result.success).to.be.false
      expect(result.error).to.equal("Session 'missing' not found")
    })
  })

  describe('getAgentSessionMessages', () => {
    it('returns the session messages', async () => {
      const result = await sessionApi.getAgentSessionMessages('sess-1', {limit: 10})

      expect(result.success).to.be.true
      expect(result.data.messages).to.deep.equal([{type: 'user', uuid: 'u1'}])
      expect(getSessionMessagesStub.firstCall.args).to.deep.equal(['sess-1', {limit: 10}])
    })

    it('returns an error result when the SDK throws', async () => {
      getSessionMessagesStub.rejects(new Error('bad transcript'))

      const result = await sessionApi.getAgentSessionMessages('sess-1')

      expect(result.success).to.be.false
      expect(result.error).to.equal('bad transcript')
    })
  })

  describe('deleteAgentSession', () => {
    it('deletes the session', async () => {
      const result = await sessionApi.deleteAgentSession('sess-1', '/code/repo-a')

      expect(result.success).to.be.true
      expect(deleteSessionStub.firstCall.args).to.deep.equal(['sess-1', {dir: '/code/repo-a'}])
    })

    it('returns an error result when the SDK throws', async () => {
      deleteSessionStub.rejects(new Error('not found'))

      const result = await sessionApi.deleteAgentSession('sess-1')

      expect(result.success).to.be.false
      expect(result.error).to.equal('not found')
    })
  })

  describe('renameAgentSession', () => {
    it('renames the session', async () => {
      const result = await sessionApi.renameAgentSession('sess-1', 'Auth refactor')

      expect(result.success).to.be.true
      expect(result.data).to.deep.equal({sessionId: 'sess-1', title: 'Auth refactor'})
      expect(renameSessionStub.firstCall.args[1]).to.equal('Auth refactor')
    })

    it('returns an error result when the SDK throws', async () => {
      renameSessionStub.rejects(new Error('nope'))

      const result = await sessionApi.renameAgentSession('sess-1', 'x')

      expect(result.success).to.be.false
      expect(result.error).to.equal('nope')
    })
  })

  describe('tagAgentSession', () => {
    it('sets a tag on the session', async () => {
      const result = await sessionApi.tagAgentSession('sess-1', 'auth-work')

      expect(result.success).to.be.true
      expect(tagSessionStub.firstCall.args[1]).to.equal('auth-work')
    })

    it('clears the tag when passed null', async () => {
      const result = await sessionApi.tagAgentSession('sess-1', null)

      expect(result.success).to.be.true
      expect(tagSessionStub.firstCall.args[1]).to.equal(null)
    })
  })

  describe('forkAgentSession', () => {
    it('returns the forked session id', async () => {
      const result = await sessionApi.forkAgentSession('sess-1', {title: 'OAuth2 spike'})

      expect(result.success).to.be.true
      expect(result.data).to.deep.equal({forkedSessionId: 'fork-1', sourceSessionId: 'sess-1'})
      expect(forkSessionStub.firstCall.args).to.deep.equal(['sess-1', {title: 'OAuth2 spike'}])
    })

    it('returns an error result when the SDK throws', async () => {
      forkSessionStub.rejects(new Error('cannot fork'))

      const result = await sessionApi.forkAgentSession('sess-1')

      expect(result.success).to.be.false
      expect(result.error).to.equal('cannot fork')
    })
  })
})
