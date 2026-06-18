import { useState } from 'react';
import { S, EditTable, FG, Input, Sel, TA, Card, Row } from './FormUI';

const SECS = ['表紙','一般・配線','電源装置','配電装置','動力装置','小形電気機器・航海灯','照明電灯装置','船内通信・計器①','船内通信・計器②','無線装置','自動化・備品・塗装','試験・図書','確認・生成'];

// ===== 初期データ =====
const initGenRows = [
  {type:'normal',cells:['種別','三相交流同期発電機','三相交流同期発電機']},
  {type:'normal',cells:['出力','','']},
  {type:'normal',cells:['電圧','ＡＣ４４０Ｖ','ＡＣ４４０Ｖ']},
  {type:'normal',cells:['周波数','60Hz','60Hz']},
  {type:'normal',cells:['相数','3φ','3φ']},
  {type:'normal',cells:['力率','0.8','0.8']},
  {type:'normal',cells:['回転数','','']},
  {type:'normal',cells:['絶縁種類','Ｆ種','Ｆ種']},
  {type:'normal',cells:['メーカー','','']},
  {type:'normal',cells:['型式','','']},
  {type:'normal',cells:['台数','２台','１台']},
];

const initGenUseRows = [
  {type:'normal',cells:['航海中','ＮＯ．１発電機又はＮＯ．２発電機','１']},
  {type:'normal',cells:['港内（停泊外）','ＮＯ．１発電機及びＮＯ．２発電機','２']},
  {type:'normal',cells:['揚荷役','ＮＯ．１発電機又はＮＯ．２発電機','１']},
  {type:'normal',cells:['停泊','停泊用発電機','１']},
];

const initBattRows = [
  {type:'normal',cells:['船内負荷用','ＧＳユアサ','２１０Ｈ５２','ＤＣ２４Ｖ','２００ＡＨ','２群']},
  {type:'normal',cells:['発電機関始動用','ＧＳユアサ','２１０Ｈ５２','ＤＣ２４Ｖ','２００ＡＨ','２群']},
  {type:'normal',cells:['停泊用発電機関始動用','ＧＳユアサ','１２０Ｈ','ＤＣ２４Ｖ','１２０ＡＨ','１群']},
];

const initTransRows = [
  {type:'normal',cells:['形式','乾式自冷形','乾式自冷形']},
  {type:'normal',cells:['出力','10KVA×3（30KVA）','10KVA×6（60KVA）']},
  {type:'normal',cells:['電圧','一次440V／二次105V・60Hz','440V／220V']},
  {type:'normal',cells:['相数','3φ','3φ']},
  {type:'normal',cells:['絶縁種類','Ｂ種','Ｂ種']},
  {type:'normal',cells:['台数','３台','３台']},
  {type:'normal',cells:['組込場所','機関室','機関室']},
];

const initVoltRows = [
  {type:'normal',cells:['１）動力装置','ＡＣ ４４０Ｖ','60Hz','絶縁三相三線式']},
  {type:'normal',cells:['','ＡＣ ２２０Ｖ','60Hz','絶縁三相三線式']},
  {type:'normal',cells:['２）照明装置及び小型電気機器','ＡＣ １００Ｖ','60Hz','絶縁単相二線式']},
  {type:'normal',cells:['３）通信及び航海計器装置','ＡＣ ４４０Ｖ','60Hz','絶縁三相三線式']},
  {type:'normal',cells:['','ＡＣ １００Ｖ','60Hz','絶縁単相二線式']},
  {type:'normal',cells:['','ＤＣ ２４Ｖ','－','絶縁二線式']},
];

const initWireRows = [
  {type:'normal',cells:['１）発電機','0.6/1KV ＥＰゴム絶縁ビニルシースあじろがい装ケーブル（ＴＰＹＣ・ＭＰＹＣ・ＤＰＹＣ）']},
  {type:'normal',cells:['２）電動機・電熱器等','0.6/1KV ＥＰゴム絶縁ビニルシースあじろがい装ケーブル（ＴＰＹＣ）']},
  {type:'normal',cells:['３）照明灯・航海灯・蓄電池','0.6/1KV ＥＰゴム絶縁ビニルシースあじろがい装ケーブル（ＴＰＹＣ）（ＤＰＹＣ）（ＤＰＹ）（ＴＰＹ）']},
  {type:'normal',cells:['４）通信機器','250V ＥＰゴム絶縁ビニルシースあじろがい装ケーブル（ＴＰＹＣ）（ＤＰＹＣ）（ＤＰＹ）（ＴＰＹ）']},
  {type:'normal',cells:['５）移動灯具','250V ＥＰゴム絶縁クロロプレンキャブタイヤコード（ＤＰＹ）']},
  {type:'normal',cells:['６）前部マスト・レーダーマスト','ビニールがい装ケーブル（ＤＰＹＣＹ）']},
];

const initRouteRows = [
  {type:'normal',cells:['1','一般に主要電路のケーブルは金属ハンガーで布設し、できる限り背後の金属構造物への塗装を妨げないように布設する。']},
  {type:'normal',cells:['2','居住区内張内木壁部に直接布設する。']},
  {type:'normal',cells:['3','暴露部の押さえバンドはＳＵＳとする。']},
  {type:'normal',cells:['4','すべてのケーブルは金属性帯金又は結束バンドで固定する。']},
  {type:'normal',cells:['5','ケーブルが水密隔壁又は甲板を貫通する場合には、電線貫通金物又は防水形電線貫通箱を使用する。']},
  {type:'normal',cells:['6','ケーブルは、水・油又は温水管などの高温部から特に注意してできる限り離して布設し、機械的損傷を受け易い場所に布設する場合は、鋼板・鋼管又は防水形フレキシブルチューブを使用してケーブルを保護する。']},
  {type:'normal',cells:['7','船尾から船首への配線は甲板上に布設する。']},
  {type:'normal',cells:['8','電線の先端処理は十分に留意して行い、電線の接続及び分岐は接続箱又は端子箱などで行う。']},
  {type:'normal',cells:['9','接地工事は十分な施工をする。']},
  {type:'normal',cells:['10','各分電盤に予備のブレーカーを設備する。']},
];

// 4章: 配電装置
const initChargerRows = [
  {type:'normal',cells:['形式','シリコン整流器式']},
  {type:'normal',cells:['入力電圧','ＡＣ 440Ｖ 1φ 60Hz']},
  {type:'normal',cells:['出力電圧','ＤＣ 22Ｖ〜32Ｖ']},
  {type:'normal',cells:['充電電流','40Ａ']},
  {type:'normal',cells:['充電方式','浮動充電']},
];

// 5章: 動力装置 - 電動機要目表（機関部）
// 注：用途名は文字化けのため空欄。原本（p.10）を参照して入力してください。
const initMotorRows = [
  {type:'normal',cells:['主空気圧縮機','2','440','5.5','6','連続','全閉外扇','全電圧','AST']},
  {type:'normal',cells:['消防兼ビルジポンプ','2','440','22','4','連続','全閉外扇','スターデルタ','LSW,RSW']},
  {type:'normal',cells:['','1','440','11','4','連続','全閉外扇','スターデルタ','LSW,LVR']},
  {type:'normal',cells:['','1','440','11','6','連続','全閉外扇','スターデルタ','LSW']},
  {type:'normal',cells:['','1','440','0.4','4','連続','全閉外扇','','']},
  {type:'normal',cells:['','2','440','0.75','6','連続','全閉外扇','','AST,ES2,LSW']},
  {type:'normal',cells:['','2','440','0.4','6','連続','全閉外扇','','LSW,LVR,ES2']},
  {type:'normal',cells:['','1','440','0.4','6','連続','全閉外扇','','LSW,LVR,ES2']},
  {type:'normal',cells:['','1','440','15','6','連続','全閉外扇','スターデルタ','LSW']},
  {type:'normal',cells:['','1','440','0.4','4','連続','全閉外扇','','ES2']},
  {type:'normal',cells:['ヒーター','1','440','10','','連続','','','ES2']},
  {type:'normal',cells:['','1','440','0.4','4','連続','全閉外扇','','ES2']},
  {type:'normal',cells:['','2','440','11','4','連続','全閉外扇','','']},
  {type:'normal',cells:['','2','440','3.7','4','連続','全閉外扇','','']},
  {type:'normal',cells:['','2','200','0.4','2','連続','全閉外扇','防爆保護','AST']},
  {type:'normal',cells:['ターニングモーター','1','440','0.4','','連続','全閉外扇','全電圧','RSW']},
  {type:'normal',cells:['','1','440','0.8','4','30分','','','RSW']},
  {type:'normal',cells:['機関室通風機','2','440','3.7','4','連続','可逆','','ES2']},
];

// 5章: 動力装置 - 電動機要目表（甲板部）
// 注：用途名は文字化けのため空欄。原本（p.11）を参照して入力してください。
const initDeckMotorRows = [
  {type:'normal',cells:['','1','440','37','4','連続','全閉外扇','スターデルタ','RSW']},
  {type:'normal',cells:['','1','440','30','4','連続','全閉外扇','スターデルタ','RSW']},
  {type:'normal',cells:['操舵機','2','440','5.5','4','連続','全閉外扇','全電圧','LVR']},
  {type:'normal',cells:['','4','200','1.9','4','連続','全閉外扇','','']},
  {type:'normal',cells:['サイドスラスター','1','440','205','4','30分','','スターデルタ','RSW']},
  {type:'normal',cells:['','1','440','0.75','4','連続','全閉外扇','全電圧','RSW']},
  {type:'normal',cells:['','1','440','0.2','4','連続','全閉外扇','','ES3']},
  {type:'normal',cells:['','1','440','0.4','4','連続','全閉外扇','','Es1']},
  {type:'normal',cells:['','1','440','2.2','6','連続','全閉外扇','','RSW,ES1']},
  {type:'normal',cells:['ガスフリーファン','2','440','30','2','連続','全閉外扇','コンペラ式','ES1,RSW']},
  {type:'normal',cells:['残油ポンプ','2','440','22','4','連続','全閉外扇','スターデルタ','ES2']},
  {type:'normal',cells:['','1','440','0.4','4','連続','全閉外扇','全電圧','ES2']},
  {type:'normal',cells:['','1','220','5.5','','連続','全閉外扇','全電圧','PT.']},
  {type:'normal',cells:['','1','440','0.4','4','連続','全閉外扇','全電圧','ES2']},
  {type:'normal',cells:['バラストポンプ','1','440','22','4','連続','全閉外扇','スターデルタ','']},
  {type:'normal',cells:['','1','440','3','','','','','ES2']},
];

// 5章: 集合始動器盤組込補機リスト
const initStarterRows = [
  {type:'normal',cells:['１）主空気圧縮機×２','１１）機関室通風機×２']},
  {type:'normal',cells:['２）消防兼ビルジポンプ×２','１２）スラッジポンプ']},
  {type:'normal',cells:['３）冷却海水ポンプ','１３）ガスフリーファン×２']},
  {type:'normal',cells:['４）低温冷却清水ポンプ×２','１４）残油ポンプ×２']},
  {type:'normal',cells:['５）高温冷却清水ポンプ×２','１５）バラストポンプ']},
  {type:'normal',cells:['６）予備潤滑油ポンプ','１６）ポンプ室排風機']},
  {type:'normal',cells:['','']},
  {type:'normal',cells:['','']},
];

// 6章: 小形電気機器
const initSmallEquipRows = [
  {type:'normal',cells:['電気冷凍冷蔵庫','２','320Ｌ','賄室']},
  {type:'normal',cells:['電気冷凍冷蔵庫','１','320Ｌ','食堂']},
  {type:'normal',cells:['電気冷蔵庫','４','100Ｌ','船長・機関長室・一航・一機']},
  {type:'normal',cells:['電気冷蔵庫','４','47Ｌ','船員室']},
  {type:'normal',cells:['電子レンジ','１','','賄室']},
  {type:'normal',cells:['','','','']},
  {type:'normal',cells:['','','','']},
  {type:'normal',cells:['','','','']},
  {type:'normal',cells:['','','','']},
  {type:'normal',cells:['','','','']},
];

// 7章: 航海灯
const initNavLightRows = [
  {type:'normal',cells:['マスト灯','ＬＥＤ 第１種２灯式（12W）','ＡＣ／ＤＣ２４Ｖ','２箇']},
  {type:'normal',cells:['げん灯','ＬＥＤ 第１種２灯式（12W）','ＡＣ／ＤＣ２４Ｖ','１対']},
  {type:'normal',cells:['船尾灯','ＬＥＤ 第１種２灯式（12W）','ＡＣ／ＤＣ２４Ｖ','１箇']},
  {type:'normal',cells:['停泊灯','ＬＥＤ 第１種１灯式（12W）','ＡＣ／ＤＣ２４Ｖ','各１箇（船首・船尾）']},
  {type:'normal',cells:['標識灯（紅灯）','ＬＥＤ（12W）','ＡＣ／ＤＣ２４Ｖ','２個（レーダーマスト）']},
];

// 8章: 投光器
const initProjectorRows = [
  {type:'normal',cells:['操舵室頂部（両舷）','700','２台','ＬＥＤ灯']},
  {type:'normal',cells:['船首マスト（両舷）','700','２台','ＬＥＤ灯']},
  {type:'normal',cells:['船首マスト（首向）','300','１台','ＬＥＤ灯']},
  {type:'normal',cells:['機関室','300','１台','ＬＥＤ灯']},
];

// 9章: 船内電話
const initPhoneRows = [
  {type:'normal',cells:['一般','10台','居室(8)・食堂・荷役監視室兼事務室']},
  {type:'normal',cells:['両耳防雑','1台','機関室（機関監視室）']},
  {type:'normal',cells:['埋込','1台','操舵室']},
];

// 9章: レーダー
const initRadarRows = [
  {type:'normal',cells:['No.1','FAR-2028-MARK-2','１台','19インチカラー液晶','25KW','XN-20CF']},
  {type:'normal',cells:['No.2','FAR-2028-MARK-2BB/MU-192HD','１台','19インチカラー液晶','25KW','XN-20CF']},
];

// 9章: 船内指令装置スピーカー
const initSpeakerRows = [
  {type:'normal',cells:['羅針儀甲板','１個','25W','防水固定形（室内操作）トランペット型']},
  {type:'normal',cells:['船首部','２個','10W','防水形 移動形']},
  {type:'normal',cells:['船尾部','１個','10W','防水形']},
  {type:'normal',cells:['操舵室','１個','3W','非防水形 埋込型 トークバック用']},
  {type:'normal',cells:['食堂','１個','3W','非防水形 埋込型']},
  {type:'normal',cells:['内部通路','各１個','3W','非防水形 キャビン型']},
];

// 9章: テレビ
const initTvRows = [
  {type:'normal',cells:['食堂','40インチ カラーTV及びVTR（BS内蔵）','１台']},
  {type:'normal',cells:['居室（８室）','24インチ カラーTV及びVTR（BS内蔵）','各１台']},
];

// 10章: GMDSS機器
const initGmdsRows = [
  {type:'normal',cells:['ＡＩＳ（自動船舶識別装置）','ＦＡ-170（古野電気㈱）','１台']},
  {type:'normal',cells:['双方向無線電話装置（トランシーバー）充電器付','ＨＸ600ＵＦＪＩＳ','８台']},
  {type:'normal',cells:['レーダートランスポンダ','Tron AIS-SART','１台']},
  {type:'normal',cells:['衛星ＥＰＩＲＢ','Tron60AIS','１台']},
  {type:'normal',cells:['ナブテックス受信機','ＮＸ-900（古野電気㈱）','１台']},
];

// 15章: 図書目録
const initDocListRows = [
  {type:'normal',cells:['電気部建造仕様書','３','３','１','１']},
  {type:'normal',cells:['主電路系統図','３','３','１','１']},
  {type:'normal',cells:['','','','','']},
  {type:'normal',cells:['','','','','']},
  {type:'normal',cells:['','','','','']},
  {type:'normal',cells:['','','','','']},
  {type:'normal',cells:['','','','','']},
  {type:'normal',cells:['','','','','']},
  {type:'normal',cells:['','','','','']},
  {type:'normal',cells:['','','','','']},
];

export default function ElectricalApp() {
  const [cur, setCur] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show:false, msg:'', err:false });
  const showToast = (msg, err=false) => { setToast({show:true,msg,err}); setTimeout(()=>setToast(t=>({...t,show:false})),4000); };
  const goto = (n) => { setCur(n); window.scrollTo(0,0); };

  const [d, setD] = useState({
    ship_name:'', ship_type:'油タンカー', project_no:'', create_date:'', rev_no:'Rev.1', shipyard:'鈴木造船株式会社',
    e_class:'ＪＧ',
  });
  const set = (k) => (v) => setD(prev => ({...prev, [k]:v}));

  const [genRows, setGenRows] = useState(initGenRows);
  const [genUseRows, setGenUseRows] = useState(initGenUseRows);
  const [battRows, setBattRows] = useState(initBattRows);
  const [transRows, setTransRows] = useState(initTransRows);
  const [voltRows, setVoltRows] = useState(initVoltRows);
  const [wireRows, setWireRows] = useState(initWireRows);
  const [routeRows, setRouteRows] = useState(initRouteRows);
  const [chargerRows, setChargerRows] = useState(initChargerRows);
  const [motorRows, setMotorRows] = useState(initMotorRows);
  const [deckMotorRows, setDeckMotorRows] = useState(initDeckMotorRows);
  const [starterRows, setStarterRows] = useState(initStarterRows);
  const [smallEquipRows, setSmallEquipRows] = useState(initSmallEquipRows);
  const [navLightRows, setNavLightRows] = useState(initNavLightRows);
  const [projectorRows, setProjectorRows] = useState(initProjectorRows);
  const [phoneRows, setPhoneRows] = useState(initPhoneRows);
  const [radarRows, setRadarRows] = useState(initRadarRows);
  const [speakerRows, setSpeakerRows] = useState(initSpeakerRows);
  const [tvRows, setTvRows] = useState(initTvRows);
  const [gmdsRows, setGmdsRows] = useState(initGmdsRows);
  const [docListRows, setDocListRows] = useState(initDocListRows);

  const generate = async () => {
    setLoading(true);
    const payload = {
      ...d,
      genRows, genUseRows, battRows, transRows,
      voltRows, wireRows, routeRows,
      chargerRows, motorRows, deckMotorRows, starterRows,
      smallEquipRows, navLightRows, projectorRows,
      phoneRows, radarRows, speakerRows, tvRows,
      gmdsRows, docListRows,
    };
    try {
      const res = await fetch('/api/generateElectrical', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `電気部仕様書_${d.ship_name||'新造船'}.docx`; a.click();
      URL.revokeObjectURL(url);
      showToast('✅ Wordファイルを生成しました！');
    } catch(e) { showToast('❌ '+e.message, true); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div style={S.toast(toast.show, toast.err)}>{toast.msg}</div>
      <div style={S.layout}>
        <aside style={S.sidebar}>
          <div style={{fontSize:9,color:'#5a7a9a',padding:'0 14px 8px',letterSpacing:'.2em',textTransform:'uppercase',borderBottom:'1px solid rgba(255,255,255,.06)',marginBottom:4}}>章一覧</div>
          {SECS.map((s,i)=><div key={i} className="sb-item" style={S.sitem(cur===i)} onClick={()=>goto(i)}>{s}</div>)}
        </aside>

        <main style={S.main}>

          {/* ===== 0: 表紙 ===== */}
          {cur===0 && <div>
            <div style={S.secH}><span style={S.num}>表</span>表紙情報</div>
            <p style={{fontSize:11,color:'#6b7280',marginBottom:16}}>仕様書表紙に記載する基本情報を入力してください。</p>
            <Card title="基本情報">
              <Row><FG label="船名"><Input value={d.ship_name} onChange={set('ship_name')} placeholder="例：第○○鈴木丸" /></FG>
              <FG label="船種"><Input value={d.ship_type} onChange={set('ship_type')} /></FG></Row>
              <Row><FG label="工事番号"><Input value={d.project_no} onChange={set('project_no')} placeholder="例：S-823" /></FG>
              <FG label="作成日"><input type="date" style={S.input} value={d.create_date||''} onChange={e=>set('create_date')(e.target.value)} /></FG></Row>
              <Row><FG label="改訂番号"><Input value={d.rev_no} onChange={set('rev_no')} /></FG>
              <FG label="造船所名"><Input value={d.shipyard} onChange={set('shipyard')} /></FG></Row>
            </Card>
            <div style={S.navAct}><div /><button className="btn-nav" style={S.btnNav} onClick={()=>goto(1)}>次へ →</button></div>
          </div>}

          {/* ===== 1: 一般・配線 ===== */}
          {cur===1 && <div>
            <div style={S.secH}><span style={S.num}>１</span>一般・配線</div>
            <div style={S.note}>1-1（設計方針）は定型文です。1-2（船級）と2-1〜2-3（配線）は以下で編集できます。</div>
            <Card title="(1-2) 船級">
              <Row><FG label="船級"><Input value={d.e_class} onChange={set('e_class')} placeholder="例：ＪＧ" /></FG><div /></Row>
            </Card>
            <Card title="(2-1) 電圧及び配電方式（行の追加・削除可）">
              <EditTable cols={['区分','電圧','周波数','配電方式']} rows={voltRows} onRowsChange={setVoltRows} />
            </Card>
            <Card title="(2-2) 使用電線（行の追加・削除可）">
              <EditTable cols={['区分','電線種別・規格']} rows={wireRows} onRowsChange={setWireRows} />
            </Card>
            <Card title="(2-3) 電路・配線工事（行の追加・削除可）">
              <EditTable cols={['番号','施工内容']} rows={routeRows} onRowsChange={setRouteRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(0)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(2)}>次へ →</button></div>
          </div>}

          {/* ===== 2: 電源装置 ===== */}
          {cur===2 && <div>
            <div style={S.secH}><span style={S.num}>３</span>電源装置</div>
            <Card title="(3-1-1) 発電機要目（行の追加・削除・項目名変更可）">
              <EditTable cols={['項目','主発電機','停泊用発電機']} rows={genRows} onRowsChange={setGenRows} />
            </Card>
            <Card title="(3-1-2) 発電機の使用方法">
              <EditTable cols={['状態','使用発電機','台数']} rows={genUseRows} onRowsChange={setGenUseRows} />
            </Card>
            <Card title="(3-2) 蓄電池要目">
              <EditTable cols={['用途','メーカー','形式','電圧','容量','数量']} rows={battRows} onRowsChange={setBattRows} sectionable />
            </Card>
            <Card title="(3-3) 変圧器要目">
              <EditTable cols={['項目','変圧器①','変圧器②']} rows={transRows} onRowsChange={setTransRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(1)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(3)}>次へ →</button></div>
          </div>}

          {/* ===== 3: 配電装置 ===== */}
          {cur===3 && <div>
            <div style={S.secH}><span style={S.num}>４</span>配電装置</div>
            <div style={S.note}>4-1主配電盤・4-3船外給電箱・4-4分電盤・4-5集合分電盤は定型文です。4-2充放電盤の仕様を編集できます。</div>
            <Card title="(4-2) 充放電盤仕様">
              <EditTable cols={['項目','仕様']} rows={chargerRows} onRowsChange={setChargerRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(2)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(4)}>次へ →</button></div>
          </div>}

          {/* ===== 4: 動力装置 ===== */}
          {cur===4 && <div>
            <div style={S.secH}><span style={S.num}>５</span>動力装置</div>
            <div style={S.note}>5-3非常停止装置・5-4自動制御は定型文です。電動機要目表と始動器盤組込補機リストを編集できます。</div>
            <Card title="(5-1) 電動機要目表【機関部】（用途名は原本p.10を参照して入力）">
              <EditTable cols={['用途','台数','電圧(V)','出力(kW)','極数','定格','形式','始動方法','備考']} rows={motorRows} onRowsChange={setMotorRows} sectionable />
            </Card>
            <Card title="(5-1) 電動機要目表【甲板部】（用途名は原本p.11を参照して入力）">
              <EditTable cols={['用途','台数','電圧(V)','出力(kW)','極数','定格','形式','始動方法','備考']} rows={deckMotorRows} onRowsChange={setDeckMotorRows} sectionable />
            </Card>
            <Card title="(5-2) 集合始動器盤組込補機（左列・右列で入力）">
              <EditTable cols={['補機名①','補機名②']} rows={starterRows} onRowsChange={setStarterRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(3)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(5)}>次へ →</button></div>
          </div>}

          {/* ===== 5: 小形電気機器・航海灯 ===== */}
          {cur===5 && <div>
            <div style={S.secH}><span style={S.num}>６</span>小形電気機器・航海灯</div>
            <div style={S.note}>7-2〜7-4は定型文です。小形電気機器と航海灯の仕様を編集できます。</div>
            <Card title="(6) 小形電気機器一覧（5行既入力・残は空欄で追加可）">
              <EditTable cols={['品名','数量','要目','装備場所']} rows={smallEquipRows} onRowsChange={setSmallEquipRows} sectionable />
            </Card>
            <Card title="(7-1) 航海灯要目（メーカー：伊吹㈱）">
              <EditTable cols={['灯種','種別・規格','電源','数量']} rows={navLightRows} onRowsChange={setNavLightRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(4)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(6)}>次へ →</button></div>
          </div>}

          {/* ===== 6: 照明電灯装置 ===== */}
          {cur===6 && <div>
            <div style={S.secH}><span style={S.num}>８</span>照明電灯装置</div>
            <div style={S.note}>8-1〜8-2・8-4〜8-9は定型文です。8-3投光器を編集できます。8-8一般照明電灯は別紙一覧表参照。</div>
            <Card title="(8-3) 投光器仕様">
              <EditTable cols={['設置場所','出力(W)','台数','種別']} rows={projectorRows} onRowsChange={setProjectorRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(5)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(7)}>次へ →</button></div>
          </div>}

          {/* ===== 7: 船内通信・計器① ===== */}
          {cur===7 && <div>
            <div style={S.secH}><span style={S.num}>９①</span>船内通信・計器①</div>
            <div style={S.note}>9-2〜9-4・9-6〜9-8は定型文です。船内電話・レーダー・スピーカーを編集できます。</div>
            <Card title="(9-1) 船内電話">
              <EditTable cols={['種別','台数','設置場所']} rows={phoneRows} onRowsChange={setPhoneRows} />
            </Card>
            <Card title="(9-5) レーダー要目">
              <EditTable cols={['型','型式','台数','指示器','尖頭出力','空中線']} rows={radarRows} onRowsChange={setRadarRows} />
            </Card>
            <Card title="(9-9) 船内指令装置スピーカー配置">
              <EditTable cols={['設置場所','台数','出力(W)','形式']} rows={speakerRows} onRowsChange={setSpeakerRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(6)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(8)}>次へ →</button></div>
          </div>}

          {/* ===== 8: 船内通信・計器② ===== */}
          {cur===8 && <div>
            <div style={S.secH}><span style={S.num}>９②</span>船内通信・計器②</div>
            <div style={S.note}>9-10〜9-14・9-16〜9-23は定型文です（ジャイロ・オートパイロット・風向風速計・磁気コンパス・警報装置・測深器・監視装置等）。テレビ仕様を編集できます。</div>
            <Card title="(9-15) テレビ">
              <EditTable cols={['設置場所','仕様','台数']} rows={tvRows} onRowsChange={setTvRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(7)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(9)}>次へ →</button></div>
          </div>}

          {/* ===== 9: 無線装置 ===== */}
          {cur===9 && <div>
            <div style={S.secH}><span style={S.num}>１０</span>無線装置</div>
            <div style={S.note}>10-1衛星船舶電話・10-2簡易無線は定型文です。GMDSS機器一覧を編集できます。</div>
            <Card title="(10-3) GMDSS機器一覧">
              <EditTable cols={['機器名','型式','台数']} rows={gmdsRows} onRowsChange={setGmdsRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(8)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(10)}>次へ →</button></div>
          </div>}

          {/* ===== 10: 自動化・備品・塗装 ===== */}
          {cur===10 && <div>
            <div style={S.secH}><span style={S.num}>１１〜１３</span>自動化・備品・塗装</div>
            <div style={S.note}>11章（機関部自動化・警報装置）・12章（備品・予備品）・13章（塗装）はすべて定型文です。編集項目はありません。</div>
            <Card title="11〜13章の内容（定型文）">
              <p style={{fontSize:12,color:'#374151',lineHeight:1.7}}>
                <b>11章 機関部自動化及び警報装置：</b>主機関遠隔操縦装置・機関部自動化及び警報装置一式を装備。自動化仕様書による。<br/>
                <b>12章 備品及び予備品：</b>メーカー標準予備品を装備。蓄電池保守要具等は造船所標準。<br/>
                <b>13章 塗装：</b>マンセル記号 7.5BG 7/2 を標準塗装色とする。
              </p>
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(9)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(11)}>次へ →</button></div>
          </div>}

          {/* ===== 11: 試験・図書 ===== */}
          {cur===11 && <div>
            <div style={S.secH}><span style={S.num}>１４〜１５</span>試験・図書</div>
            <div style={S.note}>14章（試験及び検査）は定型文です。15章（図書目録）を編集できます。</div>
            <Card title="(15-2) 図書目録（2行既入力・残は空欄で追加可）">
              <EditTable cols={['図面名称','承認図(船主)','承認図(JG)','完成図(船主)','完成図(本船)']} rows={docListRows} onRowsChange={setDocListRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(10)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(12)}>次へ →</button></div>
          </div>}

          {/* ===== 12: 確認・生成 ===== */}
          {cur===12 && <div>
            <div style={S.secH}><span style={S.num}>確</span>確認・生成</div>
            <div style={S.note}>1〜15章すべての内容（定型文＋編集データ）を含むWord仕様書を生成します。</div>
            <Card title="入力内容の確認">
              <p style={{fontSize:12,color:'#374151'}}>船名：{d.ship_name || '（未入力）'}　／　工事番号：{d.project_no || '（未入力）'}</p>
            </Card>
            <div style={{textAlign:'center',margin:'24px 0'}}>
              <button className="btn-gen" style={{...S.btnGen(loading), fontSize:15, padding:'14px 44px', display:'inline-flex', alignItems:'center', gap:8}} onClick={generate} disabled={loading}>
                {loading ? '⏳ 生成中...' : '📄 Word仕様書を生成・ダウンロード'}
              </button>
              <p style={{marginTop:10,fontSize:11,color:'#888'}}>ボタンを押すと自動でダウンロードが始まります</p>
            </div>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(11)}>← 前へ</button><div /></div>
          </div>}

        </main>
      </div>

      <div style={S.bbar}>
        <div style={{color:'#a8c4ea',fontSize:12}}>{SECS[cur]} — {cur+1}/{SECS.length}</div>
        <div style={{flex:1,maxWidth:240,height:4,background:'rgba(255,255,255,.1)',borderRadius:2,margin:'0 14px'}}>
          <div style={{width:`${Math.round((cur+1)/SECS.length*100)}%`,height:'100%',background:'#2f6fed',borderRadius:2,transition:'width .3s'}} />
        </div>
        <button className="btn-gen" style={S.btnGen(loading)} onClick={generate} disabled={loading}>📄 Word生成</button>
      </div>
    </>
  );
}
