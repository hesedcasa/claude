import type {Config, Topic} from '@oclif/core/interfaces'

import {Help} from '@oclif/core'

// `showTopicHelp` is protected on `Help`; a subclass can still call it on `this`.
class TopicHelp extends Help {
  public async renderTopic(topic: Topic): Promise<void> {
    await this.showTopicHelp(topic)
  }
}

/**
 * Renders oclif's standard topic overview (summary + USAGE + TOPICS +
 * COMMANDS) for a topic id. `Help.showHelp` can't be reused here: a topic
 * whose id matches an actual command (as `claude:command`/`claude:skill` do,
 * since both are also index commands) resolves to that command's own
 * FLAGS/DESCRIPTION help instead of the topic overview.
 */
export async function renderTopicHelp(config: Config, topicId: string): Promise<void> {
  const topic = config.findTopic(topicId)
  if (!topic) return

  await new TopicHelp(config).renderTopic(topic)
}
