const SID = "12403030212";
const examDB = db.getSiblingDB("exam_"+SID);
print("\n=====【第4问】验证输出 =====");
let doc = examDB.courses.findOne({_id: "COURSE-" + SID + "-01"});
console.log("(1) 修改后CH02的标题：", doc.chapters.find(x=>x.chapterId==="CH02").title);
let ch03Arr = doc.chapters.filter(x=>x.chapterId === "CH03");
console.log("(2) 两次新增后CH03的数量：", ch03Arr.length);
console.log("(3) 最终章节总数：", doc.chapters.length);
console.log("(4) teacher字段：", doc.teacher, "  status字段：", doc.status);
