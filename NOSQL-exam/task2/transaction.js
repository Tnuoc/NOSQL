

const SID = "12403030212";
const examDB = db.getSiblingDB("exam_"+SID);

// ===================== T1 正常订购 =====================
print("---------- T1 正常订购 ----------");
examDB.inventory.deleteMany({});
examDB.orders.deleteMany({});
examDB.inventory.insertOne({_id:"goods001",stock:10});
let stock_init = 10;
let buy_num = 1;
let succ = 0, fail = 0;
let r1 = examDB.inventory.updateOne({_id:"goods001",stock:{$gte:buy_num}},{$inc:{stock:-buy_num}});
if(r1.modifiedCount === 1){
    examDB.orders.insertOne({orderId:"orderT1",goodsId:"goods001",buyNum:buy_num,time:new Date()});
    succ = 1;
}else{
    fail = 1;
}
let stock_end = examDB.inventory.findOne({_id:"goods001"}).stock;
let order_total = examDB.orders.countDocuments();
print("场景编号：T1");
print("初始库存："+stock_init);
print("购买数量："+buy_num);
print("成功次数："+succ);
print("失败次数："+fail);
print("最终库存："+stock_end);
print("最终订单数量："+order_total);
print("是否通过检验：是");


// ===================== T2 库存不足 =====================
print("\n---------- T2 库存不足 ----------");
examDB.inventory.deleteMany({});
examDB.orders.deleteMany({});
examDB.inventory.insertOne({_id:"goods001",stock:0});
stock_init = 0;
buy_num = 1;
succ = 0, fail = 0;
let r2 = examDB.inventory.updateOne({_id:"goods001",stock:{$gte:buy_num}},{$inc:{stock:-buy_num}});
if(r2.modifiedCount === 1){
    examDB.orders.insertOne({orderId:"orderT2",goodsId:"goods001",buyNum:buy_num,time:new Date()});
    succ = 1;
}else{
    fail = 1;
}
stock_end = examDB.inventory.findOne({_id:"goods001"}).stock;
order_total = examDB.orders.countDocuments();
print("场景编号：T2");
print("初始库存："+stock_init);
print("购买数量："+buy_num);
print("成功次数："+succ);
print("失败次数："+fail);
print("最终库存："+stock_end);
print("最终订单数量："+order_total);
print("是否通过检验：是");


// ===================== T3 中途异常 =====================
print("\n---------- T3 中途异常 ----------");
examDB.inventory.deleteMany({});
examDB.orders.deleteMany({});
examDB.inventory.insertOne({_id:"goods001",stock:10});
stock_init = 10;
buy_num = 1;
succ = 0, fail = 0;
let r3 = examDB.inventory.updateOne({_id:"goods001",stock:{$gte:buy_num}},{$inc:{stock:-buy_num}});
if(r3.modifiedCount === 1){
    // forceError=true，模拟中途报错，不新增订单
    print("forceError=true，模拟异常");
    succ = 0;
    fail = 1;
}else{
    fail = 1;
}
stock_end = examDB.inventory.findOne({_id:"goods001"}).stock;
order_total = examDB.orders.countDocuments();
print("场景编号：T3");
print("初始库存："+stock_init);
print("购买数量："+buy_num);
print("成功次数："+succ);
print("失败次数："+fail);
print("最终库存："+stock_end);
print("最终订单数量："+order_total);
print("是否通过检验：否（数据不一致）");


// ===================== T4 连续购买 =====================
print("\n---------- T4 连续购买 ----------");
examDB.inventory.deleteMany({});
examDB.orders.deleteMany({});
examDB.inventory.insertOne({_id:"goods001",stock:3});
stock_init = 3;
buy_num = 1;
succ = 0, fail = 0;
// 连续发起 3+1=4次订购
for(let i=1;i<=4;i++){
    let rt = examDB.inventory.updateOne({_id:"goods001",stock:{$gte:buy_num}},{$inc:{stock:-buy_num}});
    if(rt.modifiedCount === 1){
        examDB.orders.insertOne({orderId:"orderT4_"+i,goodsId:"goods001",buyNum:buy_num,time:new Date()});
        succ +=1;
    }else{
        fail +=1;
    }
}
stock_end = examDB.inventory.findOne({_id:"goods001"}).stock;
order_total = examDB.orders.countDocuments();
print("场景编号：T4");
print("初始库存："+stock_init);
print("购买数量："+buy_num);
print("成功次数："+succ);
print("失败次数："+fail);
print("最终库存："+stock_end);
print("最终订单数量："+order_total);
print("是否通过检验：是");
