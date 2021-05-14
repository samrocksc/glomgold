const { topic } = require("../dist/index");

const main = async () => {
  console.log("starting created?", await topic("cool").exists());
  await topic("cool").create();
  console.log("is it created?", await topic("cool").exists());
  console.log(
    "show me my topics: ",
    await topic("cool").subscriptions().list()
  );
  console.log(
    "creating subscription",
    await topic("cool").subscriptions().create("beans")
  );
  await topic("cool").delete();
  console.log(
    "is the topic deleted?",
    (await topic("cool").exists()) ? false : true
  );
};

main();
