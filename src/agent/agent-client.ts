import {AgentApi, type AgentConfig, type ApiResult, type AskOptions, type ChatOptions} from './agent-api.js'

let agentApi: AgentApi | null = null

function initAgent(config: AgentConfig): AgentApi {
  if (!agentApi) {
    agentApi = new AgentApi(config)
  }

  return agentApi
}

export function clearClients(): void {
  if (agentApi) {
    agentApi.clearClients()
    agentApi = null
  }
}

export async function ask(config: AgentConfig, prompt: string, options?: AskOptions): Promise<ApiResult> {
  const api = initAgent(config)
  return api.ask(prompt, options)
}

export async function chat(
  config: AgentConfig,
  prompts: AsyncIterable<string>,
  options?: ChatOptions,
): Promise<ApiResult> {
  const api = initAgent(config)
  return api.chat(prompts, options)
}

export async function list(
  config: AgentConfig,
  options?: Pick<AskOptions, 'additionalDirectories' | 'cwd'>,
): Promise<ApiResult> {
  const api = initAgent(config)
  return api.list(options)
}

export async function run(config: AgentConfig, name: string, input?: string, options?: AskOptions): Promise<ApiResult> {
  const api = initAgent(config)
  return api.run(name, input, options)
}

export async function runCommand(
  config: AgentConfig,
  name: string,
  input?: string,
  options?: AskOptions,
): Promise<ApiResult> {
  const api = initAgent(config)
  return api.runCommand(name, input, options)
}

export async function runSkill(
  config: AgentConfig,
  name: string,
  input?: string,
  options?: AskOptions,
): Promise<ApiResult> {
  const api = initAgent(config)
  return api.runSkill(name, input, options)
}

export async function testConnection(config: AgentConfig): Promise<ApiResult> {
  const api = initAgent(config)
  return api.testConnection()
}
