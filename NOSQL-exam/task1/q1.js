const SID = "12403030212";
const examDB = db.getSiblingDB("exam_"+SID);
print("=====【第1问】查询张老师、状态OPEN的课程，统计章节数量 =====");
examDB.courses.aggregate([
    { $match: { teacher: "张老师", status: "OPEN" } },
    { $project: { _id: 1, title: 1, chapterCount: {$size: "$chapters"} } }
]).pretty();
