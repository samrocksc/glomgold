/* eslint-disable functional/functional-parameters */
import {
  CreateSubscriptionResponse,
  EmptyResponse,
  PubSub,
  Subscription,
} from "@google-cloud/pubsub";

import { TopicResponse } from "./interfaces";

export const pubSubClient = new PubSub();

export type SubscriptionChain = {
  readonly list: typeof listSubscriptions;
  readonly create: typeof createSubscription;
};

export type Chain = {
  readonly create: typeof createTopic;
  readonly exists: typeof checkIfTopicExists;
  readonly delete: typeof deleteTopic;
  readonly subscriptions: SubscriptionChain;
};

export const createSubscription =
  (topicName: string) =>
  async (
    subscriptionName: string
  ): Promise<void | CreateSubscriptionResponse> =>
    (await checkIfTopicExists(topicName))
      ? await pubSubClient.topic(topicName).createSubscription(subscriptionName)
      : (await createTopic(topicName)) &&
        (await pubSubClient
          .topic(topicName)
          .createSubscription(subscriptionName));

export const deleteSubscription = (topicName: string): string => {
  return topicName;
};

export const listSubscriptions = async (
  topicName: string
): Promise<readonly Subscription[]> => {
  const [subscriptions] = await pubSubClient
    .topic(topicName)
    .getSubscriptions();
  return subscriptions;
};

export const deleteTopic = async (
  topicName: string
): Promise<EmptyResponse | undefined> =>
  (await checkIfTopicExists(topicName))
    ? pubSubClient.topic(topicName).delete()
    : undefined;

export const checkIfTopicExists = async (
  topicName: string
): Promise<boolean> => {
  const [topicExists] = await pubSubClient.topic(topicName).exists();
  return topicExists;
};

export const checkIfSubscriptionExists = async (
  topicName: string
): Promise<boolean> => {
  const [topicExists] = await pubSubClient.topic(topicName).exists();
  return topicExists;
};

export const createTopic = async (
  topicName: string
): Promise<void | TopicResponse> =>
  (await checkIfTopicExists(topicName))
    ? console.log("exists")
    : await pubSubClient.createTopic(topicName);

export const exists = async (topicName: string): Promise<boolean> => {
  const [topicExists] = await pubSubClient.topic(topicName).exists();
  return topicExists;
};

export const topic = (input: string): Partial<Chain> => ({
  exists: async () => checkIfTopicExists(input),
  create: async () => createTopic(input),
  delete: async () => deleteTopic(input),
  subscriptions: {
    list: async () => listSubscriptions(input),
    create: async (
      subscriptionName: string
    ): Promise<void | CreateSubscriptionResponse> =>
      createSubscription(input)(subscriptionName),
  },
});
