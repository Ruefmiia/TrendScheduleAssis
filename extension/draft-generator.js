const COMPONENTS = {
  zh: {
    generalOpen: ["满怀期待地来到这里，", "带着今天的好心情，", "又迎来了值得记录的一刻，", "很开心能一起见证此刻，"],
    generalFocus: [
      "准备好享受这场特别的活动，", "期待看到更多精彩的画面，", "一起关注今天的每个瞬间，", "真诚支持每一份认真与努力，", "把喜悦分享给每一位同行的人，",
      "期待今天带来新的惊喜，", "为这次相遇送上温暖的支持，", "一起感受现场满满的能量，", "认真收藏今天发生的故事，", "用热情回应这份特别的邀请，"
    ],
    generalClose: [
      "愿一切顺利又闪耀。", "让我们一起留下美好回忆。", "希望所有付出都被温柔看见。", "今天也会成为难忘的一天。", "一起为接下来的精彩加油。",
      "愿快乐和惊喜一直延续。", "期待更多值得分享的时刻。", "把真挚的心意留在今天。", "愿这段时光充满笑容与掌声。", "一起享受属于此刻的光芒。"
    ],
    celebrationOpen: [
      "为这个特别的日子送上祝福，", "今天值得用心庆祝，", "又一起走到了珍贵的纪念时刻，", "把最温暖的心意送给今天，", "很幸福能见证这个特别节点，",
      "让我们一起点亮这段纪念时光，", "属于今天的祝福已经送达，", "带着感恩回望一路的美好，", "为新的篇章认真庆祝，", "将喜悦写进这个难忘的日子，"
    ],
    celebrationClose: [
      "愿未来继续充满爱与光亮。", "愿每个愿望都能如期实现。", "期待下一段旅程更加精彩。", "愿快乐与温柔始终相伴。", "把所有美好祝愿都留给未来。",
      "愿新的岁月带来更多惊喜。", "感谢一路相伴的珍贵回忆。", "愿今天的笑容长久留存。", "一起迎接更多幸福的篇章。", "愿这份特别永远值得珍藏。"
    ]
  },
  en: {
    generalOpen: ["Arriving here with so much excitement, ", "Bringing all the positive energy today, ", "Another memorable moment is finally here, ", "So happy that we can witness this together, "],
    generalFocus: [
      "we are ready to enjoy this special event, ", "we look forward to seeing many wonderful scenes, ", "let's follow every moment of today together, ", "we sincerely support every thoughtful effort, ", "let's share this happiness with everyone here, ",
      "we cannot wait for today's new surprises, ", "we are sending warm support for this meeting, ", "let's feel all the amazing energy around us, ", "we are saving every story that happens today, ", "we answer this special invitation with enthusiasm, "
    ],
    generalClose: [
      "and may everything shine beautifully.", "and let's create lovely memories together.", "and may every effort receive the recognition it deserves.", "because today will be a day to remember.", "and we are cheering for everything still to come.",
      "and may the joy and surprises continue.", "with many more moments worth sharing ahead.", "while leaving our sincere support here today.", "and may this time be filled with smiles and applause.", "so let's enjoy the light of this very moment."
    ],
    celebrationOpen: [
      "Sending heartfelt wishes on this special day, ", "Today deserves a beautiful celebration, ", "We have reached another precious milestone together, ", "Bringing the warmest wishes to this meaningful day, ", "It is a joy to witness this special milestone, ",
      "Let's brighten this memorable occasion together, ", "All our best wishes have arrived for today, ", "Looking back with gratitude on a wonderful journey, ", "Celebrating the beginning of a brand-new chapter, ", "Writing our happiness into this unforgettable day, "
    ],
    celebrationClose: [
      "may the future stay full of love and light.", "may every wish come true at the perfect time.", "and may the next journey be even more wonderful.", "may happiness and kindness always stay close.", "with every beautiful wish saved for the future.",
      "may the coming years bring many more surprises.", "thank you for all the precious memories along the way.", "may today's smiles remain for a very long time.", "and let's welcome many more joyful chapters together.", "may this special feeling always be treasured."
    ]
  },
  ja: {
    generalOpen: ["たくさんの期待を胸に、", "今日も明るい気持ちを携えて、", "またひとつ大切な瞬間を迎え、", "この瞬間を一緒に見届けられて嬉しく、"],
    generalFocus: [
      "この特別なイベントを楽しむ準備は万全で、", "素敵な場面をもっと見られることを楽しみにし、", "今日の一瞬一瞬を一緒に見守り、", "心を込めた努力のすべてを応援し、", "この喜びをみんなと分かち合い、",
      "今日の新しい驚きに期待し、", "この出会いに温かなエールを送り、", "会場いっぱいのエネルギーを感じ、", "今日生まれる物語を大切に心へ刻み、", "特別な招待に情熱で応え、"
    ],
    generalClose: [
      "すべてが輝きながら進みますように。", "一緒に素敵な思い出を残しましょう。", "一つひとつの努力が優しく届きますように。", "今日が忘れられない一日になりますように。", "これからの素晴らしい時間も応援しています。",
      "喜びと驚きがずっと続きますように。", "分かち合いたい瞬間がもっと増えますように。", "今日ここに心からの想いを残します。", "笑顔と拍手に包まれる時間になりますように。", "今この瞬間の輝きを一緒に楽しみましょう。"
    ],
    celebrationOpen: [
      "この特別な日に心からの祝福を送り、", "今日は心を込めてお祝いしたい日で、", "また大切な記念の瞬間を一緒に迎え、", "今日という日にいちばん温かな想いを届け、", "この特別な節目を見届けられる幸せを感じ、",
      "記念の時間を一緒に明るく照らし、", "今日のための祝福をたくさん届け、", "歩んできた素敵な道のりに感謝し、", "新しい章の始まりを心から祝い、", "忘れられない今日に喜びを記し、"
    ],
    celebrationClose: [
      "未来も愛と光で満たされますように。", "すべての願いが素敵な形で叶いますように。", "次の旅がさらに素晴らしいものになりますように。", "幸せと優しさがいつもそばにありますように。", "未来へたくさんの幸せな願いを届けます。",
      "新しい日々にもっと多くの驚きがありますように。", "これまでの大切な思い出にありがとう。", "今日の笑顔がいつまでも続きますように。", "これからも幸せな章を一緒に迎えましょう。", "この特別な気持ちをずっと大切にできますように。"
    ]
  },
  ko: {
    generalOpen: ["설레는 마음을 가득 안고, ", "오늘의 좋은 에너지와 함께, ", "또 하나의 소중한 순간을 맞아, ", "이 순간을 함께 지켜볼 수 있어 기쁜 마음으로, "],
    generalFocus: [
      "이 특별한 행사를 즐길 준비를 마치고, ", "더 많은 멋진 장면을 기대하며, ", "오늘의 모든 순간을 함께 바라보고, ", "진심이 담긴 모든 노력을 응원하며, ", "이 기쁨을 함께하는 모두와 나누고, ",
      "오늘 찾아올 새로운 놀라움을 기다리며, ", "이번 만남에 따뜻한 응원을 보내고, ", "현장의 가득한 에너지를 함께 느끼며, ", "오늘 펼쳐질 이야기를 소중히 간직하고, ", "특별한 초대에 뜨거운 마음으로 응답하며, "
    ],
    generalClose: [
      "모든 일이 빛나게 펼쳐지길 바라요.", "함께 아름다운 추억을 만들어 가요.", "모든 노력이 따뜻하게 전해지길 바라요.", "오늘이 잊지 못할 하루가 되길 바라요.", "앞으로 이어질 멋진 순간도 응원할게요.",
      "기쁨과 놀라움이 계속 이어지길 바라요.", "함께 나눌 순간이 더 많아지길 바라요.", "오늘 이곳에 진심 어린 마음을 남겨요.", "웃음과 박수로 가득한 시간이 되길 바라요.", "바로 지금의 빛나는 순간을 함께 즐겨요."
    ],
    celebrationOpen: [
      "이 특별한 날에 진심으로 축하를 전하며, ", "오늘을 마음껏 축하하는 마음으로, ", "또 하나의 소중한 기념일을 함께 맞아, ", "오늘을 위해 가장 따뜻한 마음을 보내며, ", "이 특별한 이정표를 함께할 수 있어 행복한 마음으로, ",
      "기념의 시간을 함께 환하게 밝히며, ", "오늘을 위한 축복을 가득 담아, ", "지나온 아름다운 여정에 감사하며, ", "새로운 장의 시작을 진심으로 축하하고, ", "잊지 못할 오늘에 기쁨을 새기며, "
    ],
    celebrationClose: [
      "앞날도 사랑과 빛으로 가득하길 바라요.", "모든 소원이 가장 좋은 순간에 이루어지길 바라요.", "다음 여정은 더욱 멋지게 펼쳐지길 바라요.", "행복과 따뜻함이 언제나 함께하길 바라요.", "미래를 향해 모든 아름다운 축복을 보낼게요.",
      "새로운 날들에 더 많은 놀라움이 찾아오길 바라요.", "함께 쌓아 온 소중한 추억에 감사해요.", "오늘의 미소가 오래도록 이어지길 바라요.", "앞으로도 행복한 이야기를 함께 맞이해요.", "이 특별한 마음을 언제나 소중히 간직해요."
    ]
  }
};

function buildLibrary() {
  const records = [];
  for (let opener = 0; opener < 4; opener += 1) {
    for (let focus = 0; focus < 10; focus += 1) {
      for (let close = 0; close < 10; close += 1) {
        const text = {};
        for (const [language, parts] of Object.entries(COMPONENTS)) {
          text[language] = `${parts.generalOpen[opener]}${parts.generalFocus[focus]}${parts.generalClose[close]}`;
        }
        records.push({ id: `general-${records.length + 1}`, type: "general", text });
      }
    }
  }
  for (let opener = 0; opener < 10; opener += 1) {
    for (let close = 0; close < 10; close += 1) {
      const text = {};
      for (const [language, parts] of Object.entries(COMPONENTS)) {
        text[language] = `${parts.celebrationOpen[opener]}${parts.celebrationClose[close]}`;
      }
      records.push({ id: `celebration-${opener * 10 + close + 1}`, type: "celebration", text });
    }
  }
  return records;
}

export const DRAFT_LIBRARY = buildLibrary();

const cleanKeyword = (value) => String(value || "").replace(/\s+/g, " ").trim();
const cleanHashtags = (values) => [...new Set((Array.isArray(values) ? values : [])
  .map((value) => String(value || "").trim())
  .filter((value) => /^#[\p{L}\p{N}_]+$/u.test(value)))];

export function detectActivityType(task) {
  const source = [task?.title, task?.sourceText, task?.keyword, ...(task?.hashtags || [])].filter(Boolean).join(" ");
  return /birthday|anniversary|bday|born day|debut anniversary|생일|기념일|誕生日|記念日|生日|周年|纪念/i.test(source)
    ? "celebration"
    : "general";
}

export function getDraftMode(task) {
  const hashtags = cleanHashtags(task?.hashtags);
  if (!hashtags.length) return { mode: "unavailable", keyword: "", hashtags, reason: "当前任务没有有效 Hashtag" };
  const keyword = cleanKeyword(task?.keyword);
  return { mode: keyword ? "keyword-hashtag" : "hashtag-only", keyword, hashtags,
    reason: keyword ? "已识别 Keyword + Hashtag" : "未识别 Keyword，将仅使用 Hashtag" };
}

function randomSample(values, count) {
  const pool = [...values];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[target]] = [pool[target], pool[index]];
  }
  return pool.slice(0, count);
}

export function generateDrafts(task, { language = "zh", count = 5, activityType = "auto" } = {}) {
  const mode = getDraftMode(task);
  if (mode.mode === "unavailable") throw new Error(mode.reason);
  const resolvedType = activityType === "auto" ? detectActivityType(task) : activityType;
  const candidates = DRAFT_LIBRARY.filter((entry) => entry.type === resolvedType);
  const safeCount = Math.min(Math.max(Number(count) || 5, 1), candidates.length);
  const tags = [mode.keyword, ...mode.hashtags].filter(Boolean).join("\n");
  return randomSample(candidates, safeCount).map((entry) => {
    const body = entry.text[language] || entry.text.zh;
    const value = `${body}\n\n${tags}`;
    return { id: `${entry.id}-${Date.now()}`, libraryId: entry.id, text: value, used: false, charCount: [...value].length };
  });
}
