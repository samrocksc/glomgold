import {
  Topic,
  TopicMetadata,
} from "@google-cloud/pubsub";

export type TopicResponse = readonly [Topic, TopicMetadata];