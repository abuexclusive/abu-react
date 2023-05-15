const Placement = 0b10;    // 2
const Update = 0b100;      // 4



// 按位 ｜ 按位 &

// 按位 ｜  有一个为1则为1
// 按位 &   两个都为1则为1
const workInProgress = { flags: 0 };
workInProgress.flags |= Placement;

console.log(workInProgress.flags);
