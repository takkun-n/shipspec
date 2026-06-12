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
      children:[new TextRun({text:'機　関　部　仕　様　書', font:FONT, size:52, bold:true})]}),
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

  // ========== 1. 一般事項 ==========
  children.push(
    h1('１．一般事項'),
    h2('(1) 機関部設計の一般方針'),
    para('本船の機関部はすべて船舶安全法・同関係法令により設計製造し、沿海区域（非国際）の資格を取得するものとする。'),
    para('製造及び据付検査等に当たり、検査官及び船主の代表者は、全工程に当たり検査を行うことができるものとする。'),
    para('又、材料製品及び水圧試験などの諸試験・検査に対する合格証明書は、複写を船主に提出するものとする。'),
    emptyP(),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3000,6746], rows:[row2('船　級',d.m_class,3000,6746)]}),
    emptyP(),
    para('使用材料は良質で十分なる強度及び耐久力を有するものとし、耐食性に十分注意を払うものとする。'),
    para('工事は懇切丁寧に行い、諸機器の配置及び諸配管装置は十分にその機能を発揮し、また取扱・保守・管理に便利なよう配慮するものとする。'),
    para('機関部は本仕様書によるが、船体部及び電気部の関連事項はそれぞれの仕様書によるものとする。'),
    para('本船は主機関として単動４サイクルディーゼル機関１基を装備し、４翼固定ピッチプロペラ１基を駆動するものとする。'),
    para('本機関はセントラル清水冷却とし、使用燃料油はＡ重油を使用する。'),
    para('本船の発電機はディーゼル駆動発電機２台を装備する。尚、並列運転可能とする。'),
    para('船首部には、電動機駆動のスラスターを装備する。'),
    para('主機関船首より増速機を介してカーゴポンプを駆動する。'),
    emptyP(),
    h2('(2) 機関部自動化の方針'),
    para('機関部の近代化・合理化を期するため、自動制御及び遠隔操作装置を装備するよう計画する。'),
    para('主機関の運転は空気式により操舵室にて運転でき、危急時には停止もできるよう設備する。'),
    para('燃料移送ポンプは各タンクに取付けたフロートスイッチにより自動発停し、各タンクに燃料を送油できるよう設備する。'),
    para('主空気圧縮機は圧力スイッチにより自動発停し、空気槽の空気量を一定に保つ。'),
    para('清水ホームポンプは圧力スイッチにより自動発停し、必要箇所に必要量の清水を供給する。'),
    emptyP(),
    h2('(3) ＪＩＳ表示製品採用の方針'),
    para('装備品は原則としてＪＩＳ表示製品とする。'),
    para('諸機関は関係規則に基づいて製造中の検査を受け、組立て完了後は検査官立会いの上運転を行った後、開放検査を施工し欠陥なきことを確認し、必要な記録を提出する。'),
    emptyP(),
    h2('(4) 試運転'),
    h3('(4)-1 主機関 (Ａ重油使用)'),
    para('「陸上試運転実施要領」に基づき、次の運転を行う。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[5373,5373], rows:[
      new TableRow({children:[hCell('負　荷',5373),hCell('運転時間',5373)]}),
      new TableRow({children:[mkCell('５０％',{w:5373,center:true}),mkCell('２０分',{w:5373,center:true})]}),
      new TableRow({children:[mkCell('７５％',{w:5373,center:true}),mkCell('２０分',{w:5373,center:true})]}),
      new TableRow({children:[mkCell('８５％',{w:5373,center:true}),mkCell('６０分',{w:5373,center:true})]}),
      new TableRow({children:[mkCell('１００％',{w:5373,center:true}),mkCell('６０分',{w:5373,center:true})]}),
      new TableRow({children:[mkCell('１１０％',{w:5373,center:true}),mkCell('２０分',{w:5373,center:true})]}),
    ]}),
    para('調速機試験・警報及び保護装置試験・最低回転数試験・船首動力取出し試験・運転後の開放検査（ただし、要求の有る場合）・その他必要とする試験を行う。'),
    emptyP(),
    h3('(4)-2 発電機用原動機 (Ａ重油使用)'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2146,2146,2146,2146,2146], rows:[
      new TableRow({children:[hCell('１／４',2146),hCell('１／２',2146),hCell('３／４',2146),hCell('４／４',2146),hCell('１１０％',2146)]}),
      new TableRow({children:[mkCell('２０分',{w:2146,center:true}),mkCell('２０分',{w:2146,center:true}),mkCell('２０分',{w:2146,center:true}),mkCell('６０分',{w:2146,center:true}),mkCell('３０分',{w:2146,center:true})]}),
    ]}),
    para('その他必要とする試験を行う。'),
    emptyP(),
    h3('(4)-3 空気圧縮機・ポンプ・油清浄機・通風機等'),
    para('空気圧縮機・ポンプ・油清浄機・通風機等については、性能試験及び定格負荷で管海官庁による連続運転試験を行う。'),
    para('諸機器は必要な工事完了後、効力試験を実施し、必要に応じて記録を提出するものとする。'),
    emptyP(),
    h3('(4)-4 海上試運転'),
    para('本船の完成後、船主及び検査官立会のもとで「船体部仕様書」及び「海上試運転実施要領」に基づき、次の海上運転を行う。'),
    para('主空気槽充気試験'),
    para('（50%・75%・85%・100%各負荷出力、燃料消費量計測（Ａ重油））'),
    para('遠隔操縦装置試験（保護装置試験）'),
    para('（連続最大回転速度にて１時間、燃料消費量計測　続航時は85％出力及び100％にても燃料消費量を計測する。）（実測）'),
    para('その他必要とする試験を行う。'),
    pb(),
  );

  // ========== 2. 主機関 ==========
  children.push(
    h1('２．主機関'),
    para('主機関の要目は下記の通りとする。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3373,6373], rows:[
      new TableRow({children:[hCell('項　目',3373),hCell('要　目',6373)]}),
      ...formRowsToTableRows(d.mainEngineRows, [3373,6373]),
    ]}),
    pb(),
  );

  // ========== 3. 機関室 ==========
  children.push(
    h1('３．機関室'),
    para('機関室は鋼板製とする。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3373,6373], rows:[
      new TableRow({children:[hCell('項　目',3373),hCell('内　容',6373)]}),
      ...formRowsToTableRows(d.engineRoomRows, [3373,6373]),
    ]}),
    pb(),
  );

  // ========== 4. 軸系及びプロペラ ==========
  children.push(
    h1('４．軸系及びプロペラ'),
    para('軸系は規定の軸系計算を行い、また、ねじり振動を検討して各部の寸法を決定する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3373,6373], rows:[
      new TableRow({children:[hCell('項　目',3373),hCell('要　目',6373)]}),
      ...formRowsToTableRows(d.shaftRows, [3373,6373]),
    ]}),
    pb(),
  );

  // ========== 5. 発電装置 ==========
  children.push(
    h1('５．発電装置'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3373,6373], rows:[
      new TableRow({children:[hCell('項　目',3373),hCell('要　目',6373)]}),
      ...formRowsToTableRows(d.genSetRows, [3373,6373]),
    ]}),
    pb(),
  );

  // ========== 6. 通風装置 ==========
  children.push(
    h1('６．通風装置'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3373,6373], rows:[
      new TableRow({children:[hCell('項　目',3373),hCell('要　目',6373)]}),
      ...formRowsToTableRows(d.ventRows, [3373,6373]),
    ]}),
    pb(),
  );

  // ========== 7. 清浄機・油水分離器その他 ==========
  children.push(
    h1('７．清浄機・油水分離器その他'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[3373,6373], rows:[
      new TableRow({children:[hCell('項　目',3373),hCell('要　目',6373)]}),
      ...formRowsToTableRows(d.purifierRows, [3373,6373]),
    ]}),
    pb(),
  );

  // ========== 8. ポンプ ==========
  children.push(
    h1('８．ポンプ'),
    para('機関室内には下記のポンプを装備する。'),
    new Table({width:{size:CW,type:WidthType.DXA}, columnWidths:[2200,3200,1400,1146,1800], rows:[
      new TableRow({children:[hCell('ポンプ名称',2200),hCell('型式・容量',3200),hCell('駆動方法',1400),hCell('台数',1146),hCell('メーカー',1800)]}),
      ...formRowsToTableRows(d.pumpRows, [2200,3200,1400,1146,1800]),
    ]}),
    emptyP(),
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
