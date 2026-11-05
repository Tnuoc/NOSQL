import redis
import time

# 连接redis
r = redis.Redis(host="127.0.0.1", port=6379, decode_responses=True)
SID = "12403030212"
C = 2

print("========== 1. Hash 学生信息维护 ==========")
key_hash = f"exam:{SID}"
# 新建学生信息
r.hset(key_hash, mapping={
    "studentId": SID,
    "name": "张三",
    "className": "124030302",
    "courseId": f"COURSE-{SID}-01",
    "status": "learning"
})
# 修改status为completed
r.hset(key_hash, "status", "completed")
res_hash = r.hgetall(key_hash)
print("HGETALL结果：", res_hash)

print("\n========== 2. Set 已完成章节记录 ==========")
key_set = f"exam:{SID}:chap"
r.sadd(key_set, "CH01", "CH02", "CH03", "CH04")
print("全部已完成章节：", r.smembers(key_set))
print("章节总数量：", r.scard(key_set))
print("CH02是否完成：", r.sismember(key_set, "CH02"))
print("CH04是否完成：", r.sismember(key_set, "CH04"))
# 重复添加CH04，验证去重
r.sadd(key_set, "CH04")
print("重复添加CH04之后章节数量：", r.scard(key_set))

print("\n========== 3. Sorted Set 成绩排行榜 ==========")
key_z = f"exam:{SID}:score"
student_name = f"Student{SID}"
self_score = 85 + C
r.zadd(key_z, {
    student_name: self_score,
    "demo01": 90,
    "demo02": 60,
    "demo03": 60,
    "demo04": 80
})
print("分数从高到低前3名：", r.zrevrange(key_z, 0, 2, withscores=True))
print("分数从低到高前3名：", r.zrange(key_z, 0, 2, withscores=True))
rank_idx = r.zrevrank(key_z, student_name)
score = r.zscore(key_z, student_name)
print(f"本人 {student_name}，分数：{score}，名次：第{rank_idx+1}名")

print("\n========== 4. String 会话生命周期 ==========")
key_session = f"exam:{SID}:session"
r.set(key_session, "我的会话内容", ex=5)
ttl_first = r.ttl(key_session)
print("刚设置，TTL剩余：", ttl_first)
time.sleep(6)
ttl_after = r.ttl(key_session)
print("等待6秒后，TTL剩余：", ttl_after)