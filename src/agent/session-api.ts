import {
  deleteSession,
  forkSession,
  getSessionInfo,
  getSessionMessages,
  listSessions,
  renameSession,
  tagSession,
} from '@anthropic-ai/claude-agent-sdk'

import type {ApiResult} from './agent-api.js'

export interface SessionListOptions {
  dir?: string
  limit?: number
  offset?: number
}

export interface SessionMessagesOptions {
  dir?: string
  includeSystemMessages?: boolean
  limit?: number
  offset?: number
}

export interface SessionForkOptions {
  dir?: string
  title?: string
}

/**
 * List persisted agent sessions. With `dir`, only sessions for that
 * project directory are returned; otherwise all projects are searched.
 */
export async function listAgentSessions(options?: SessionListOptions): Promise<ApiResult> {
  try {
    const sessions = await listSessions(options)
    return {data: {sessions}, success: true}
  } catch (error: unknown) {
    return {error: error instanceof Error ? error.message : String(error), success: false}
  }
}

/**
 * Read metadata for a single session. Returns success:false when the
 * session file cannot be found.
 */
export async function getAgentSessionInfo(sessionId: string, dir?: string): Promise<ApiResult> {
  try {
    const info = await getSessionInfo(sessionId, {dir})
    if (!info) {
      return {error: `Session '${sessionId}' not found`, success: false}
    }

    return {data: info, success: true}
  } catch (error: unknown) {
    return {error: error instanceof Error ? error.message : String(error), success: false}
  }
}

/**
 * Read a session's conversation messages from its transcript.
 */
export async function getAgentSessionMessages(sessionId: string, options?: SessionMessagesOptions): Promise<ApiResult> {
  try {
    const messages = await getSessionMessages(sessionId, options)
    return {data: {messages}, success: true}
  } catch (error: unknown) {
    return {error: error instanceof Error ? error.message : String(error), success: false}
  }
}

/**
 * Delete a session transcript from disk.
 */
export async function deleteAgentSession(sessionId: string, dir?: string): Promise<ApiResult> {
  try {
    await deleteSession(sessionId, {dir})
    return {data: {sessionId}, success: true}
  } catch (error: unknown) {
    return {error: error instanceof Error ? error.message : String(error), success: false}
  }
}

/**
 * Set a custom display title on a session.
 */
export async function renameAgentSession(sessionId: string, title: string, dir?: string): Promise<ApiResult> {
  try {
    await renameSession(sessionId, title, {dir})
    return {data: {sessionId, title}, success: true}
  } catch (error: unknown) {
    return {error: error instanceof Error ? error.message : String(error), success: false}
  }
}

/**
 * Set (or clear, with null) a session tag.
 */
export async function tagAgentSession(sessionId: string, tag: null | string, dir?: string): Promise<ApiResult> {
  try {
    await tagSession(sessionId, tag, {dir})
    return {data: {sessionId, tag}, success: true}
  } catch (error: unknown) {
    return {error: error instanceof Error ? error.message : String(error), success: false}
  }
}

/**
 * Fork a session into a new branch. The original session is unchanged;
 * the returned session ID is resumable independently.
 */
export async function forkAgentSession(sessionId: string, options?: SessionForkOptions): Promise<ApiResult> {
  try {
    const forked = await forkSession(sessionId, options)
    return {data: {forkedSessionId: forked.sessionId, sourceSessionId: sessionId}, success: true}
  } catch (error: unknown) {
    return {error: error instanceof Error ? error.message : String(error), success: false}
  }
}
