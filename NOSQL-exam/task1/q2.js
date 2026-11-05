const SID = "12403030212";
const S = Number(SID.slice(-2));
const examDB = db.getSiblingDB("exam_"+SID);
print("\n=====【第2问】局部更新CH02标题 =====");
let updateRes = examDB.courses.updateOne(
    {_id: "COURSE-" + SID + "-01"},
    {$set: {"chapters.$[elem].title": "Redis基础与应用-" + S}},
    {arrayFilters: [{"elem.chapterId": "CH02"}]}
);
printjson(updateRes);
examDB.courses.find({_id: "COURSE-" + SID + "-01"}).pretty();
