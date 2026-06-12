import { useState } from 'react';
import { S, EditTable, FG, Input, Sel, TA, Card, Row } from './FormUI';

const SECS = ['表紙','一般事項','主機関','機関室','軸系及びプロペラ','発電装置','通風装置','清浄機・油水分離器その他','ポンプ','確認・生成'];

const initMainEngineRows = [
  {type:'normal',cells:['種別','単動４サイクル過給機インタークーラー付ディーゼル機関']},
  {type:'normal',cells:['メーカー','株式会社赤阪鐵工所']},
  {type:'normal',cells:['型式','ＡＸ３３ＢＲ']},
  {type:'normal',cells:['台数','１台']},
  {type:'normal',cells:['連続最大出力×回転数','１，４７１ｋＷ（２，０００ＰＳ）×２８０／２８０ｍｉｎ⁻¹']},
  {type:'normal',cells:['常用出力×回転数（85%負荷）','１，２５０ｋＷ（１，７００ＰＳ）×２６５／２６５ｍｉｎ⁻¹']},
  {type:'normal',cells:['シリンダ数','６']},
  {type:'normal',cells:['シリンダ径','３３０㎜']},
  {type:'normal',cells:['ストローク','６２０㎜']},
  {type:'normal',cells:['平均ピストン速度','５．７９ｍ／ｓ']},
  {type:'normal',cells:['平均有効圧力（常用）','１．９８１ＭＰａ']},
  {type:'normal',cells:['最高燃焼圧力','１４．７０ＭＰａ']},
  {type:'normal',cells:['冷却方式','セントラル清水冷却']},
  {type:'normal',cells:['燃料消費率','Ａ重油　100%負荷時　185g/kW・h＋5%（クランク軸端）、低位発熱量42,700kJ/kg']},
  {type:'normal',cells:['潤滑油消費率（シリンダ油）','０．５０ｇ／ｋＷ・ｈ']},
  {type:'normal',cells:['使用燃料','Ａ重油']},
  {type:'normal',cells:['回転方向','時計方向（舵より見て）']},
  {type:'normal',cells:['推進方式','逆転機による']},
  {type:'section',label:'逆転機'},
  {type:'normal',cells:['型式','同芯形、湿式多板油圧クラッチ付、スラスト軸受付']},
  {type:'normal',cells:['呼称','ＭＮ１０３０']},
  {type:'normal',cells:['メーカー','㈱日立ニコトランスミッション']},
  {type:'section',label:'付属機器'},
  {type:'normal',cells:['ターニング装置','ターニングモーターによる　０．４ｋＷ']},
  {type:'normal',cells:['排気タービン過給機','排気ガスタービン式（ＭＥＴ２６ＳＲⅡ）×１']},
  {type:'normal',cells:['過給機冷却器','フィン付き（ＡＦＫ１１３Ｓ）１１３．１ｍ²×１']},
  {type:'normal',cells:['主機駆動空気圧縮機','３０．０ｍ³／ｈ×０．４４ＭＰａ（主機駆動）×１']},
  {type:'normal',cells:['セントラル冷却器','プレート式　４４．１２ｍ²×１']},
  {type:'normal',cells:['潤滑油冷却器','チューブ式　３６ｍ²']},
  {type:'normal',cells:['主機関重量','約３５．３ｔｏｎ（内逆転機重量４．３ｔｏｎ）']},
];

const initEngineRoomRows = [
  {type:'normal',cells:['構造','鋼板製']},
  {type:'normal',cells:['ミストボックス','設置']},
  {type:'normal',cells:['通風口','２箇所']},
  {type:'normal',cells:['出入口扉','１箇所']},
  {type:'normal',cells:['煙突頂部','水密板及びドレン抜きを設置']},
  {type:'normal',cells:['排気管出口','主機関・補機関とも６０度曲りを付け、雨水の侵入を防ぐ']},
  {type:'normal',cells:['スパークアレスター','発電機関及び主機関に装備']},
];

const initShaftRows = [
  {type:'section',label:'中間軸'},
  {type:'normal',cells:['材質','鍛鋼製']},
  {type:'normal',cells:['型式','１体型']},
  {type:'normal',cells:['直径','２４０㎜']},
  {type:'normal',cells:['長さ','１，１２０㎜']},
  {type:'section',label:'推進器軸'},
  {type:'normal',cells:['軸封装置','メカニカル式（イーグル工業）']},
  {type:'normal',cells:['型式','全通スリーブ　第一種']},
  {type:'normal',cells:['材質','鍛鋼製']},
  {type:'normal',cells:['直径','２６０㎜']},
  {type:'normal',cells:['長さ','３，６２０㎜（ボスキャップ含む）']},
  {type:'section',label:'軸受'},
  {type:'normal',cells:['軸受箱','鋳物製']},
  {type:'normal',cells:['軸受','ゴム軸受']},
  {type:'section',label:'プロペラ'},
  {type:'normal',cells:['型式','４翼固定ピッチ']},
  {type:'normal',cells:['直径×ピッチ','']},
  {type:'normal',cells:['材質','ＣＡＣ７０３']},
  {type:'normal',cells:['メーカー','かもめプロペラ㈱（ＳＧプロペラ）']},
  {type:'section',label:'荷役ポンプ増速機'},
  {type:'normal',cells:['型式','密閉歯車強制潤滑式・エアークラッチ付']},
  {type:'normal',cells:['回転数','入力２４０ｍｉｎ⁻¹　出力１，１６０ｍｉｎ⁻¹']},
  {type:'normal',cells:['伝達馬力','２００ｋＷ×２']},
  {type:'normal',cells:['メーカー','サンコーポンプ㈱']},
];

const initGenSetRows = [
  {type:'section',label:'発電機（Ｎｏ．１・Ｎｏ．２）'},
  {type:'normal',cells:['型式','交流自己通風防滴型']},
  {type:'normal',cells:['台数','２台']},
  {type:'normal',cells:['出力','２５０ＫＶＡ']},
  {type:'normal',cells:['周波数','６０Ｈｚ']},
  {type:'normal',cells:['電圧','４４５Ｖ']},
  {type:'normal',cells:['回転数','１，８００ｍｉｎ⁻¹']},
  {type:'normal',cells:['メーカー','大洋電機㈱']},
  {type:'section',label:'発電機関'},
  {type:'normal',cells:['型式','４サイクル単動ディーゼル機関　６ＨＡＬ２－ＷＨＴ（セルモーター起動：蓄電池）']},
  {type:'normal',cells:['台数','２台']},
  {type:'normal',cells:['出力','２６５ｋＷ（３６０ＰＳ）']},
  {type:'normal',cells:['回転数','１，８００ｍｉｎ⁻¹']},
  {type:'normal',cells:['冷却方式','セントラル冷却']},
];

const initVentRows = [
  {type:'section',label:'機関室送風機'},
  {type:'normal',cells:['型式','堅全閉軸流可逆式']},
  {type:'normal',cells:['容量','３００ｍ³／min×２９２Ｐａ×３．７ｋＷ×２台']},
  {type:'normal',cells:['メーカー','広瀬鉄工㈱']},
  {type:'section',label:'起動用空気槽'},
  {type:'normal',cells:['容量','２５０Ｌ×２．９４ＭＰａ×２台（主機メーカー支給）']},
];

const initPurifierRows = [
  {type:'section',label:'燃料油清浄機'},
  {type:'normal',cells:['型式','ＳＲ－Ｚ３０Ｐ－４０ＨＰ']},
  {type:'normal',cells:['構成','油供給ポンプ・移送ポンプ・電気ヒーター内蔵']},
  {type:'normal',cells:['メーカー','㈱赤阪鐵工所']},
  {type:'section',label:'油水分離装置（ビルジ分離器）'},
  {type:'normal',cells:['型式','ＵＳＨ－１０']},
  {type:'normal',cells:['容量','１．０ｍ³／ｈ×１台']},
  {type:'normal',cells:['メーカー','大晃機械工業㈱']},
  {type:'section',label:'燃料油こし器'},
  {type:'normal',cells:['台数','２台（主機関・補機用）']},
  {type:'normal',cells:['メーカー','（株）オーバル']},
  {type:'section',label:'主機関燃料油精密こし器'},
  {type:'normal',cells:['台数','１台']},
  {type:'normal',cells:['精度','５ミクロン']},
  {type:'section',label:'油分濃度計'},
  {type:'normal',cells:['型式','電極式×１台']},
  {type:'normal',cells:['メーカー','コンヒラ']},
];

const initPumpRows = [
  {type:'normal',cells:['主機冷却海水ポンプ','','主機駆動','１台','']},
  {type:'normal',cells:['主機冷却清水ポンプ','','主機駆動','１台','']},
  {type:'normal',cells:['潤滑油ポンプ','','主機駆動','１台','']},
  {type:'normal',cells:['燃料油移送ポンプ','','電動','１台','']},
  {type:'normal',cells:['ビルジ・ＧＳポンプ','','電動','１台','']},
  {type:'normal',cells:['雑用海水ポンプ','','電動','１台','']},
  {type:'normal',cells:['清水ホームポンプ','','電動','１台','']},
];

export default function EngineApp() {
  const [cur, setCur] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show:false, msg:'', err:false });
  const showToast = (msg, err=false) => { setToast({show:true,msg,err}); setTimeout(()=>setToast(t=>({...t,show:false})),4000); };
  const goto = (n) => { setCur(n); window.scrollTo(0,0); };

  const [d, setD] = useState({
    ship_name:'', ship_type:'油タンカー', project_no:'', create_date:'', rev_no:'Rev.1', shipyard:'鈴木造船株式会社',
    m_class:'ＪＧ',
  });
  const set = (k) => (v) => setD(prev => ({...prev, [k]:v}));

  const [mainEngineRows, setMainEngineRows] = useState(initMainEngineRows);
  const [engineRoomRows, setEngineRoomRows] = useState(initEngineRoomRows);
  const [shaftRows, setShaftRows] = useState(initShaftRows);
  const [genSetRows, setGenSetRows] = useState(initGenSetRows);
  const [ventRows, setVentRows] = useState(initVentRows);
  const [purifierRows, setPurifierRows] = useState(initPurifierRows);
  const [pumpRows, setPumpRows] = useState(initPumpRows);

  const generate = async () => {
    setLoading(true);
    const payload = { ...d, mainEngineRows, engineRoomRows, shaftRows, genSetRows, ventRows, purifierRows, pumpRows };
    try {
      const res = await fetch('/api/generateEngine', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `機関部仕様書_${d.ship_name||'新造船'}.docx`; a.click();
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

          {/* ===== 1: 一般事項 ===== */}
          {cur===1 && <div>
            <div style={S.secH}><span style={S.num}>１</span>一般事項</div>
            <div style={S.note}>1.一般事項は定型文を使用します。船級のみ編集可能です。</div>
            <Card title="船級">
              <Row><FG label="船級"><Input value={d.m_class} onChange={set('m_class')} placeholder="例：ＪＧ" /></FG><div /></Row>
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(0)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(2)}>次へ →</button></div>
          </div>}

          {/* ===== 2: 主機関 ===== */}
          {cur===2 && <div>
            <div style={S.secH}><span style={S.num}>２</span>主機関</div>
            <Card title="■ 主機関要目（行の追加・削除・見出し行・項目名変更可）">
              <EditTable cols={['項目','要目']} rows={mainEngineRows} onRowsChange={setMainEngineRows} sectionable />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(1)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(3)}>次へ →</button></div>
          </div>}

          {/* ===== 3: 機関室 ===== */}
          {cur===3 && <div>
            <div style={S.secH}><span style={S.num}>３</span>機関室</div>
            <Card title="■ 機関室仕様（行の追加・削除・項目名変更可）">
              <EditTable cols={['項目','内容']} rows={engineRoomRows} onRowsChange={setEngineRoomRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(2)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(4)}>次へ →</button></div>
          </div>}

          {/* ===== 4: 軸系及びプロペラ ===== */}
          {cur===4 && <div>
            <div style={S.secH}><span style={S.num}>４</span>軸系及びプロペラ</div>
            <Card title="■ 軸系及びプロペラ要目（行の追加・削除・見出し行・項目名変更可）">
              <EditTable cols={['項目','要目']} rows={shaftRows} onRowsChange={setShaftRows} sectionable />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(3)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(5)}>次へ →</button></div>
          </div>}

          {/* ===== 5: 発電装置 ===== */}
          {cur===5 && <div>
            <div style={S.secH}><span style={S.num}>５</span>発電装置</div>
            <Card title="■ 発電装置要目（行の追加・削除・見出し行・項目名変更可）">
              <EditTable cols={['項目','要目']} rows={genSetRows} onRowsChange={setGenSetRows} sectionable />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(4)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(6)}>次へ →</button></div>
          </div>}

          {/* ===== 6: 通風装置 ===== */}
          {cur===6 && <div>
            <div style={S.secH}><span style={S.num}>６</span>通風装置</div>
            <Card title="■ 通風装置要目（行の追加・削除・見出し行・項目名変更可）">
              <EditTable cols={['項目','要目']} rows={ventRows} onRowsChange={setVentRows} sectionable />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(5)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(7)}>次へ →</button></div>
          </div>}

          {/* ===== 7: 清浄機・油水分離器その他 ===== */}
          {cur===7 && <div>
            <div style={S.secH}><span style={S.num}>７</span>清浄機・油水分離器その他</div>
            <Card title="■ 清浄機・油水分離器その他要目（行の追加・削除・見出し行・項目名変更可）">
              <EditTable cols={['項目','要目']} rows={purifierRows} onRowsChange={setPurifierRows} sectionable />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(6)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(8)}>次へ →</button></div>
          </div>}

          {/* ===== 8: ポンプ ===== */}
          {cur===8 && <div>
            <div style={S.secH}><span style={S.num}>８</span>ポンプ</div>
            <Card title="■ ポンプ要目（行の追加・削除・項目名変更可）">
              <EditTable cols={['ポンプ名称','型式・容量','駆動方法','台数','メーカー']} rows={pumpRows} onRowsChange={setPumpRows} />
            </Card>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(7)}>← 前へ</button><button className="btn-nav" style={S.btnNav} onClick={()=>goto(9)}>次へ →</button></div>
          </div>}

          {/* ===== 9: 確認・生成 ===== */}
          {cur===9 && <div>
            <div style={S.secH}><span style={S.num}>確</span>確認・生成</div>
            <div style={S.note}>現在は1〜8章（一般事項・主機関・機関室・軸系及びプロペラ・発電装置・通風装置・清浄機・油水分離器その他・ポンプ）のみ生成対象です。残りの章は今後追加予定です。</div>
            <Card title="入力内容の確認">
              <p style={{fontSize:12,color:'#374151'}}>船名：{d.ship_name || '（未入力）'}　／　工事番号：{d.project_no || '（未入力）'}</p>
            </Card>
            <div style={{textAlign:'center',margin:'24px 0'}}>
              <button className="btn-gen" style={{...S.btnGen(loading), fontSize:15, padding:'14px 44px', display:'inline-flex', alignItems:'center', gap:8}} onClick={generate} disabled={loading}>
                {loading ? '⏳ 生成中...' : '📄 Word仕様書を生成・ダウンロード'}
              </button>
              <p style={{marginTop:10,fontSize:11,color:'#888'}}>ボタンを押すと自動でダウンロードが始まります</p>
            </div>
            <div style={S.navAct}><button className="btn-nav" style={S.btnNav} onClick={()=>goto(8)}>← 前へ</button><div /></div>
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
