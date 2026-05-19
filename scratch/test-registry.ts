
import { getTopicFromFS } from "../lib/content-registry";

async function test() {
  try {
    const topic = await getTopicFromFS("dsa", "cpp-fundamentals");
    if (topic) {
      console.log(`Topic: ${topic.id} found with ${topic.lessons.length} lessons.`);
      console.log("Sample Lessons:", topic.lessons.slice(0, 5).map(l => l.id));
    } else {
      console.log("Topic dsa/cpp-fundamentals not found!");
    }
  } catch (err) {
    console.error(err);
  }
}

test();
