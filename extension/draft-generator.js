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
    ],
    praise: [
      "今天也好看到犯规。", "这个状态真的绝了。", "一出现就移不开眼。", "这张脸也太优越了吧。",
      "随手一截都是神图。", "今天又被颜值暴击了。", "怎么可以这么好看。", "镜头真的很爱你。",
      "这氛围感谁懂啊。", "越看越让人心动。", "今天的造型太适合你了。", "每个角度都很好看。",
      "笑起来真的太甜了。", "不笑的时候也好酷。", "气质这一块拿捏住了。", "一出场就自带焦点。",
      "今天也在稳定发光。", "状态好到想反复看。", "这份松弛感太迷人了。", "自信的样子真的很帅。",
      "认真起来特别有魅力。", "专注的样子太加分了。", "对待工作的态度真好。", "每次都能感受到用心。",
      "这股认真劲真的很圈粉。", "温柔但很有自己的坚持。", "一直都在认真回应爱。", "真诚永远是最打动人的。",
      "你的态度就是最好的答案。", "清醒又坚定的样子很酷。", "有想法也有行动力。", "这种分寸感真的很舒服。",
      "永远会被你的真诚打动。", "越了解越觉得你值得。", "喜欢你从来不只是因为脸。", "好看又靠谱谁能不爱。",
      "今天也比昨天更喜欢你。", "真的会一直为你心动。", "你只管发光就好。", "这样的你值得所有喜欢。"
    ],
    morePraise: [
      "今天这套真的好适合你。", "这个发型也太加分了。", "侧脸好看到不讲道理。", "这张照片我能看一整天。",
      "今天的妆造完全赢了。", "这个眼神谁顶得住啊。", "生图都这么能打。", "近看更好看了怎么办。",
      "这身材比例是真实的吗。", "简简单单也这么出众。", "这个颜色衬得你太好看了。", "好喜欢今天这份清爽感。",
      "这套造型必须多发几张。", "每次换造型都有新惊喜。", "天生就该站在镜头前。", "今天是漂亮得很具体的一天。",
      "这个回眸我先收藏了。", "氛围感直接拉满。", "连背影都这么有故事感。", "今天也是毫无死角的一天。",
      "一开口就让人想认真听。", "现场有你真的很不一样。", "你一笑整个画面都亮了。", "这份鲜活感太珍贵了。",
      "看到你心情都会变好。", "光是站在那里就很有存在感。", "今天的你看起来好快乐。", "喜欢这种自在发光的感觉。",
      "你的快乐真的会感染人。", "这瞬间值得反复回味。", "看到这一幕嘴角就下不来。", "有你在气氛一下就对了。",
      "这种小表情真的很可爱。", "今天的每一帧都很有生命力。", "不经意的瞬间最让人心动。", "怎么连走路都这么有感觉。",
      "一眼就能看到你的光。", "你的存在本身就很特别。", "这个瞬间太有电影感了。", "今天也贡献了好多心动瞬间。",
      "舞台交给你就让人很放心。", "每一次出现都有在进步。", "你真的很会抓住镜头。", "表现力又更上一层了。",
      "稳稳完成的样子太帅了。", "认真准备的人就是会发光。", "看得出背后下了很多功夫。", "每次都不会辜负期待。",
      "你对细节真的很上心。", "从容背后都是认真准备。", "业务能力一直都很在线。", "现场反应也太稳了吧。",
      "越是重要的场合越能扛住。", "每一步都走得很踏实。", "你总能把事情做到最好。", "努力被看见的感觉真好。",
      "这次又交出了漂亮答卷。", "你的成长真的有迹可循。", "一直在突破自己的样子很酷。", "今天也为你的表现骄傲。",
      "不敷衍每一次机会的你真棒。", "愿意倾听这一点真的很难得。", "有自己的原则真的很帅。", "温柔不是软弱而是力量。",
      "你一直都知道自己要什么。", "面对问题的态度很值得学习。", "不慌不忙的样子很有力量。", "真诚表达自己就已经很勇敢。",
      "有边界也有温度真的很好。", "尊重别人也坚持自己。", "越是细节越能看出人品。", "你的善意总是藏在小事里。",
      "一直保持初心真的不容易。", "你值得被认真对待。", "喜欢你坦坦荡荡的样子。", "柔软又强大说的就是你。",
      "谢谢你一直这么真诚。", "这样的态度会走得很远。", "你给人的安全感很珍贵。", "做自己时的你最有魅力。",
      "今天也想认真夸夸你。", "见到你就是今天的好心情。", "喜欢你的理由又多了一个。", "每次出现都让人很期待。",
      "有你分享日常真的很好。", "希望你每天都能这么开心。", "你的好值得被更多人看到。", "能喜欢你是一件很幸福的事。",
      "每次见面都还是会心动。", "今天也有好好接收到你的爱。", "会一直珍惜和你相遇的缘分。", "你带来的快乐都是真实的。",
      "不用完美也一样很喜欢你。", "慢慢走我们会一直陪着你。", "想把今天所有的夸奖都给你。", "你的每一种样子都很珍贵。",
      "希望所有掌声都奔向你。", "你值得更大更亮的舞台。", "继续做让自己开心的事吧。", "未来也请一直闪闪发光。"
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
    ],
    praise: [
      "Looking way too good today.", "This energy is everything.", "Impossible to look away.", "How can someone look this good?",
      "Every screenshot is a masterpiece.", "That visual hit me all over again.", "Seriously, how are you this pretty?", "The camera absolutely loves you.",
      "The vibe is unreal.", "More captivating every time.", "This look was made for you.", "Every angle is your best angle.",
      "That smile is way too sweet.", "You look so cool without even trying.", "The elegance is effortless.", "You own the room the second you arrive.",
      "Shining as brightly as ever.", "This look deserves endless replays.", "That effortless confidence is so attractive.", "Confidence looks so good on you.",
      "You are extra charming when focused.", "That focused look is everything.", "Love the way you approach your work.", "Your care always comes through.",
      "That dedication is so admirable.", "Gentle, but always true to yourself.", "You always return love with sincerity.", "Sincerity will always be your charm.",
      "Your attitude says it all.", "Clear-minded and steady looks good on you.", "You have the vision and the drive.", "Your sense of balance is so refreshing.",
      "Your sincerity gets me every time.", "The more I know you, the more worthy you feel.", "It was never just about the visuals.", "Good-looking and dependable? Unfair.",
      "Somehow I like you even more today.", "Still falling for you every day.", "Just keep shining your way.", "You deserve every bit of love."
    ],
    morePraise: [
      "This look suits you so well.", "This hairstyle adds so much.", "That side profile is unreal.", "I could look at this photo all day.",
      "Today's styling is a total win.", "How is anyone surviving that gaze?", "Even the raw photos look amazing.", "Somehow you look even better up close.",
      "Are those proportions even real?", "You stand out without even trying.", "That color looks perfect on you.", "I love this fresh look on you.",
      "We need more photos of this outfit.", "Every new look brings a new surprise.", "You were born for the camera.", "You look especially beautiful today.",
      "Saving that look back immediately.", "The atmosphere is off the charts.", "Even your silhouette tells a story.", "Not a single bad angle today.",
      "The moment you speak, I want to listen.", "Your presence changes the whole room.", "Your smile lights up the entire frame.", "That lively energy is so precious.",
      "Seeing you instantly lifts my mood.", "You have such a strong presence.", "You look so happy today.", "I love seeing you shine so freely.",
      "Your happiness is genuinely contagious.", "This moment deserves endless replays.", "I cannot stop smiling at this.", "Everything feels right when you are there.",
      "That little expression is too cute.", "Every frame feels so alive today.", "The candid moments hit the hardest.", "Even the way you walk has a vibe.",
      "Your light stands out right away.", "Your presence is special on its own.", "This moment feels straight out of a movie.", "So many heart-fluttering moments today.",
      "I always trust you with the stage.", "You improve every single time.", "You really know how to find the camera.", "Your performance keeps getting stronger.",
      "You looked so cool handling it smoothly.", "People who prepare well always shine.", "Your hard work behind this really shows.", "You never let our expectations down.",
      "You pay such close attention to detail.", "That calmness comes from preparation.", "Your skills are always on point.", "You handled the live moment so well.",
      "You show up strongest when it matters.", "Every step you take feels grounded.", "You always give things your very best.", "It feels so good to see your effort noticed.",
      "Another beautiful result from you.", "Your growth is clear in every step.", "Watching you push your limits is so cool.", "Proud of your performance again today.",
      "I love that you never take a chance lightly.", "Your willingness to listen is so rare.", "Having your own principles is so cool.", "Your gentleness is a kind of strength.",
      "You have always known what you want.", "The way you face problems is admirable.", "Your calmness carries so much strength.", "Speaking honestly already takes courage.",
      "You have boundaries and warmth.", "You respect others without losing yourself.", "Character always shows in the details.", "Your kindness lives in the little things.",
      "Holding on to your original heart is not easy.", "You deserve to be treated with care.", "I love how open and honest you are.", "Soft and strong describes you perfectly.",
      "Thank you for always being sincere.", "That attitude will take you far.", "The reassurance you give is precious.", "You are most charming when being yourself.",
      "I really want to praise you today.", "Seeing you made my whole day better.", "I found another reason to like you.", "Your every appearance feels exciting.",
      "I love that you share your days with us.", "I hope you feel this happy every day.", "More people deserve to see your goodness.", "Liking you is such a happy thing.",
      "My heart still skips every time we meet.", "I felt all the love you sent today.", "I will always treasure that we found each other.", "The joy you bring is completely real.",
      "You do not need to be perfect to be loved.", "Take your time; we will stay beside you.", "I want to give you every compliment today.", "Every side of you is precious.",
      "I hope every round of applause finds you.", "You deserve a bigger and brighter stage.", "Keep doing what makes you happy.", "Please keep shining in the days ahead."
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
    ],
    praise: [
      "今日もかっこよすぎる。", "今日のコンディション最高。", "登場した瞬間から目が離せない。", "どうしてこんなに素敵なの？",
      "どこを切り取っても最高。", "今日もビジュアルにやられた。", "こんなに綺麗でいいの？", "カメラに愛されすぎてる。",
      "この雰囲気、本当に好き。", "見るたびにときめく。", "今日のスタイル、似合いすぎ。", "どの角度から見ても素敵。",
      "笑顔が本当に可愛すぎる。", "クールな表情も最高。", "この上品さ、さすがです。", "登場しただけで主役になる。",
      "今日も安定に輝いてる。", "何度でも見たくなる。", "自然体なところが魅力的。", "自信に満ちた姿がかっこいい。",
      "真剣な姿が本当に素敵。", "集中している姿に惹かれる。", "仕事への向き合い方が好き。", "いつも丁寧さが伝わってくる。",
      "その努力家なところが好き。", "優しくて芯がある人。", "いつも愛に真心で応えてくれる。", "やっぱり誠実さが一番響く。",
      "その姿勢が何よりの答え。", "冷静で芯のある姿が素敵。", "考えるだけでなく行動できる人。", "この距離感が心地いい。",
      "その誠実さに何度も惹かれる。", "知るほどに好きになる。", "好きな理由は顔だけじゃない。", "素敵で頼れるなんて最強。",
      "今日も昨日より好き。", "何度でもときめいてしまう。", "あなたらしく輝いていてね。", "こんなあなたが愛されますように。"
    ],
    morePraise: [
      "今日の衣装、本当に似合ってる。", "この髪型、すごく素敵。", "横顔が綺麗すぎる。", "この写真、一日中見ていられる。",
      "今日のスタイリングは大優勝。", "その眼差しは反則です。", "無加工でもこんなに綺麗。", "近くで見るともっと素敵。",
      "スタイルが良すぎてびっくり。", "シンプルでもこんなに目立つ。", "この色、本当によく似合う。", "今日の爽やかな雰囲気が好き。",
      "この衣装でもっと写真が見たい。", "新しい姿を見るたびに驚かされる。", "カメラの前に立つために生まれた人。", "今日は特に綺麗が伝わってくる。",
      "今の振り返り、保存しました。", "雰囲気が最高すぎる。", "後ろ姿まで物語みたい。", "今日もどこから見ても完璧。",
      "話し始めると真剣に聞きたくなる。", "あなたがいるだけで空気が変わる。", "笑った瞬間、画面まで明るくなった。", "その生き生きした姿が大好き。",
      "見るだけで気分が明るくなる。", "立っているだけで存在感がある。", "今日はとても幸せそう。", "自然に輝く姿が本当に好き。",
      "その幸せがこちらまで伝わる。", "何度も見返したい瞬間。", "これを見ると笑顔が止まらない。", "あなたがいると雰囲気が完成する。",
      "その小さな表情が可愛すぎる。", "今日の一瞬一瞬が生き生きしてる。", "何気ない瞬間ほど心に刺さる。", "歩いているだけでも絵になる。",
      "ひと目であなたの輝きがわかる。", "存在そのものが特別。", "まるで映画のワンシーン。", "今日もときめく瞬間がいっぱい。",
      "ステージを任せると安心できる。", "登場するたびに成長してる。", "カメラの捉え方が本当に上手。", "表現力がまた上がってる。",
      "落ち着いてやり遂げる姿がかっこいい。", "準備を重ねた人はやっぱり輝く。", "見えない努力がちゃんと伝わる。", "いつも期待に応えてくれる。",
      "細かいところまで本当に丁寧。", "その余裕は準備の積み重ねだね。", "実力がいつも安定してる。", "その場での対応もさすが。",
      "大切な場面ほど強さを見せてくれる。", "一歩ずつ着実に進んでる。", "いつも最後までやり切ってくれる。", "努力が届いているのが嬉しい。",
      "今回も素敵な結果を見せてくれた。", "成長の軌跡がしっかり見える。", "自分を超え続ける姿がかっこいい。", "今日の姿も誇らしい。",
      "一つひとつの機会を大切にする人。", "耳を傾けられるところが素敵。", "自分の信念がある人はかっこいい。", "優しさは弱さではなく強さ。",
      "自分の望むものをちゃんと知ってる。", "問題に向き合う姿勢を尊敬する。", "落ち着いた姿に強さを感じる。", "正直に伝えること自体が勇気。",
      "境界線も温かさも持っている。", "相手を尊重しながら自分も貫く。", "人柄は小さなところに表れる。", "あなたの優しさは細部に宿ってる。",
      "初心を持ち続けるのは簡単じゃない。", "あなたは大切にされるべき人。", "まっすぐなところが好き。", "柔らかくて強い、まさにあなた。",
      "いつも誠実でいてくれてありがとう。", "その姿勢ならきっと遠くまで行ける。", "あなたがくれる安心感は特別。", "自分らしくいる時が一番魅力的。",
      "今日はちゃんとあなたを褒めたい。", "会えただけで今日がいい日になった。", "好きな理由がまた一つ増えた。", "姿を見るたびにわくわくする。",
      "日常を分けてくれるのが嬉しい。", "毎日こんな笑顔でいられますように。", "あなたの良さがもっと届いてほしい。", "好きでいられることが幸せ。",
      "会うたびにやっぱりときめく。", "今日も愛をちゃんと受け取ったよ。", "出会えた縁をずっと大切にしたい。", "あなたがくれる幸せは本物。",
      "完璧じゃなくてもずっと好き。", "ゆっくりでいい、ずっとそばにいるよ。", "今日の褒め言葉を全部届けたい。", "どんなあなたも大切。",
      "すべての拍手があなたに届きますように。", "もっと大きく輝く舞台が似合う。", "これからも好きなことをしてね。", "未来もずっと輝いていてね。"
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
    ],
    praise: [
      "오늘도 너무 잘생겼어.", "오늘 컨디션 진짜 최고야.", "등장하자마자 눈을 뗄 수 없어.", "어떻게 이렇게 예쁠 수 있지?",
      "아무렇게나 캡처해도 레전드야.", "오늘도 비주얼에 제대로 치였다.", "진짜 너무 예쁜 거 아니야?", "카메라가 정말 사랑하는 얼굴이야.",
      "이 분위기 진짜 너무 좋아.", "볼수록 더 설레.", "오늘 스타일링 너무 잘 어울려.", "어느 각도에서 봐도 예뻐.",
      "웃는 모습이 진짜 너무 달콤해.", "무표정일 때는 또 너무 멋있어.", "분위기까지 완벽해.", "등장만 해도 시선 집중이야.",
      "오늘도 한결같이 빛나네.", "계속 돌려보고 싶은 모습이야.", "자연스러운 여유가 너무 매력적이야.", "자신감 있는 모습이 정말 멋져.",
      "진지할 때 더 매력적이야.", "집중하는 모습이 너무 좋아.", "일을 대하는 태도가 참 좋아.", "매번 진심이 느껴져.",
      "그 성실함이 정말 좋아.", "다정하지만 자기 기준은 확실해.", "언제나 사랑에 진심으로 답해 줘.", "진정성은 늘 가장 큰 매력이야.",
      "그 태도 자체가 최고의 답이야.", "차분하고 단단한 모습이 멋져.", "생각을 행동으로 옮기는 사람이야.", "이런 균형감이 정말 편안해.",
      "그 진심에 매번 마음이 움직여.", "알수록 더 좋은 사람이야.", "좋아하는 이유가 얼굴만은 아니야.", "잘생기고 믿음직하다니 완벽해.",
      "오늘은 어제보다 더 좋아.", "매일 또 반하게 돼.", "그냥 너답게 계속 빛나 줘.", "이런 너라서 사랑받아 마땅해."
    ],
    morePraise: [
      "오늘 이 착장 진짜 잘 어울려.", "이 헤어스타일 너무 잘 어울려.", "옆모습이 말도 안 되게 예뻐.", "이 사진 하루 종일 볼 수 있어.",
      "오늘 스타일링 완전 대성공이야.", "이 눈빛을 어떻게 버텨.", "보정 없는 사진도 이렇게 예뻐.", "가까이서 보니 더 예쁘잖아.",
      "비율이 진짜 현실 맞아?", "꾸미지 않아도 이렇게 눈에 띄어.", "이 색이 정말 잘 받는다.", "오늘의 청량한 느낌 너무 좋아.",
      "이 착장 사진 더 많이 보고 싶어.", "새로운 스타일마다 놀라게 돼.", "카메라 앞에 서기 위해 태어난 사람.", "오늘은 유난히 더 아름다워.",
      "방금 그 뒤돌아보기 저장했어.", "분위기가 제대로 미쳤다.", "뒷모습까지 이야기가 있어.", "오늘도 어느 각도든 완벽해.",
      "말을 시작하면 집중해서 듣게 돼.", "네가 있으면 현장 분위기가 달라져.", "웃는 순간 화면이 다 밝아졌어.", "그 생생한 에너지가 정말 소중해.",
      "너를 보면 기분이 좋아져.", "그냥 서 있기만 해도 존재감이 커.", "오늘 정말 행복해 보여.", "편안하게 빛나는 모습이 좋아.",
      "네 행복은 진짜 전염돼.", "계속 다시 보고 싶은 순간이야.", "이 장면만 보면 미소가 멈추지 않아.", "네가 있으니 분위기가 완성됐어.",
      "그 작은 표정이 너무 귀여워.", "오늘의 모든 장면이 생생해.", "무심한 순간이 더 설레게 해.", "걷기만 해도 분위기가 있네.",
      "한눈에 네 빛이 보여.", "존재 자체가 특별해.", "영화 속 한 장면 같아.", "오늘도 설레는 순간이 가득해.",
      "무대를 맡기면 늘 믿음이 가.", "나올 때마다 더 성장해 있어.", "카메라를 정말 잘 찾아.", "표현력이 또 한 단계 늘었어.",
      "여유롭게 해내는 모습이 멋져.", "준비한 사람은 역시 빛나.", "뒤에서 얼마나 노력했는지 보여.", "언제나 기대를 저버리지 않아.",
      "디테일까지 정말 세심해.", "그 여유는 철저한 준비에서 나오지.", "실력이 늘 안정적이야.", "현장 대처도 정말 잘했어.",
      "중요한 순간일수록 더 강해.", "한 걸음씩 참 단단하게 나아가.", "언제나 최선을 다해 완성해.", "노력이 인정받는 걸 보니 좋아.",
      "이번에도 멋진 결과를 보여 줬어.", "성장해 온 길이 분명히 보여.", "계속 자신을 뛰어넘는 모습이 멋져.", "오늘의 모습도 정말 자랑스러워.",
      "모든 기회를 소중히 여기는 사람이야.", "귀 기울일 줄 아는 점이 참 좋아.", "자기 원칙이 있는 사람은 멋져.", "다정함은 약함이 아니라 힘이야.",
      "자기가 원하는 걸 늘 알고 있어.", "문제를 대하는 태도가 본받을 만해.", "침착한 모습에서 힘이 느껴져.", "솔직하게 말하는 것만으로도 용기야.",
      "경계도 있고 온기도 있어.", "남을 존중하면서 자신도 지켜.", "작은 부분에서 인품이 보여.", "네 다정함은 사소한 곳에 숨어 있어.",
      "초심을 지키는 건 쉬운 일이 아니야.", "너는 소중히 대할 가치가 있어.", "솔직하고 당당한 모습이 좋아.", "부드럽고 강한 사람, 바로 너야.",
      "늘 진심으로 대해 줘서 고마워.", "그 태도라면 오래 멀리 갈 거야.", "네가 주는 안정감은 정말 소중해.", "너답게 있을 때 가장 매력적이야.",
      "오늘은 제대로 칭찬해 주고 싶어.", "너를 봐서 오늘 기분이 좋아졌어.", "좋아할 이유가 또 하나 늘었어.", "등장할 때마다 늘 기대돼.",
      "일상을 나눠 줘서 참 좋아.", "매일 이렇게 행복했으면 좋겠어.", "네 좋은 점을 더 많은 사람이 알길.", "너를 좋아할 수 있어 행복해.",
      "만날 때마다 여전히 설레.", "오늘도 네 사랑을 잘 받았어.", "우리가 만난 인연을 오래 아낄게.", "네가 주는 행복은 진짜야.",
      "완벽하지 않아도 그대로 좋아.", "천천히 가도 돼, 계속 곁에 있을게.", "오늘의 모든 칭찬을 네게 주고 싶어.", "네 모든 모습이 소중해.",
      "모든 박수가 네게 향하길.", "더 크고 빛나는 무대가 어울려.", "계속 네가 행복한 일을 해 줘.", "앞으로도 계속 반짝여 줘."
    ]
  }
};

function buildLibrary() {
  const records = [];
  let generalCount = 0;
  generalTemplates:
  for (let opener = 0; opener < 4; opener += 1) {
    for (let focus = 0; focus < 9; focus += 1) {
      for (let close = 0; close < 10; close += 1) {
        if (generalCount >= 260) break generalTemplates;
        const text = {};
        for (const [language, parts] of Object.entries(COMPONENTS)) {
          text[language] = `${parts.generalOpen[opener]}${parts.generalFocus[focus]}${parts.generalClose[close]}`;
        }
        generalCount += 1;
        records.push({ id: `general-${generalCount}`, type: "general", text });
      }
    }
  }
  for (let index = 0; index < 140; index += 1) {
    const text = {};
    for (const [language, parts] of Object.entries(COMPONENTS)) {
      text[language] = [...parts.praise, ...parts.morePraise][index];
    }
    records.push({ id: `praise-${index + 1}`, type: "general", text });
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
