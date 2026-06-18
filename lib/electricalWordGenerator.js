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
