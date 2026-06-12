// ===== 共通UIコンポーネント・スタイル定義（①②③共通） =====

export const S = {
  header: { background:'#1e3a5f', color:'#fff', position:'sticky', top:0, zIndex:100, borderBottom:'2px solid #2f6fed', padding:'12px 28px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  logoMark: { width:40, height:40, background:'#2f6fed', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:18, color:'#fff', marginRight:14, boxShadow:'0 2px 8px rgba(47,111,237,.5)' },
  layout: { display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'calc(100vh - 68px)' },
  sidebar: { background:'#16304d', padding:'16px 0', position:'sticky', top:68, height:'calc(100vh - 68px)', overflowY:'auto' },
  sitem: (active) => ({ display:'block', padding:'8px 16px', color: active ? '#fff' : '#9fb8d9', cursor:'pointer', fontSize:12, fontWeight: active ? 700 : 400, borderLeft: active ? '3px solid #2f6fed' : '3px solid transparent', background: active ? 'rgba(47,111,237,.22)' : 'transparent' }),
  main: { padding:'24px 32px', maxWidth:1100 },
  secH: { fontSize:19, fontWeight:700, color:'#1e3a5f', borderBottom:'2px solid #2f6fed', paddingBottom:8, marginBottom:6, display:'flex', alignItems:'center', gap:10 },
  num: { background:'#2f6fed', color:'#fff', width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 },
  card: { background:'#fff', border:'1px solid #dde4ee', borderRadius:10, marginBottom:16, boxShadow:'0 1px 3px rgba(30,58,95,.05)' },
  cardHd: { background:'#eaf1fc', padding:'9px 16px', fontWeight:700, fontSize:13, color:'#16304d', borderBottom:'1px solid #dde4ee', borderRadius:'10px 10px 0 0', display:'flex', alignItems:'center', gap:8 },
  cardBody: { padding:16 },
  row: { display:'grid', gap:12, marginBottom:12 },
  fg: { display:'flex', flexDirection:'column', gap:3 },
  label: { fontSize:10, fontWeight:700, color:'#6b7280', letterSpacing:'.05em', textTransform:'uppercase' },
  input: { border:'1px solid #dde4ee', borderRadius:5, padding:'7px 10px', fontSize:12, fontFamily:'inherit', color:'#1f2937', background:'#fff', outline:'none' },
  textarea: { border:'1px solid #dde4ee', borderRadius:5, padding:'7px 10px', fontSize:12, fontFamily:'inherit', color:'#1f2937', background:'#fff', outline:'none', resize:'vertical', minHeight:60 },
  select: { border:'1px solid #dde4ee', borderRadius:5, padding:'7px 10px', fontSize:12, fontFamily:'inherit', color:'#1f2937', background:'#fff', outline:'none' },
  etbl: { width:'100%', borderCollapse:'collapse', fontSize:12, marginBottom:6 },
  th: { background:'#eaf1fc', border:'1px solid #c5d4ec', padding:'6px 8px', fontWeight:700, color:'#16304d', textAlign:'center' },
  td: { border:'1px solid #dde4ee', padding:2 },
  tinput: { width:'100%', border:'none', padding:'5px 6px', fontSize:11, fontFamily:'inherit', background:'transparent', outline:'none' },
  srTd: { border:'1px solid #dde4ee', padding:'5px 8px', background:'#1e3a5f', color:'#fff', fontWeight:700, fontSize:11 },
  totTd: { border:'1px solid #dde4ee', padding:'5px 8px', background:'#e8f4ec', fontWeight:700, fontSize:11 },
  addBtn: { background:'none', border:'1px dashed #dde4ee', color:'#6b7280', padding:'4px 12px', borderRadius:4, cursor:'pointer', fontSize:11, fontFamily:'inherit', marginRight:6 },
  navAct: { display:'flex', justifyContent:'space-between', marginTop:14, marginBottom:80 },
  btnNav: { background:'#fff', border:'1px solid #dde4ee', padding:'8px 20px', borderRadius:6, cursor:'pointer', fontFamily:'inherit', fontSize:12, color:'#1e3a5f' },
  bbar: { position:'fixed', bottom:0, left:0, right:0, background:'#1e3a5f', borderTop:'2px solid #2f6fed', padding:'11px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:100 },
  btnGen: (loading) => ({ background: loading ? '#7fa3e8' : '#2f6fed', color:'#fff', border:'none', padding:'10px 26px', borderRadius:6, fontWeight:700, fontSize:13, fontFamily:'inherit', cursor: loading ? 'not-allowed' : 'pointer' }),
  toast: (show, err) => ({ position:'fixed', top:80, right:20, background: err ? '#ef4444' : '#22a06b', color:'#fff', padding:'10px 16px', borderRadius:8, fontSize:12, fontWeight:700, opacity: show ? 1 : 0, transition:'all .3s', zIndex:200, pointerEvents:'none' }),
  note: { background:'#fff8e6', border:'1px solid #f0d060', borderLeft:'4px solid #f0a020', borderRadius:4, padding:'7px 12px', fontSize:11, color:'#7a6020', marginBottom:12 },
  navTab: (active) => ({ display:'inline-block', padding:'6px 16px', borderRadius:6, fontSize:12, fontWeight:700, color: active ? '#1e3a5f' : '#cfe0fb', background: active ? '#fff' : 'transparent', cursor:'pointer', marginLeft:6 }),
};

// ===== 編集可テーブルコンポーネント =====
export function EditTable({ cols, rows, onRowsChange, sectionable }) {
  const addRow = (type='normal') => onRowsChange([...rows, { type, cells: cols.map(() => '') }]);
  const delRow = (i) => onRowsChange(rows.filter((_,idx) => idx !== i));
  const setCell = (ri, ci, v) => {
    const next = rows.map((r,idx) => idx===ri ? {...r, cells: r.cells.map((c,ci2) => ci2===ci ? v : c)} : r);
    onRowsChange(next);
  };
  const setSecLabel = (ri, v) => {
    const next = rows.map((r,idx) => idx===ri ? {...r, label:v} : r);
    onRowsChange(next);
  };
  return (
    <div>
      <table style={S.etbl}>
        <thead><tr>{cols.map(c=><th key={c} style={S.th}>{c}</th>)}<th style={{...S.th,width:32}}></th></tr></thead>
        <tbody>
          {rows.map((row,ri) => row.type==='section' ? (
            <tr key={ri}>
              <td colSpan={cols.length} style={S.srTd}>
                <input style={{...S.tinput, color:'#fff', background:'transparent', fontWeight:700}} value={row.label||''} onChange={e=>setSecLabel(ri,e.target.value)} />
              </td>
              <td style={{...S.td, textAlign:'center'}}><button className="x-btn" style={{background:'none',border:'none',cursor:'pointer',color:'#ef4444',fontSize:13}} onClick={()=>delRow(ri)}>✕</button></td>
            </tr>
          ) : row.type==='total' ? (
            <tr key={ri}>
              {(row.cells||[]).map((c,ci)=><td key={ci} style={{...S.td, background:'#e8f4ec', padding:0}}><input style={{...S.tinput, fontWeight:700}} value={c} onChange={e=>setCell(ri,ci,e.target.value)} /></td>)}
              <td style={{...S.td, textAlign:'center'}}><button className="x-btn" style={{background:'none',border:'none',cursor:'pointer',color:'#ef4444',fontSize:13}} onClick={()=>delRow(ri)}>✕</button></td>
            </tr>
          ) : (
            <tr key={ri}>
              {(row.cells||[]).map((c,ci)=><td key={ci} style={S.td}><input style={S.tinput} value={c} onChange={e=>setCell(ri,ci,e.target.value)} /></td>)}
              <td style={{...S.td, textAlign:'center'}}><button className="x-btn" style={{background:'none',border:'none',cursor:'pointer',color:'#ef4444',fontSize:13}} onClick={()=>delRow(ri)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className="add-btn" style={S.addBtn} onClick={()=>addRow('normal')}>＋ 行追加</button>
        {sectionable && <><button className="add-btn" style={{...S.addBtn, borderColor:'#9ca3af', color:'#6b7280'}} onClick={()=>addRow('section')}>＋ 見出し行</button>
        <button className="add-btn" style={{...S.addBtn, borderColor:'#22a06b', color:'#22a06b'}} onClick={()=>addRow('total')}>＋ 合計行</button></>}
      </div>
    </div>
  );
}

export function FG({ label, children }) {
  return <div style={S.fg}><label style={S.label}>{label}</label>{children}</div>;
}
export function Input({ id, value, onChange, placeholder }) {
  return <input id={id} style={S.input} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder||''} />;
}
export function Sel({ value, onChange, options }) {
  return <select style={S.select} value={value||''} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}</select>;
}
export function TA({ value, onChange, placeholder, rows=3 }) {
  return <textarea style={S.textarea} rows={rows} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder||''} />;
}
export function Card({ title, children }) {
  return <div className="card-el" style={S.card}><div style={S.cardHd}><span style={{width:4,height:14,background:'#2f6fed',borderRadius:2,display:'inline-block',marginRight:4}}></span>{title}</div><div style={S.cardBody}>{children}</div></div>;
}
export function Row({ cols=2, children }) {
  return <div style={{...S.row, gridTemplateColumns: Array(cols).fill('1fr').join(' ')}}>{children}</div>;
}
