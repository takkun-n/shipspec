import { useState } from 'react';
import { S, EditTable, FG, Input, Sel, TA, Card, Row } from './FormUI';

const SECS = ['表紙','一般・配線','電源装置','確認・生成'];

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

  const generate = async () => {
    setLoading(true);
    const payload = { ...d, genRows, genUseRows, battRows, transRows, voltRows, wireRows, routeRows };
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

          {/* ===== 3: 確認・生成 ===== */}
          {cur===3 && <div>
            <div style={S.secH}><span style={S.num}>確</span>確認・生成</div>
            <div style={S.note}>現在は1〜3章（一般・配線・電源装置）のみ生成対象です。残りの章は今後追加予定です。</div>
            <Card title="入力内容の確認">
              <p style={{fontSize:12,color:'#374151'}}>船名：{d.ship_name || '（未入力）'}　／　工事番号：{d.project_no || '（未入力）'}</p>
            </Card>
            <div style={{textAlign:'center',margin:'24px 0'}}>
              <button className="btn-gen" style={{...S.btnGen(loading), fontSize:15, padding:'14px 44px', display:'inline-flex', alignItems:'center', gap:8}} onClick={generate} disabled={loading}>
                {loading ? '⏳ 生成中...' : '📄 Word仕様書を生成・ダウンロード'}
              </button>
              <p style={{marginTop:10,fontSize:11,color:'#888'}}>ボタンを押すと自動でダウンロードが始まります</p>
            </div>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(2)}>← 前へ</button><div /></div>
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
