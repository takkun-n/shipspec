'use strict';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, Footer, TableOfContents,
} = require('docx');

const FONT = 'Meiryo UI';
const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 1080;
const CW = PAGE_W - MARGIN * 2;

const v  = (x, fb='') => (x && String(x).trim()) ? String(x).trim() : fb;
const vd = x => v(x, '　');

const BK = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const BD = { top:BK, bottom:BK, left:BK, right:BK };

const mkCell = (text, opts={}) => new TableCell({
  borders: BD,
  width: opts.w ? {size:opts.w, type:WidthType.DXA} : undefined,
  verticalAlign: VerticalAlign.CENTER,
  columnSpan: opts.span || 1,
  margins: {top:60, bottom:60, left:100, right:100},
  children: [new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [new TextRun({text:String(text), font:FONT, size:opts.sz||18, bold:!!opts.bold})]
  })]
});

const hCell   = (t,w,sp) => mkCell(t, {w, bold:true, center:true, span:sp||1});
const lCell   = (t,w)    => mkCell(t, {w, bold:true});
const secCell = (t, sp, w)  => new TableCell({
  borders:BD, columnSpan:sp,
  width: w ? {size:w, type:WidthType.DXA} : undefined,
  margins:{top:60,bottom:60,left:100,right:100},
  shading: {type:ShadingType.CLEAR, fill:'D9E2F3'},
  children:[new Paragraph({children:[new TextRun({text:t, font:FONT, size:18, bold:true})]})]
});
const totCell = (t,w)    => mkCell(t, {w, bold:true});
const row2    = (lbl,val,w1=3000,w2=6746) => new TableRow({children:[lCell(lbl,w1), mkCell(vd(val),{w:w2})]});

const para  = (text, opts={}) => new Paragraph({
  alignment: opts.right ? AlignmentType.RIGHT : AlignmentType.LEFT,
  spacing: {before:opts.before||40, after:opts.after||40},
  children: [new TextRun({text:String(text), font:FONT, size:opts.sz||20, bold:!!opts.bold})]
});
const emptyP = () => new Paragraph({children:[new TextRun({text:''})], spacing:{before:20,after:20}});
const pb     = () => new Paragraph({children:[new PageBreak()]});

const h1 = t => new Paragraph({heading:HeadingLevel.HEADING_1, spacing:{before:280,after:140}, children:[new TextRun({text:t, font:FONT, size:28, bold:true})]});
const h2 = t => new Paragraph({heading:HeadingLevel.HEADING_2, spacing:{before:200,after:100}, children:[new TextRun({text:t, font:FONT, size:24, bold:true})]});
const h3 = t => new Paragraph({heading:HeadingLevel.HEADING_3, spacing:{before:140,after:60},  children:[new TextRun({text:t, font:FONT, size:20, bold:true})]});

const emptyRows = (n, widths) => [...Array(n)].map(()=>new TableRow({children:widths.map(w=>mkCell('',{w}))}));

// フォームの行データ → Wordテーブル行に変換
function formRowsToTableRows(rows, widths) {
  const totalW = widths.reduce((a,b)=>a+b, 0);
  return (rows||[]).map(row => {
    if (row.type==='section') {
      return new TableRow({children:[secCell(v(row.label,''), widths.length, totalW)]});
    }
    if (row.type==='total') {
      return new TableRow({children:(row.cells||[]).map((c,i)=>totCell(vd(c), widths[i]||2000))});
    }
    return new TableRow({children:(row.cells||[]).map((c,i)=>mkCell(vd(c), {w:widths[i]||2000}))});
  });
}

async function generateWord(d) {
  const children = [];

  // ========== 表紙 ==========
  children.push(
    emptyP(), emptyP(), emptyP(),
    new Paragraph({alignment:AlignmentType.CENTER, spacing:{before:400,after:400},
      children:[new TextRun({text:'電　気　部　仕　様　書', font:FONT, size:52, bold:true})]}),
    emptyP(),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2500,7246], rows:[
      new TableRow({children:[lCell('船　　名',2500), mkCell(vd(d.ship_name),{w:7246,sz:24,bold:true})]}),
      new TableRow({children:[lCell('船　種',2500),   mkCell(vd(d.ship_type),{w:7246})]}),
      new TableRow({children:[lCell('工事番号',2500),  mkCell(vd(d.project_no),{w:7246})]}),
      new TableRow({children:[lCell('造 船 所',2500),  mkCell(vd(d.shipyard,'鈴木造船株式会社'),{w:7246})]}),
      new TableRow({children:[lCell('作 成 日',2500),  mkCell(vd(d.create_date),{w:7246})]}),
      new TableRow({children:[lCell('改 訂 番 号',2500),mkCell(vd(d.rev_no,'Rev.1'),{w:7246})]}),
    ]}),
    emptyP(),
    para('改 訂 履 歴',{bold:true}),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[1500,2000,1500,4746], rows:[
      new TableRow({children:[hCell('Rev.No.',1500),hCell('改 訂 日',2000),hCell('改 訂 者',1500),hCell('改 訂 内 容',4746)]}),
      new TableRow({children:[mkCell('Rev.1',{w:1500,center:true}),mkCell('',{w:2000}),mkCell('',{w:1500}),mkCell('初版作成',{w:4746})]}),
      new TableRow({children:[mkCell('Rev.2',{w:1500,center:true}),mkCell('',{w:2000}),mkCell('',{w:1500}),mkCell('',{w:4746})]}),
      new TableRow({children:[mkCell('Rev.3',{w:1500,center:true}),mkCell('',{w:2000}),mkCell('',{w:1500}),mkCell('',{w:4746})]}),
    ]}),
    pb(),
  );

  // ========== 目次 ==========
  children.push(
    new Paragraph({alignment:AlignmentType.CENTER, spacing:{before:80,after:120}, children:[new TextRun({text:'目　　　次', font:FONT, size:26, bold:true})]}),
    new TableOfContents('目次', {hyperlink:true, headingStyleRange:'1-3'}),
    emptyP(),
    para('※ Wordで開いた後、目次を右クリック →「フィールドの更新」→「目次全体を更新する」でページ番号が入ります。',{sz:16}),
    pb(),
  );

  // ========== 1. 一般 ==========
  children.push(
    h1('１．一　般'),
    h2('1-1　設計方針・法規及び規格'),
    para('本船の電気設備は、船舶安全法・同関係法令により設計・施工し、沿海区域を航行する資格をもつ船舶として、管海官庁及び船主殿の検査に合格するものとする。'),
    para('電装品は原則として日本工業規格（ＪＩＳ）品を使用する。'),
    para('尚、電気工事は関係法規及び本仕様書により行うが、機関部及び船体部との関連事項については、それぞれ主務部の仕様書によるものとする。又、無人化資格を取得する。'),
    para('電装工事についてその全部又は一部を外注する時、当該工事を施工する事業者は原則として、管海官庁より「船舶電気艤装工事事業場の施設及び能力の基準」に適合する旨の証明を受けている者とする。'),
    emptyP(),
    h2('1-2　船級'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3000,6746], rows:[row2('船　級',d.e_class,3000,6746)]}),
    emptyP(),
  );

  // ========== 2. 配線 ==========
  children.push(
    h1('２．配　線'),
    h2('2-1　電圧及び配電方式'),
    para('電気設備の電圧及び配電方式は下記の通りとする。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3746,2000,1500,2500], rows:[
      new TableRow({children:[hCell('区　分',3746),hCell('電　圧',2000),hCell('周波数',1500),hCell('配電方式',2500)]}),
      ...formRowsToTableRows(d.voltRows, [3746,2000,1500,2500]),
    ]}),
    emptyP(),
    h2('2-2　使用電線'),
    para('電線は特殊用途のものを除き、ＪＩＳ（Ｃ3410）「船用電線」を使用する。'),
    para('交流回路に用いる電線は、２芯線・３芯線又は多芯線とし、直流回路には２芯線または多芯線を使用する。'),
    para('電線の種類及び適用は回路に応じ次の通りとする。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2500,7246], rows:[
      new TableRow({children:[hCell('区　分',2500),hCell('電線種別・規格',7246)]}),
      ...formRowsToTableRows(d.wireRows, [2500,7246]),
    ]}),
    para('但し、メーカー支給ケーブルはメーカー標準とする。'),
    emptyP(),
    h2('2-3　電　路（配線工事）'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[1000,8746], rows:[
      new TableRow({children:[hCell('番号',1000),hCell('施　工　内　容',8746)]}),
      ...formRowsToTableRows(d.routeRows, [1000,8746]),
    ]}),
    emptyP(),
  );

  // ========== 3. 電源装置 ==========
  children.push(
    h1('３．電源装置'),
    h2('3-1　発　電　機'),
    h3('3-1-1　要目'),
    para('下記要目の交流発電機２台を装備し、船内各負荷に電力を供給する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3246,2900,2900], rows:[
      new TableRow({children:[hCell('項　目',3246),hCell('主発電機',2900,1),hCell('停泊用発電機',2900,1)]}),
      ...formRowsToTableRows(d.genRows, [3246,2900,2900]),
    ]}),
    emptyP(),
    h3('3-1-2　発電機の使用方法'),
    para('発電機は、下記の通り使用することを原則とする。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2500,5246,1400], rows:[
      new TableRow({children:[hCell('状　態',2500),hCell('使用発電機',5246),hCell('台　数',1400)]}),
      ...formRowsToTableRows(d.genUseRows, [2500,5246,1400]),
    ]}),
    emptyP(),
    h3('3-1-3　発電機の制御'),
    para('NO.1発電機及びNO.2発電機は並列運転可能とする。'),
    emptyP(),
    h2('3-2　蓄　電　池'),
    para('通信航海計器・船舶電話及び警報装置などの船内ＤＣ２４Ｖ負荷用電源、発電機関始動用電源並びに停泊用発電機関始動用電源として、下記要目の蓄電池を装備する。蓄電池は格納箱に納める。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2546,1700,1500,1300,1300,1400], rows:[
      new TableRow({children:[hCell('用　途',2546),hCell('メーカー',1700),hCell('形　式',1500),hCell('電　圧',1300),hCell('容　量',1300),hCell('数　量',1400)]}),
      ...formRowsToTableRows(d.battRows, [2546,1700,1500,1300,1300,1400]),
    ]}),
    emptyP(),
    h2('3-3　変　圧　器'),
    para('照明電灯・航海計器装置などの常用100V交流負荷用電源として、下記要目の変圧器を主配電盤組込で装備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2746,4000,2500], rows:[
      new TableRow({children:[hCell('項　目',2746),hCell('変圧器①',4000),hCell('変圧器②',2500)]}),
      ...formRowsToTableRows(d.transRows, [2746,4000,2500]),
    ]}),
    emptyP(),
  );

  // ========== 4. 配電装置 ==========
  children.push(
    h1('４．配電装置'),
    h2('4-1　主配電盤'),
    para('発電機の制御・陸上電源の受電並びに船内各負荷への給電を行うものとして、主配電盤１面を機関室に装備する。'),
    para('配電盤は、発電機盤・440V給電盤・集合始動器盤並びに100V及び24V給電盤で構成される鋼板製デッドフロント防滴自立形とする。'),
    para('盤内は、気中遮断器・配線用遮断器・各種計器・表示灯・接地灯・絶縁監視装置（各給電盤毎に装備する）・その他必要な計器及び機器を完備し、取扱者の保守・点検・監視・操作が容易なよう機能的に配置すると共に、できる限り軽量小形とする。'),
    para('又、配電盤の前面及び後面には保護手摺りを設けると共に、前面及び後面の床上に絶縁性敷物を設けて、取扱者の安全を図る。'),
    para('尚、設置に際しては充分な振動対策をする。'),
    para('ＡＣ４４０Ｖ・ＡＣ１００Ｖ・ＤＣ２４Ｖ絶縁低下警報を設ける。'),
    para('本盤の前面に「高電圧危険」の注意銘板を付ける。'),
    para('優先遮断装置を下記補機に対して設ける。'),
    para('　1) 空調装置（１式）'),
    para('　2) ＩＨ調理器'),
    para('優先遮断する機器の配電盤上の用途銘板には黄色の線を入れて表示する。配電盤には優先遮断表示灯及び警報ブザー等を設ける。'),
    emptyP(),
    h2('4-2　充放電盤'),
    para('船内DC 24V負荷に使用する蓄電池の充放電装置として、蓄電池充放電盤１面を操舵室内に装備する。'),
    para('充電器・配線用遮断器・ヒューズ・各種計器・表示灯・地絡灯・その他必要な計器及び機器を完備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3373,6373], rows:[
      new TableRow({children:[hCell('項　目',3373),hCell('仕　様',6373)]}),
      ...formRowsToTableRows(d.chargerRows, [3373,6373]),
    ]}),
    emptyP(),
    h2('4-3　船外給電箱'),
    para('陸上電源の受電装置として、下記要目の船外給電箱を機関室船尾入り口付近に装備し、配線用遮断器及び検相灯（明・暗）を設け、主配電盤を経て船内各負荷に給電する。'),
    para('尚、盤面には「高電圧危険」の注意銘板を取り付けて取扱者の安全を図る。'),
    para('給電容量は、AC 440V, 3φ, 150A とする。'),
    para('陸電用キャプタイヤケーブルは船主殿支給とする。'),
    emptyP(),
    h2('4-4　分　電　盤'),
    para('動力・照明電灯・通信及び航海計器並びに小型電気機器は、配線系統に応じて適当なグループにまとめ、分電盤より給電する。'),
    para('分電盤は、原則として鋼板製の防滴表面型又は埋込型とし、各支回路保護は配線用遮断器によるものとする。'),
    emptyP(),
    h2('4-5　操舵室集合分電盤'),
    para('操舵室に装備する航海灯表示盤・分電盤・電灯などのスイッチ類・その他組込み可能な機器は、原則的に集合分電盤にまとめるものとする。'),
    pb(),
  );

  // ========== 5. 動力装置 ==========
  children.push(
    h1('５．動力装置'),
    h2('5-1　補機用電動機及び加熱器'),
    para('補機用電動機及び加熱器は下記電動機要目表に示す通りとする。電動機の絶縁は原則として、Ｆ種絶縁を使用する。但し、製作所標準によりＢ又はＥ種絶縁を使用することがある。'),
    para('（機関部）'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2000,550,850,900,600,800,1500,1346,1200], rows:[
      new TableRow({children:[hCell('用　途',2000),hCell('台数',550),hCell('電圧(V)',850),hCell('出力(kW)',900),hCell('極数',600),hCell('定格',800),hCell('形　式',1500),hCell('始動方法',1346),hCell('備　考',1200)]}),
      ...formRowsToTableRows(d.motorRows, [2000,550,850,900,600,800,1500,1346,1200]),
    ]}),
    emptyP(),
    para('（甲板部）'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2000,550,850,900,600,800,1500,1346,1200], rows:[
      new TableRow({children:[hCell('用　途',2000),hCell('台数',550),hCell('電圧(V)',850),hCell('出力(kW)',900),hCell('極数',600),hCell('定格',800),hCell('形　式',1500),hCell('始動方法',1346),hCell('備　考',1200)]}),
      ...formRowsToTableRows(d.deckMotorRows, [2000,550,850,900,600,800,1500,1346,1200]),
    ]}),
    emptyP(),
    h2('5-2　管制装置'),
    para('補機用電動機の始動器類はすべて防滴形の単独又は集合式とし、単独の場合は各補機の近くに配置する。機関室集合始動器盤は防滴デッドフロント自立形とし、主配電盤に組込装備する。'),
    para('集合始動器盤組込始動器は電動機要目表に示す通りとする。又、始動器には電磁接触器・過電流継電器・表示灯・発停押しボタンなどを備え、必要に応じてタイマー・電流計などを備える。'),
    para('集合始動器盤に組込みの補機は下記の通りとする。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[4873,4873], rows:[
      new TableRow({children:[hCell('補　機　名（左）',4873),hCell('補　機　名（右）',4873)]}),
      ...formRowsToTableRows(d.starterRows, [4873,4873]),
    ]}),
    para('操舵機・主機冷却海水ポンプ・主機冷却清水ポンプ・燃料油供給ポンプ×２は低電圧釈放（ＬＶＲ）その他は低電圧保護（ＬＶＰ）方式とする。'),
    emptyP(),
    h2('5-3　非常停止装置'),
    para('燃料油ポンプ等・通風機及び空調機などの電動機は火災発生の際、一斉に遠隔停止ができるような非常停止スイッチを、機関部関係は機関室入り口付近、甲板部関係は操舵室（集合分電盤）に装備する。又、停止機器の名板を表示する。'),
    para('停止回路は給電用ブレーカーにて一括遮断方式とし、非常停止スイッチは非常の場合以外操作できないように合成樹脂にて覆いをする。'),
    para('尚、非常停止する機器の配電盤上の用途銘板には、機関部用は赤、甲板部用はピンク、ＣＯ２関係はオレンジの表示をする。'),
    emptyP(),
    h2('5-4　自動制御'),
    para('自動制御については「機関部自動化仕様書」による。'),
    pb(),
  );

  // ========== 6. 小形電気機器 ==========
  children.push(
    h1('６．小形電気機器'),
    para('下記の小形電気機器（推進装置等）を装備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2800,800,2200,3946], rows:[
      new TableRow({children:[hCell('品　名',2800),hCell('数量',800),hCell('要　目',2200),hCell('装備場所',3946)]}),
      ...formRowsToTableRows(d.smallEquipRows, [2800,800,2200,3946]),
    ]}),
    pb(),
  );

  // ========== 7. 航海灯及び信号灯 ==========
  children.push(
    h1('７．航海灯及び信号灯'),
    h2('7-1　航　海　灯'),
    para('下記要目の航海灯を装備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2246,3300,2000,2200], rows:[
      new TableRow({children:[hCell('灯　種',2246),hCell('種別・規格',3300),hCell('電　源',2000),hCell('数　量',2200)]}),
      ...formRowsToTableRows(d.navLightRows, [2246,3300,2000,2200]),
    ]}),
    emptyP(),
    h2('7-2　航海灯表示盤'),
    para('操舵室集合分電盤内に、航海灯点灯確認用の表示灯を設ける。'),
    emptyP(),
    h2('7-3　停　泊　灯'),
    para('停泊灯は航海灯と一体化した兼用灯とする。'),
    emptyP(),
    h2('7-4　標　識　灯'),
    para('各種標識灯はその目的に応じた規格のものを装備する。'),
    pb(),
  );

  // ========== 8. 照明電灯装置 ==========
  children.push(
    h1('８．照明電灯装置'),
    h2('8-1　一　般'),
    para('照明装置は、関係法規及び慣習に従い、各区画の性格及び目的に応じて適切に装備し、電球類はできる限り長寿命の蛍光灯・ＬＥＤ灯を使用する。'),
    para('暴露部の照明は、防水形を使用するものとする。'),
    emptyP(),
    h2('8-2　探　照　灯'),
    para('探照灯 1KW 室内操作型（AC 100V）を羅針儀甲板に装備する。'),
    emptyP(),
    h2('8-3　投　光　器'),
    para('下記の投光器を装備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3346,1500,1500,3400], rows:[
      new TableRow({children:[hCell('設置場所',3346),hCell('出力(W)',1500),hCell('台　数',1500),hCell('種　別',3400)]}),
      ...formRowsToTableRows(d.projectorRows, [3346,1500,1500,3400]),
    ]}),
    emptyP(),
    h2('8-4　海図台灯'),
    para('海図台灯及び夜間照明として、インバーター式蛍光灯を海図台に装備する。'),
    emptyP(),
    h2('8-5　作　業　灯'),
    para('甲板作業灯として、投光器を甲板上の適切な場所に装備する。'),
    emptyP(),
    h2('8-6　救命筏灯'),
    para('救命筏格納場所に、救命筏灯（ＤＣ２４Ｖ）を装備する。'),
    emptyP(),
    h2('8-7　昼間信号灯'),
    para('昼間信号灯（ＤＣ２４Ｖ）を羅針儀甲板に装備する。'),
    emptyP(),
    h2('8-8　一般照明電灯'),
    para('各室・通路・甲板等に一般照明電灯を装備する。詳細は別紙「一般照明電灯装備一覧表」による。'),
    para('機関室の照明器具の防爆型の適否については、爆発性雰囲気の度合いに応じ定める。'),
    emptyP(),
    h2('8-9　プラグ及びレセプタクル'),
    para('電動工具等の使用のため、甲板・機関室・居住区等の適当な場所に、ＡＣ１００Ｖのプラグ及びレセプタクルを装備する。'),
    pb(),
  );

  // ========== 9. 船内通信・航海計器装置 ==========
  children.push(
    h1('９．船内通信・航海計器装置'),
    h2('9-1　船内電話'),
    para('下記要目の船内電話装置を装備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2500,1500,5746], rows:[
      new TableRow({children:[hCell('種　別',2500),hCell('台　数',1500),hCell('設置場所',5746)]}),
      ...formRowsToTableRows(d.phoneRows, [2500,1500,5746]),
    ]}),
    para('船内電話（1：2）：操舵室（埋込）・機関室（両耳：下段）・舵機室（片耳）'),
    emptyP(),
    h2('9-2　エンジンテレグラフ'),
    para('エンジンテレグラフは主機メーカー支給とし、操舵室及び機関室に設置する。'),
    emptyP(),
    h2('9-3　舵角指示器'),
    para('シンクロ電気式舵角指示器を装備する。発信器：操舵機室（1個）、受信機：操舵室（1個）。'),
    emptyP(),
    h2('9-4　電気式主機関回転計等'),
    para('電気式主機関回転計、電気式プロペラ軸回転計、ピッチ指示計、ピッチ操作盤を操舵室に装備する。'),
    emptyP(),
    h2('9-5　レーダー'),
    para('下記要目のレーダーを装備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[1000,2746,1000,2000,1200,1800], rows:[
      new TableRow({children:[hCell('型',1000),hCell('型　式',2746),hCell('台数',1000),hCell('指示器',2000),hCell('尖頭出力',1200),hCell('空中線',1800)]}),
      ...formRowsToTableRows(d.radarRows, [1000,2746,1000,2000,1200,1800]),
    ]}),
    emptyP(),
    h2('9-6　汽　笛'),
    para('電気式汽笛（第三種）を装備する。メーカー：三信船舶電具、型式：ＥＨＶ－Ｓ１３０、電源：ＤＣ２４Ｖ。'),
    emptyP(),
    h2('9-7　ＤＧＰＳ航法装置'),
    para('ＤＧＰＳ航法装置（古野電気㈱ ＧＰ-170）及びプロッタ（ＧＤ-700MARK2/ＭＵ-152ＨＤ）を操舵室に装備する。'),
    emptyP(),
    h2('9-8　可燃性ガス検知装置'),
    para('カーゴタンクホールド部分に可燃性ガス検知装置を装備する。'),
    emptyP(),
    h2('9-9　船内指令装置'),
    para('ユニペックス製 60W アンプを操舵室に装備し、下記場所にスピーカーを設ける。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2246,1000,1000,5500], rows:[
      new TableRow({children:[hCell('設置場所',2246),hCell('台数',1000),hCell('出力(W)',1000),hCell('形　式',5500)]}),
      ...formRowsToTableRows(d.speakerRows, [2246,1000,1000,5500]),
    ]}),
    emptyP(),
    h2('9-10　ジャイロコンパス・サテライトコンパス'),
    para('ジャイロコンパス（東京計器㈱）を装備する。マスターコンパス（操舵スタンド組込）×1個、レピーター（操舵スタンド用）×1個、レピーター（方位測定用）×2個、レピーター（レーダー）×2個。'),
    para('サテライトコンパス（古野電気㈱ ＳＣ-70）をオートパイロットと組合せで装備する。'),
    emptyP(),
    h2('9-11　操舵装置（自動操舵）'),
    para('自動操舵装置（ジャイロコンパス内蔵型・東京計器㈱製）を操舵室に装備する。電源：ＡＣ440Ｖ/ＡＣ100Ｖ/ＤＣ24Ｖ。'),
    emptyP(),
    h2('9-12　風向風速計'),
    para('プロペラ式風向風速計（ＦＷ-250、ＡＣ１００Ｖ 1φ 60Hz）を装備する。'),
    emptyP(),
    h2('9-13　電動ワイパー'),
    para('操舵室前面窓に電動ワイパーを装備する。'),
    emptyP(),
    h2('9-14　磁気コンパス'),
    para('反射式磁気コンパス（大航計器製）を羅針儀甲板に装備する。照明はＤＣ２４Ｖとする。'),
    emptyP(),
    h2('9-15　テレビ'),
    para('下記のテレビを装備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2246,6000,1500], rows:[
      new TableRow({children:[hCell('設置場所',2246),hCell('仕　様',6000),hCell('台数',1500)]}),
      ...formRowsToTableRows(d.tvRows, [2246,6000,1500]),
    ]}),
    emptyP(),
    h2('9-16　一般警報装置'),
    para('一般警報ブザー（非常用）及び一般警報スイッチを操舵室・機関室・各居住区に設ける。'),
    emptyP(),
    h2('9-17　操舵警報装置'),
    para('舵障害警報・操舵室不応答警報・航路逸脱警報等を装備する。'),
    emptyP(),
    h2('9-18　自動火災探知装置'),
    para('自動火災探知装置（日本舶用エレクトロニクス㈱製）を操舵室に受信盤を装備し、各区画に検知器を設ける。'),
    emptyP(),
    h2('9-19　スピードログ'),
    para('電磁式スピードログ（古野電気㈱ ＤＳ-85）を装備する。'),
    emptyP(),
    h2('9-20　ＡＩＳ'),
    para('ＡＩＳ（自動船舶識別装置）は無線装置の章による。'),
    emptyP(),
    h2('9-21　音響測深器'),
    para('音響測深器（記録式）（古野電気㈱ ＦＥ-800、振動子取付直径500mm）を操舵室に装備する。'),
    emptyP(),
    h2('9-22　温度監視装置'),
    para('貨物温度監視装置（ムサシノ機器㈱製）を操舵室・荷役制御盤に装備する。'),
    emptyP(),
    h2('9-23　貨物タンク液面監視装置'),
    para('貨物タンク液面監視装置（ムサシノ機器㈱製）を操舵室・荷役制御盤に装備する。'),
    para('上記各機器の詳細な仕様はメーカー標準または別途仕様書による。'),
    pb(),
  );

  // ========== 10. 無線装置 ==========
  children.push(
    h1('１０．無線装置'),
    h2('10-1　衛星船舶電話'),
    para('衛星船舶電話は船主殿支給とし、所要の工事を行う。'),
    emptyP(),
    h2('10-2　簡易無線'),
    para('双方向無線電話装置（ＨＴ-649）×２台及び充電器×２台を装備する。'),
    emptyP(),
    h2('10-3　ＧＭＤＳＳ機器'),
    para('下記のＧＭＤＳＳ機器を装備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[4046,3700,2000], rows:[
      new TableRow({children:[hCell('機　器　名',4046),hCell('型　式',3700),hCell('台　数',2000)]}),
      ...formRowsToTableRows(d.gmdsRows, [4046,3700,2000]),
    ]}),
    pb(),
  );

  // ========== 11. 機関部自動化及び警報装置 ==========
  children.push(
    h1('１１．機関部自動化及び警報装置'),
    para('主機関遠隔操縦装置・機関部自動化及び警報装置一式を装備し、所要の配線を行う。'),
    para('自動化の範囲及び警報については「機関部自動化仕様書」による。'),
    pb(),
  );

  // ========== 12. 備品及び予備品 ==========
  children.push(
    h1('１２．備品及び予備品'),
    para('発電機・電動機・配電盤・各種始動器・盤関係の予備品はメーカー標準に従い運行に支障のないよう必要なものを装備し、蓄電池保守要具及びその他の備品は造船所標準による。'),
    pb(),
  );

  // ========== 13. 塗装 ==========
  children.push(
    h1('１３．塗　装'),
    para('電気機具類の塗装は、特に指示されたものの他はマンセル記号 7.5BG 7/2 を標準塗装色とする。'),
    pb(),
  );

  // ========== 14. 試験及び検査 ==========
  children.push(
    h1('１４．試験及び検査'),
    h2('14-1　製造検査'),
    para('機器の製造検査は、各機器が管海官庁の規定に合格するように行う。'),
    emptyP(),
    h2('14-2　船内試験'),
    para('船内試験として下記の試験を行い、合格を確認する。'),
    para('　1) 各種絶縁抵抗測定'),
    para('　2) 配線の接続確認'),
    para('　3) 各機器の動作確認'),
    para('　4) 発電機・配電盤・各電動機の負荷試験'),
    para('　5) 各計器及び通信機器の動作試験'),
    pb(),
  );

  // ========== 15. 図書 ==========
  children.push(
    h1('１５．図　書'),
    h2('15-1　一　般'),
    para('本船電気装置に関する図書は、管海官庁に提出するものの外、下記の通り作成・納入する。'),
    emptyP(),
    h2('15-2　図書目録'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[4746,1250,1250,1250,1250], rows:[
      new TableRow({children:[hCell('図　面　名　称',4746),hCell('承認図(船主)',1250),hCell('承認図(ＪＧ)',1250),hCell('完成図(船主)',1250),hCell('完成図(本船)',1250)]}),
      ...formRowsToTableRows(d.docListRows, [4746,1250,1250,1250,1250]),
    ]}),
    pb(),
  );

  children.push(
    emptyP(),
    emptyP(),
    para(`${vd(d.shipyard,'鈴木造船株式会社')}`,{right:true}),
    para('以上',{right:true, bold:true}),
  );

  // Document生成
  const doc = new Document({
    styles:{
      default:{document:{run:{font:FONT,size:20}}},
      paragraphStyles:[
        {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:28,bold:true,font:FONT},paragraph:{spacing:{before:280,after:140},outlineLevel:0}},
        {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:24,bold:true,font:FONT},paragraph:{spacing:{before:200,after:100},outlineLevel:1}},
        {id:'Heading3',name:'Heading 3',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:20,bold:true,font:FONT},paragraph:{spacing:{before:140,after:60},outlineLevel:2}},
      ]
    },
    sections:[{
      properties:{page:{size:{width:PAGE_W,height:PAGE_H},margin:{top:MARGIN,bottom:MARGIN,left:MARGIN,right:MARGIN}}},
      footers:{default:new Footer({children:[new Paragraph({
        alignment:AlignmentType.RIGHT,
        children:[
          new TextRun({text:`${vd(d.ship_name,'　')} `, font:FONT, size:16}),
          new TextRun({children:[PageNumber.CURRENT], font:FONT, size:16}),
          new TextRun({text:' / ', font:FONT, size:16}),
          new TextRun({children:[PageNumber.TOTAL_PAGES], font:FONT, size:16}),
        ]
      })]})},
      children,
    }],
  });
  return Packer.toBuffer(doc);
}

module.exports = {generateWord};
