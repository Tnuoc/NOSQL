const SID = "12403030212";
const S = Number(SID.slice(-2));
const A = S % 3;
const examDB = db.getSiblingDB("exam_"+SID);
let newChapter = {chapterId:"CH03", title:"Redis高级操作", hours: 2 + A};

print("\n=====【第3问】第一次新增CH03 =====");
let addRes1 = examDB.courses.updateOne(
    {_id: "COURSE-" + SID + "-01"},
    {$addToSet: {chapters: newChapter}}
);
printjson(addRes1);
examDB.courses.find({_id: "COURSE-" + SID + "-01"}).pretty();

print("\n=====【第3问】第二次重复执行新增CH03（不会新增） =====");
let addRes2 = examDB.courses.updateOne(
    {_id: "COURSE-" + SID + "-01"},
    {$addToSet: {chapters: newChapter}}
);
printjson(addRes2);
examDB.courses.find({_id: "COURSE-" + SID + "-01"}).pretty();
