import type { TravelerForumData } from "@rpmf/core";
import { ancientChinaForumNodes } from "./forum/nodes.js";
import { seedReplies, seedThreads } from "./forum/seed.js";
import { curatedNotes } from "./forum/curatedNotes.js";
import type { ArchiveTopic } from "./forum/helpers.js";
import yongningFirstYear from "./forum/topics/yongning-first-year.js";
import firstHalfHour from "./forum/topics/first-half-hour.js";
import sugarRabbit from "./forum/topics/sugar-rabbit.js";
import borderDay17 from "./forum/topics/border-day17.js";
import poetryTime from "./forum/topics/poetry-time.js";
import merchantTwoBooks from "./forum/topics/merchant-two-books.js";
import countyReceipts from "./forum/topics/county-receipts.js";
import householdOrders from "./forum/topics/household-orders.js";
import emperorModule108 from "./forum/topics/emperor-module108.js";
import knowledgeAccounting from "./forum/topics/knowledge-accounting.js";
import communityGateway from "./forum/topics/community-gateway.js";
import maintenance120 from "./forum/topics/maintenance120.js";
import passwordChanged from "./forum/topics/password-changed.js";
import contractICannotRead from "./forum/topics/contract-i-cannot-read.js";
import epitaphRefusal from "./forum/topics/epitaph-refusal.js";
import grudgeLedger from "./forum/topics/grudge-ledger.js";
import tofuWidow from "./forum/topics/tofu-widow.js";
import threeVoices from "./forum/topics/three-voices.js";
import revivedLiterateServant from "./forum/topics/revived-literate-servant.js";
import deputyDiaryOne from "./forum/topics/deputy-diary-one.js";
import maintainerReactionDebate from "./forum/topics/maintainer-reaction-debate.js";
import knowledgeFirstErrand from "./forum/topics/knowledge-first-errand.js";

/**
 * 架空王朝论坛档案 · the single pack-owned forum source.
 *
 * Everything the forum UI, search, module attachments, related-thread links,
 * knowledge cards and Runtime curated retrieval read comes from here and
 * shares these stable ids. The V3 prototype archive and the founding canonical
 * seed used to be two hand-maintained corpora; they were merged in the forum
 * production migration. All content is maintainer-seed lore, not real
 * community history.
 *
 * To add a topic: create `forum/topics/<slug>.ts` with `archiveTopic()` and
 * register it in `archiveTopics` below (list order is display order).
 */
export const archiveTopics: ArchiveTopic[] = [
  yongningFirstYear,
  firstHalfHour,
  sugarRabbit,
  borderDay17,
  poetryTime,
  merchantTwoBooks,
  countyReceipts,
  householdOrders,
  emperorModule108,
  knowledgeAccounting,
  communityGateway,
  maintenance120,
  passwordChanged,
  contractICannotRead,
  epitaphRefusal,
  grudgeLedger,
  tofuWidow,
  threeVoices,
  revivedLiterateServant,
  deputyDiaryOne,
  maintainerReactionDebate,
  knowledgeFirstErrand
];

export { ancientChinaForumNodes };

export const ancientChinaForumArchive: TravelerForumData = {
  nodes: ancientChinaForumNodes,
  threads: [...archiveTopics.map((topic) => topic.thread), ...seedThreads],
  replies: [...archiveTopics.flatMap((topic) => topic.replies), ...seedReplies],
  curatedNotes
};

/** @deprecated alias kept for one migration window; use ancientChinaForumArchive. */
export const ancientChinaForumData = ancientChinaForumArchive;
