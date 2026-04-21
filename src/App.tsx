/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, ChangeEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Volume2, X, RotateCcw, ChevronDown, List } from 'lucide-react';
import * as Hangul from 'hangul-js';

const WORD_LISTS: Record<string, { kr: string; cn: string }[]> = {
  '延世一二复习': [
    { kr: '독일', cn: '德国' },
    { kr: '캐나다', cn: '加拿大[canada]' },
    { kr: '싱가포로', cn: '新加坡[singapore]' },
    { kr: '나자냐', cn: '千层面[lasagna]' },
    { kr: '와인', cn: '红酒[wine]' },
    { kr: '뷔페', cn: '自助餐[ buffet]' },
    { kr: '피망', cn: '青椒，柿子椒[piment]' },
    { kr: '점퍼', cn: '夹克［jumper ］' },
    { kr: '니트', cn: '针织衫，毛衫［knit ］' },
    { kr: '실크', cn: '丝绸 ［ silk ］' },
    { kr: '스카프', cn: '围巾，丝巾[scarf]' },
    { kr: '스타킹', cn: '长筒袜，丝袜［stocking ］' },
    { kr: '트럭', cn: '卡车［truck ］' },
    { kr: '렌터카', cn: '租赁车［rent a car ］' },
    { kr: '휠체어', cn: '轮椅［wheelchair ］' },
    { kr: '콘도', cn: '共管式公寓[condo]' },
    { kr: '펜션', cn: '民宿[pension]' },
    { kr: '프런트', cn: '前台[front]' },
    { kr: '커튼', cn: '窗帘[cartain]' },
    { kr: '소파', cn: '沙发［sofa］' },
    { kr: '가스레인지', cn: '煤气灶[ gas range]' },
    { kr: '벤치', cn: '长椅[bench]' },
    { kr: '모니터', cn: '显示器［ monitor ］' },
    { kr: '배터리', cn: '电池[battery]' },
    { kr: '샴푸', cn: '洗发水[shampoo]' },
    { kr: '크레파스', cn: '蜡笔［crayon+pastel ］' },
    { kr: '메모', cn: '备忘录，笔记[memo]' },
    { kr: '디지털', cn: '数码，数字[ digital ]' },
    { kr: '칼슘', cn: '钙［calcium ］' },
    { kr: '댐', cn: '水坝[dam]' },
    { kr: '재즈', cn: '爵士乐［ jazz ]' },
    { kr: '서스펜스', cn: '悬疑[suspense ]' },
    { kr: '골프', cn: '高尔夫［golf ］' },
    { kr: '비자', cn: '签证[visa]' },
    { kr: '달러', cn: '美元［doller ］' },
    { kr: '아나운서', cn: '播音员［announcer ］' },
    { kr: '드라이클리닝', cn: '干洗[dry cleaning ］' },
    { kr: '전하다', cn: '转达，传达，传递［传］' },
    { kr: '녹음하다', cn: '录音' },
    { kr: '조언하다', cn: '建议，忠告，提醒［助言］' },
    { kr: '합격하다', cn: '合格，通过' },
    { kr: '칠하다', cn: '涂，刷，抹［漆］' },
    { kr: '표백하다', cn: '漂白' },
    { kr: '세탁하다', cn: '洗涤，洗衣服［洗濯］' },
    { kr: '발전하다', cn: '发展，进步' },
    { kr: '한기하다', cn: '闲暇，清闲［闲暇］' },
    { kr: '정확하다', cn: '正确' },
    { kr: '심하다', cn: '严重［甚］' },
    { kr: '가난하다', cn: '贫穷［艰难］' },
    { kr: '아마', cn: '也许，可能，恐怕，大概' },
    { kr: '주로', cn: '主要' },
    { kr: '우선', cn: '首先' },
    { kr: '점점', cn: '渐渐［点点］' },
    { kr: '숫자', cn: '数字' },
    { kr: '여부', cn: '与否，是否' },
    { kr: '종류', cn: '种类' },
    { kr: '사유', cn: '事由，理由' },
    { kr: '성별', cn: '性别' },
    { kr: '자격', cn: '资格' },
    { kr: '변경', cn: '变更' },
    { kr: '단축', cn: '缩短［短缩］' },
    { kr: '기능', cn: '功能［机能］' },
    { kr: '실내', cn: '室内' },
    { kr: '창고', cn: '仓库' },
    { kr: '책방', cn: '书店［册房］' },
    { kr: '공장', cn: '工厂' },
    { kr: '수도', cn: '首都，自来水' },
    { kr: '시설', cn: '设施' },
    { kr: '창구', cn: '窗口（银行窗口）' },
    { kr: '벽지', cn: '壁纸' },
    { kr: '천장', cn: '天花板［天障］' },
    { kr: '배치', cn: '布置［配置］' },
    { kr: '계단', cn: '台阶，楼梯［阶段］' },
    { kr: '교수', cn: '教授' },
    { kr: '직업', cn: '职业' },
    { kr: '가족', cn: '家人［家族］' },
    { kr: '노인', cn: '老人' },
    { kr: '소설가', cn: '小说家' },
    { kr: '처녀', cn: '姑娘［处女］' },
    { kr: '하객', cn: '宾客［贺客］' },
    { kr: '발신자', cn: '发件人［发信者］' },
    { kr: '무역', cn: '贸易' },
    { kr: '출장', cn: '出差' },
    { kr: '업무', cn: '业务' },
    { kr: '수단', cn: '手段，方法' },
    { kr: '조사', cn: '调查' },
    { kr: '보고', cn: '报告' },
    { kr: '계약', cn: '合同［契约］' },
    { kr: '의논하다', cn: '议论，商量' },
    { kr: '발표하다', cn: '发表，发布，演讲' },
    { kr: '신청하다', cn: '申请' },
    { kr: '접수하다', cn: '接受，受理［接受］' },
    { kr: '전쟁', cn: '战争' },
    { kr: '범죄', cn: '犯罪' },
    { kr: '통일되다', cn: '统一' },
    { kr: '국제', cn: '国际' },
    { kr: '법무부', cn: '法务部' },
    { kr: '재활용', cn: '再回收［再活用］' },
    { kr: '달력', cn: '日历［月历］' },
    { kr: '작년', cn: '去年' },
    { kr: '오전', cn: '上午［午前］' },
    { kr: '예정', cn: '预定，打算，计划［予定］' },
    { kr: '일시', cn: '一时' },
    { kr: '일정', cn: '日程' },
    { kr: '종일', cn: '整天' },
    { kr: '환절기', cn: '换季期' },
    { kr: '개나리', cn: '迎春花，连翘' },
    { kr: '벚꽃', cn: '樱花' },
    { kr: '일기예보', cn: '天气预报' },
    { kr: '장마철', cn: '梅雨季' },
    { kr: '시계', cn: '手表，钟表［时计］' },
    { kr: '양말', cn: '袜子' },
    { kr: '만년필', cn: '钢笔［万年笔］' },
    { kr: '전자사전', cn: '电子词典' },
    { kr: '가전제품', cn: '家用电器［家电产品］' },
    { kr: '치약', cn: '牙膏［齿药］' },
    { kr: '풍선', cn: '气球［风船］［日］' },
    { kr: '상자', cn: '箱子' },
    { kr: '화분', cn: '花盆' },
    { kr: '조끼', cn: '背心，坎肩［日］' },
    { kr: '초밥', cn: '寿司' },
    { kr: '포도', cn: '葡萄' },
    { kr: '귤', cn: '橘子' },
    { kr: '전병', cn: '煎饼' },
    { kr: '통조림', cn: '罐头［日］' },
    { kr: '양념', cn: '调料［药念］' },
    { kr: '주문하다', cn: '点餐，订购［注文］' },
    { kr: '영수증', cn: '收据，发票［领收证］' },
    { kr: '결제', cn: '结账，付款［决济］' },
    { kr: '할인', cn: '打折，折扣［割引］' },
    { kr: '환전하다', cn: '换钱' },
    { kr: '예금하다', cn: '存钱［预金］' },
    { kr: '여관', cn: '旅馆' },
    { kr: '민박', cn: '民宿,寄宿［民泊］' },
    { kr: '고시원', cn: '考试院' },
    { kr: '숙박', cn: '住宿［宿泊］' },
    { kr: '월세', cn: '月租［月税］' },
    { kr: '자취', cn: '自己做饭［自炊］' },
    { kr: '대여', cn: '出租［贷与］' },
    { kr: '여권', cn: '护照［旅券］' },
    { kr: '소풍', cn: '郊游［消风］' },
    { kr: '온천', cn: '温泉' },
    { kr: '전망', cn: '展望，视野，前景［展望］' },
    { kr: '풍경', cn: '风景，景色' },
    { kr: '경치', cn: '景致，景色［景致］' },
    { kr: '유적지', cn: '遗址，古迹［遗迹地］' },
    { kr: '유행', cn: '流行' },
    { kr: '도착하다', cn: '到达，抵达' },
    { kr: '자전거', cn: '自行车' },
    { kr: '운행', cn: '运行，行驶' },
    { kr: '기점', cn: '起点' },
    { kr: '노약자석', cn: '老弱病残孕专座' },
    { kr: '승강장', cn: '站台［乘降场］' },
    { kr: '차로', cn: '车道' },
    { kr: '보행자', cn: '行人［步行者］' },
    { kr: '소형车', cn: '小型车' },
    { kr: '왕복', cn: '往返［往复］' },
    { kr: '편도', cn: '单程［片道］' },
    { kr: '소화', cn: '消化' },
    { kr: '설사', cn: '腹泻' },
    { kr: '변비', cn: '便秘' },
    { kr: '두통', cn: '头痛' },
    { kr: '증세', cn: '症状' },
    { kr: '충혈', cn: '充血、眼睛（发红）' },
    { kr: '토하다', cn: '呕吐' },
    { kr: '검사', cn: '检查，检验' },
    { kr: '주사', cn: '注射' },
    { kr: '연고', cn: '软膏' },
    { kr: '수면제', cn: '安眠药［睡眠剂］' },
    { kr: '소독약', cn: '消毒药' },
    { kr: '치료', cn: '治疗' },
    { kr: '기억', cn: '记忆、记得' },
    { kr: '과로하다', cn: '过劳，劳累过度' },
    { kr: '고민하다', cn: '苦恼，烦恼，思考' },
    { kr: '걱정하다', cn: '担心，忧虑' },
    { kr: '무리하다', cn: '勉强，过度，不合理[無理]' },
  ],
};

interface SettingsState {
  krFontSize: number;
  cnFontSize: number;
  showTranslation: boolean;
  isShuffle: boolean;
}

export default function App() {
  // --- State ---
  const [currentListKey, setCurrentListKey] = useState(Object.keys(WORD_LISTS)[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isListSelectorOpen, setIsListSelectorOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('hantyper_settings');
    return saved ? JSON.parse(saved) : { krFontSize: 33, cnFontSize: 11, showTranslation: true, isShuffle: false };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // --- Memoized Words ---
  const currentList = useMemo(() => {
    const base = WORD_LISTS[currentListKey];
    if (settings.isShuffle) {
      // Seeded-shuffle or standard shuffle? Standard for now.
      return [...base].sort(() => Math.random() - 0.5);
    }
    return base;
  }, [currentListKey, settings.isShuffle]);

  const currentWord = currentList[wordIndex];

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('hantyper_settings', JSON.stringify(settings));
  }, [settings]);

  // Keep input focused for word area click
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    // No longer globally focusing on window click
    return () => {};
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // --- Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    // If perfectly matched, show success state briefly then next
    if (value === currentWord.kr) {
      setIsSuccess(true);
      setTimeout(() => {
        nextWord();
      }, 300);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      nextWord();
    }
  };

  const nextWord = () => {
    setIsSuccess(false);
    setUserInput('');
    setWordIndex((prev) => (prev + 1) % currentList.length);
  };

  const handleListChange = (key: string) => {
    setCurrentListKey(key);
    setWordIndex(0);
    setUserInput('');
    setIsListSelectorOpen(false);
  };

  const playPronunciation = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const progress = (userInput.length / currentWord.kr.length) * 100;

  return (
    <div className="relative h-screen w-full flex flex-col items-center bg-[#FDFDFD] font-sans overflow-hidden">
      {/* Hidden input for mobile keyboard support */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 -z-10 pointer-events-none"
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />

      {/* Top Bar */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <div className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">
          {wordIndex + 1} / {currentList.length}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 active:scale-95"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="w-full max-w-lg px-8 flex flex-col items-center pt-[25vh] gap-8">
        {/* Word Display */}
        <motion.div
          key={`${currentListKey}-${wordIndex}-${settings.isShuffle}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          {/* Korean Text - Jamo Granularity */}
          <div 
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-medium transition-all duration-300 cursor-text"
            style={{ fontSize: `${settings.krFontSize}px`, lineHeight: 1.2 }}
            onClick={focusInput}
          >
            {useMemo(() => {
              const targetSyllables = currentWord.kr.split('');
              const userJamoFlat = Hangul.disassemble(userInput);
              let globalJamoIndex = 0;

              return targetSyllables.map((syllable, sIdx) => {
                const targetJamos = Hangul.disassemble(syllable);
                
                return (
                  <div key={sIdx} className="flex gap-x-1">
                    {targetJamos.map((jamo, jIdx) => {
                      const userJamo = userJamoFlat[globalJamoIndex];
                      let color = "#D1D5DB"; // Default Grey
                      
                      if (userJamo !== undefined) {
                        color = (userJamo === jamo) ? "#111827" : "#EF4444";
                      }
                      
                      globalJamoIndex++;
                      
                      return (
                        <span key={jIdx} style={{ color }}>
                          {jamo}
                        </span>
                      );
                    })}
                  </div>
                );
              });
            }, [currentWord.kr, userInput, settings.krFontSize])}
          </div>

          {/* Translation */}
          <AnimatePresence>
            {settings.showTranslation && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 0.5, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 font-normal text-gray-900 overflow-hidden"
                style={{ fontSize: `${settings.cnFontSize}px` }}
              >
                {currentWord.cn}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => playPronunciation(currentWord.kr)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 active:scale-95"
            aria-label="Play Pronunciation"
          >
            <Volume2 size={20} />
          </button>
        </div>
      </div>

      {/* Progress Counter Removed from bottom */}

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 font-sans">设置</h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Word List Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">当前词库</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsListSelectorOpen(!isListSelectorOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 text-gray-700 transition-all border border-gray-100 active:scale-[0.98]"
                    >
                      <span className="text-sm font-medium">{currentListKey}</span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${isListSelectorOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isListSelectorOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                        >
                          {Object.keys(WORD_LISTS).map((key) => (
                            <button
                              key={key}
                              onClick={() => handleListChange(key)}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${currentListKey === key ? 'text-black font-bold bg-gray-50' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                              {key}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* KR Font Size */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">韩文字号</label>
                    <span className="text-sm font-bold text-gray-900">{settings.krFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={settings.krFontSize}
                    onChange={(e) => setSettings({ ...settings, krFontSize: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>

                {/* CN Font Size */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">释义字号</label>
                    <span className="text-sm font-bold text-gray-900">{settings.cnFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="48"
                    value={settings.cnFontSize}
                    onChange={(e) => setSettings({ ...settings, cnFontSize: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  {/* Show/Hide Translation */}
                  <div className="flex justify-between items-center py-1">
                    <label className="text-sm font-medium text-gray-600">显示中文释义</label>
                    <button
                      onClick={() => setSettings({ ...settings, showTranslation: !settings.showTranslation })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.showTranslation ? 'bg-black' : 'bg-gray-200'}`}
                    >
                      <motion.div
                        animate={{ x: settings.showTranslation ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Shuffle Option */}
                  <div className="flex justify-between items-center py-1">
                    <label className="text-sm font-medium text-gray-600">乱序</label>
                    <button
                      onClick={() => {
                          setSettings({ ...settings, isShuffle: !settings.isShuffle });
                          setWordIndex(0);
                          setUserInput('');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.isShuffle ? 'bg-black' : 'bg-gray-200'}`}
                    >
                      <motion.div
                        animate={{ x: settings.isShuffle ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full mt-10 py-4 bg-black text-white text-sm font-bold rounded-2xl active:scale-95 transition-transform"
              >
                保存设置
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center bg-green-500/10 z-0"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
