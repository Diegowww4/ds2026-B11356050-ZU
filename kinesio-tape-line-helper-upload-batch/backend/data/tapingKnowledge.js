const tapingKnowledge = [
  {
    id: "white-ankle-sprain-fixation",
    category: "腳踝與足部",
    subPart: "腳踝",
    tapingType: "白貼",
    title: "腳踝扭傷固定",
    purpose: "短時間固定腳踝、減少二次傷害風險",
    description: "白貼適合腳踝扭傷後短時間固定，通常需要搭配膚貼使用，不建議長時間久貼。",
    videoUrl: "https://youtu.be/Tj3HhyfAP_w?si=5E7CKjUL_Zroy56d",
    keywords: ["腳踝扭到", "腳踝扭傷", "扭到腳踝", "腳踝翻船", "ankle sprain", "腳踝固定"]
  },
  {
    id: "white-finger-jam",
    category: "手部與上肢",
    subPart: "手指",
    tapingType: "白貼",
    title: "手指挫傷 / 吃蘿蔔",
    purpose: "短時間固定受傷手指、降低碰撞時的不穩定感",
    description: "適合手指挫傷、吃蘿蔔後的短時間保護與固定。",
    videoUrl: "https://youtu.be/O3BLtpWi-3A?si=ljQR4nTPZPoU_4t7",
    keywords: ["手指吃蘿蔔", "吃蘿蔔", "手指挫傷", "手指扭傷", "jammed finger"]
  },
  {
    id: "white-thumb-fixation",
    category: "手部與上肢",
    subPart: "拇指",
    tapingType: "白貼",
    title: "拇指固定",
    purpose: "限制拇指過度活動、增加短時間穩定",
    description: "適合拇指不穩、挫傷後需要暫時固定的情況。",
    videoUrl: "https://youtu.be/TobSCbpSK3g?si=Dk4aD4ms9_fJV5sh",
    keywords: ["拇指固定", "拇指扭傷", "拇指挫傷", "thumb support"]
  },
  {
    id: "white-wrist-support",
    category: "手部與上肢",
    subPart: "手腕",
    tapingType: "白貼",
    title: "手腕穩定",
    purpose: "限制手腕過度活動、增加短時間支撐",
    description: "適合手腕需要短時間固定與活動保護時參考。",
    videoUrl: "https://youtu.be/vLVX8Am9McQ?si=kLk61yw5OZQFoZzp",
    keywords: ["手腕穩定", "手腕固定", "手腕痛", "wrist support"]
  },
  {
    id: "kinesio-calf-strain",
    category: "膝蓋與小腿",
    subPart: "小腿後側",
    tapingType: "肌貼",
    title: "小腿肌肉貼紮",
    purpose: "輔助小腿肌群活動與拉傷後支撐",
    description: "適合小腿拉傷、緊繃或運動後不適時做為輔助貼紮參考。",
    videoUrl: "https://youtube.com/shorts/McUE1MpXLao?si=HBn4kHBForda-9z6",
    keywords: ["小腿拉傷", "小腿痛", "小腿肌肉", "calf strain"]
  },
  {
    id: "kinesio-posterior-tibialis",
    category: "腳踝與足部",
    subPart: "腳踝內側",
    tapingType: "肌貼",
    title: "脛後肌貼紮",
    purpose: "輔助腳踝內側穩定與脛後肌支撐",
    description: "適合腳踝內側痛、脛後肌附近不適時參考。",
    videoUrl: "https://youtube.com/shorts/tfMcfzxRMO8?si=2aWO0wq6ZGB8ZcDS",
    keywords: ["腳踝內側痛", "脛後肌", "足弓內側痛", "posterior tibialis"]
  },
  {
    id: "kinesio-plantar-support",
    category: "腳踝與足部",
    subPart: "足底",
    tapingType: "肌貼",
    title: "足底支撐",
    purpose: "增加足底支撐與步行時穩定感",
    description: "適合足底不適、需要足弓支撐時參考。",
    videoUrl: "https://youtube.com/shorts/7mVS3dd7o2E?si=HBXy4xDiKl0ryfkP",
    keywords: ["足底痛", "足底筋膜", "足弓", "足底支撐", "plantar support"]
  },
  {
    id: "kinesio-ankle-stability",
    category: "特殊用途",
    subPart: "腳踝",
    tapingType: "肌貼",
    title: "增加腳踝穩定",
    purpose: "提升慣性腳踝扭傷時的穩定提醒",
    description: "適合慣性腳踝扭傷、腳踝容易不穩時參考。",
    videoUrl: "https://youtube.com/shorts/aN0EDbw8z-Y?si=G09xjoBOvw6bcm5p",
    keywords: ["慣性腳踝扭傷", "腳踝不穩", "增加腳踝穩定", "ankle stability"]
  },
  {
    id: "kinesio-ankle-stability-extra",
    category: "特殊用途",
    subPart: "腳踝",
    tapingType: "肌貼",
    title: "腳踝穩定補充",
    purpose: "作為腳踝穩定貼法的補充參考",
    description: "可搭配腳踝穩定需求一併參考。",
    videoUrl: "https://youtube.com/shorts/2lvcUCA7IeU?si=st1tbbEBxp3kzbHk",
    keywords: ["腳踝穩定補充", "腳踝補強", "ankle support extra"]
  },
  {
    id: "kinesio-levator-scapulae",
    category: "頭頸肩區",
    subPart: "頸肩交界",
    tapingType: "肌貼",
    title: "提肩胛肌貼紮",
    purpose: "輔助頸肩放鬆與落枕後活動提醒",
    description: "適合落枕、頸肩緊繃時參考。",
    videoUrl: "https://youtube.com/shorts/7UZO_Euy12g?si=hvSaMsop6ij_ZhVS",
    keywords: ["落枕", "脖子卡住", "提肩胛肌", "頸肩痠痛"]
  },
  {
    id: "kinesio-neck-extra",
    category: "頭頸肩區",
    subPart: "頸部",
    tapingType: "肌貼",
    title: "脖子痠痛 / 落枕補充",
    purpose: "補充頸部痠痛與落枕貼法參考",
    description: "適合頸部痠痛、落枕時做為補充教學。",
    videoUrl: "https://youtube.com/shorts/AEfFoqAmdSY?si=5ORv6jmqEqoyi5EA",
    keywords: ["脖子痠痛", "脖子痛", "頸部痠痛", "落枕補充"]
  },
  {
    id: "kinesio-thigh-strain",
    category: "髖部與大腿",
    subPart: "大腿",
    tapingType: "肌貼",
    title: "大腿拉傷",
    purpose: "輔助大腿肌肉活動與拉傷後支撐",
    description: "適合大腿拉傷、運動後緊繃不適時參考。",
    videoUrl: "https://youtube.com/shorts/VSrnONiM7lQ?si=O_IPmQe_OmqWMuk8",
    keywords: ["大腿拉傷", "大腿痛", "thigh strain"]
  },
  {
    id: "kinesio-oblique",
    category: "背部與核心",
    subPart: "腹斜肌",
    tapingType: "肌貼",
    title: "腹斜肌貼紮",
    purpose: "輔助核心側邊支撐與活動提醒",
    description: "適合腹斜肌緊繃、側腹部不適時參考。",
    videoUrl: "https://youtube.com/shorts/SubraCaPW7g?si=Qmfk9pMpWrxjVTdo",
    keywords: ["腹斜肌", "側腹痛", "核心貼紮", "oblique"]
  },
  {
    id: "kinesio-finger-jam",
    category: "手部與上肢",
    subPart: "手指",
    tapingType: "肌貼",
    title: "手指挫傷 / 吃蘿蔔",
    purpose: "提供手指挫傷後的輕度支撐與活動提醒",
    description: "適合手指吃蘿蔔、挫傷後想增加活動提醒時參考。",
    videoUrl: "https://youtube.com/shorts/oIVZpYNVV2o?si=KCj5XkO3pz0ZvGE6",
    keywords: ["手指吃蘿蔔", "手指挫傷", "手指肌貼"]
  },
  {
    id: "kinesio-thumb-jam",
    category: "手部與上肢",
    subPart: "拇指",
    tapingType: "肌貼",
    title: "拇指挫傷",
    purpose: "提供拇指挫傷後的輕度支撐與穩定提醒",
    description: "適合拇指挫傷、拇指不穩時參考。",
    videoUrl: "https://youtube.com/shorts/iI1NFBou62Q?si=wZ4TySGVfY2qwtbq",
    keywords: ["拇指挫傷", "拇指痛", "拇指肌貼"]
  },
  {
    id: "kinesio-popliteus",
    category: "膝蓋與小腿",
    subPart: "膝蓋後側",
    tapingType: "肌貼",
    title: "膕肌貼紮",
    purpose: "輔助膝蓋後側活動與穩定提醒",
    description: "適合膝蓋後側痛、膕肌不適時參考。",
    videoUrl: "https://youtube.com/shorts/U7DCaYJbwOs?si=nTTh9LPqKUjFLreK",
    keywords: ["膝蓋後側痛", "膕肌", "膝窩痛", "popliteus"]
  },
  {
    id: "kinesio-rotator-cuff-posture",
    category: "頭頸肩區",
    subPart: "肩部",
    tapingType: "肌貼",
    title: "旋轉肌群貼紮",
    purpose: "輔助肩部穩定與圓肩姿勢提醒",
    description: "適合圓肩矯正、肩部穩定需求時參考。",
    videoUrl: "https://youtube.com/shorts/zymU2_HUCBA?si=96TnvW87Lru066ub",
    keywords: ["圓肩", "旋轉肌群", "肩膀內旋", "圓肩矯正"]
  },
  {
    id: "kinesio-adductor",
    category: "髖部與大腿",
    subPart: "大腿內側",
    tapingType: "肌貼",
    title: "內收肌貼紮",
    purpose: "輔助大腿內側支撐與活動提醒",
    description: "適合內收肌緊繃、大腿內側不適時參考。",
    videoUrl: "https://youtube.com/shorts/R5_o7OcK70U?si=qY6pyiMVDpc03li8",
    keywords: ["內收肌", "大腿內側痛", "groin strain"]
  },
  {
    id: "kinesio-quadriceps",
    category: "髖部與大腿",
    subPart: "大腿前側",
    tapingType: "肌貼",
    title: "股四頭肌貼紮",
    purpose: "輔助大腿前側活動與疲勞支撐",
    description: "適合大腿前側痛、股四頭肌緊繃時參考。",
    videoUrl: "https://youtube.com/shorts/Ebr9EUC2YlI?si=xfbmHO3fAvbQpGBq",
    keywords: ["大腿前側痛", "股四頭肌", "前大腿痛", "quadriceps"]
  },
  {
    id: "kinesio-carpal-tunnel",
    category: "手部與上肢",
    subPart: "手腕",
    tapingType: "肌貼",
    title: "腕隧道症候群貼紮 / 手腕穩定",
    purpose: "提供手腕穩定與活動提醒",
    description: "適合手腕不適、腕隧道症候群輔助貼紮參考。",
    videoUrl: "https://youtube.com/shorts/Iwnh71ijjHg?si=rD1j8i9tXnPHyiPg",
    keywords: ["腕隧道", "手腕穩定", "手腕痛", "wrist kinesio"]
  },
  {
    id: "kinesio-mcl",
    category: "膝蓋與小腿",
    subPart: "膝蓋內側",
    tapingType: "肌貼",
    title: "膝蓋內側副韌帶貼紮",
    purpose: "輔助膝蓋內側穩定與活動提醒",
    description: "適合膝蓋內側不適、內側副韌帶附近支撐需求時參考。",
    videoUrl: "https://youtube.com/shorts/BsZs1oif6Tc?si=Vpgs96DqN08vIsbX",
    keywords: ["膝蓋內側痛", "內側副韌帶", "MCL", "膝內側"]
  },
  {
    id: "kinesio-tennis-elbow",
    category: "手部與上肢",
    subPart: "手肘外側",
    tapingType: "肌貼",
    title: "網球肘",
    purpose: "輔助前臂伸肌群與手肘外側不適",
    description: "適合網球肘、手肘外側痛時參考。",
    videoUrl: "https://youtube.com/shorts/HO_FZ0y86xE?si=fJlyyt8Ko_2480RD",
    keywords: ["網球肘", "手肘外側痛", "tennis elbow"]
  },
  {
    id: "kinesio-hamstring",
    category: "髖部與大腿",
    subPart: "大腿後側",
    tapingType: "肌貼",
    title: "大腿後側貼紮",
    purpose: "輔助大腿後側肌群活動與拉傷支撐",
    description: "適合大腿後側緊繃、拉傷或運動後不適時參考。",
    videoUrl: "https://youtube.com/shorts/6B2TobWetpY?si=oRu2DACkBqS71r8H",
    keywords: ["大腿後側痛", "大腿後側肌群", "hamstring", "腿後側拉傷"]
  },
  {
    id: "kinesio-forearm",
    category: "手部與上肢",
    subPart: "前臂",
    tapingType: "肌貼",
    title: "前臂肌肉貼紮",
    purpose: "輔助前臂肌群活動與疲勞支撐",
    description: "適合前臂痠痛、過度使用後不適時參考。",
    videoUrl: "https://youtube.com/shorts/NyxYjPxifgk?si=77JqPl2iIMX4Y_kI",
    keywords: ["前臂痛", "前臂肌肉", "forearm pain"]
  },
  {
    id: "kinesio-pes-anserine",
    category: "膝蓋與小腿",
    subPart: "膝蓋內側",
    tapingType: "肌貼",
    title: "鵝掌肌肌腱貼紮",
    purpose: "輔助膝內側鵝掌肌肌腱區域活動",
    description: "適合膝蓋內側偏下方不適時參考。",
    videoUrl: "https://youtube.com/shorts/x9MgmXy07lA?si=QBpMTdx4NpGqoZvo",
    keywords: ["鵝掌肌", "膝蓋內側痛", "膝內側下方痛", "pes anserine"]
  },
  {
    id: "kinesio-bruising-drainage",
    category: "特殊用途",
    subPart: "瘀青區域",
    tapingType: "肌貼",
    title: "瘀青引流貼紮",
    purpose: "作為瘀青與局部腫脹輔助引流參考",
    description: "適合局部瘀青、水腫輔助處理參考，但若嚴重腫脹或疑似重大損傷仍應就醫。",
    videoUrl: "https://youtube.com/shorts/VpQ16ELmMNk?si=6bk-Qb0X3MFIOAg3",
    keywords: ["瘀青", "引流", "水腫", "bruise drainage"]
  },
  {
    id: "kinesio-deltoid",
    category: "頭頸肩區",
    subPart: "肩膀外側",
    tapingType: "肌貼",
    title: "舉手肩膀痛 / 三角肌肌貼",
    purpose: "輔助舉手時肩膀外側不適與三角肌支撐",
    description: "適合舉手肩膀痛、肩膀外側不適時參考。",
    videoUrl: "https://youtube.com/shorts/ABDk7O2z5o8?si=V5Va7_YzlLrGKUEP",
    keywords: ["肩膀痛", "舉手肩膀痛", "三角肌", "肩外側痛"]
  },
  {
    id: "kinesio-heel-pain",
    category: "腳踝與足部",
    subPart: "腳跟",
    tapingType: "肌貼",
    title: "腳跟痛",
    purpose: "輔助腳跟與足底後側支撐",
    description: "適合腳跟痛、走路時腳跟不適時參考。",
    videoUrl: "https://youtube.com/shorts/Os7pVpNW0-s?si=6pkaCodyXz6S0Y6i",
    keywords: ["腳跟痛", "heel pain", "足跟痛"]
  },
  {
    id: "kinesio-low-back-pain",
    category: "背部與核心",
    subPart: "下背",
    tapingType: "肌貼",
    title: "下背痛",
    purpose: "輔助下背部支撐與姿勢提醒",
    description: "適合下背痛、腰部緊繃不適時參考。",
    videoUrl: "https://youtube.com/shorts/NqpK5xGie5w?si=jdOu1uPjF9kNJSbo",
    keywords: ["下背痛", "腰痛", "下背", "low back pain"]
  },
  {
    id: "kinesio-trapezius-relax",
    category: "頭頸肩區",
    subPart: "上斜方肌",
    tapingType: "肌貼",
    title: "斜方肌放鬆",
    purpose: "輔助肩頸上斜方肌放鬆與姿勢提醒",
    description: "適合肩頸緊繃、上斜方肌痠痛時參考。",
    videoUrl: "https://youtube.com/shorts/YGo2BwNPQqQ?si=XrauyhpAb0uyydqT",
    keywords: ["斜方肌", "肩頸痠痛", "肩頸緊繃", "trapezius"]
  },
  {
    id: "kinesio-shoulder-stability",
    category: "頭頸肩區",
    subPart: "肩關節",
    tapingType: "肌貼",
    title: "肩關節穩定",
    purpose: "輔助肩關節穩定與活動提醒",
    description: "適合肩關節不穩、肩膀活動時缺乏穩定感時參考。",
    videoUrl: "https://youtube.com/shorts/MQSEO5xe6QU?si=TpwMwenvEV71lWkf",
    keywords: ["肩關節穩定", "肩膀不穩", "肩關節", "shoulder stability"]
  }
];

const categoryOrder = [
  "頭頸肩區",
  "手部與上肢",
  "背部與核心",
  "髖部與大腿",
  "膝蓋與小腿",
  "腳踝與足部",
  "特殊用途"
];

module.exports = {
  tapingKnowledge,
  categoryOrder
};
