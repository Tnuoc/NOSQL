import redis
import time

# 连接本地Redis
r = redis.Redis(host="127.0.0.1", port=6379, decode_responses=True)
SID = "12403030212"
N = 1227
Q = 100

print("===== 方案甲：逐条写入（每一条单独发送SET命令） =====")
start_sequential = time.time()
for i in range(1, N + 1):
    key = f"exam:{SID}:seq:{i}"
    value = f"value-{SID}-{i}"
    r.set(key, value)
end_sequential = time.time()
time_seq = end_sequential - start_sequential
print(f"逐条写入总耗时：{time_seq:.4f} 秒")
# 校验首尾数据
check_a1 = r.get(f"exam:{SID}:seq:1")
check_a_last = r.get(f"exam:{SID}:seq:{N}")
print(f"甲校验第1条：{check_a1}")
print(f"甲校验最后一条：{check_a_last}")

print("\n===== 方案乙：Pipeline批量写入，每批最多Q=100条 =====")
start_pipe = time.time()
pipe = r.pipeline()
count = 0
for i in range(1, N + 1):
    key = f"exam:{SID}:pipe:{i}"
    value = f"value-{SID}-{i}"
    pipe.set(key, value)
    count += 1
    # 达到批次上限，提交
    if count >= Q:
        pipe.execute()
        count = 0
# 提交剩下不足一批的命令
if count > 0:
    pipe.execute()
end_pipe = time.time()
time_pipe = end_pipe - start_pipe
print(f"Pipeline批量写入总耗时：{time_pipe:.4f} 秒")
# 校验首尾数据
check_b1 = r.get(f"exam:{SID}:pipe:1")
check_b_last = r.get(f"exam:{SID}:pipe:{N}")
print(f"乙校验第1条：{check_b1}")
print(f"乙校验最后一条：{check_b_last}")