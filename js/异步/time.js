Promise.resolve().then(() => console.log(4)); // 3 // 4
process.nextTick(() => console.log(3));