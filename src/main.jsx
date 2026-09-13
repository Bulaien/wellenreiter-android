import React, {useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Capacitor, registerPlugin} from '@capacitor/core';
import './style.css';

const NativeRadio=registerPlugin('Radio');

const stations=[
 {id:'bob',name:'RADIO BOB!',genre:'Rock · Schleswig-Holstein',tag:'Rock',freq:'DAB+',mark:'BOB',url:'https://streams.radiobob.de/bob-shlive/mp3-192/streams.radiobob.de/'},
 {id:'nius',name:'NIUS – Das Radio',genre:'Nachrichten · Musik',tag:'Wort',freq:'11D',mark:'NI',url:'http://server17.streamserver24.com:44212/mp3-256'},
 {id:'ndr1',name:'NDR 1 Welle Nord',genre:'Studio Flensburg · Schleswig-Holstein',tag:'Regional',freq:'89.6',mark:'N1',url:'https://icecast.ndr.de/ndr/ndr1wellenord/flensburg/mp3/128/stream.mp3'},
 {id:'ndr2',name:'NDR 2',genre:'Pop · Norddeutschland',tag:'Pop',freq:'93.2',mark:'N2',url:'https://icecast.ndr.de/ndr/ndr2/hamburg/mp3/128/stream.mp3'},
 {id:'dlf',name:'Deutschlandfunk',genre:'Nachrichten · Kultur',tag:'Wort',freq:'103.3',mark:'DF',url:'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3'},
 {id:'radioeins',name:'radioeins',genre:'Musik · Gespräche',tag:'Berlin',freq:'95.8',mark:'R1',url:'https://dispatcher.rndfnk.com/rbb/radioeins/live/mp3/mid'},
 {id:'paradise',name:'Radio Paradise',genre:'Eclectic · Rock',tag:'Global',freq:'WEB',mark:'RP',url:'https://stream.radioparadise.com/aac-320'},
 {id:'groove',name:'Groove Salad',genre:'Ambient · Downtempo',tag:'Chill',freq:'WEB',mark:'GS',url:'https://ice2.somafm.com/groovesalad-128-mp3'}
];

const Icon=({name,size=22,fill='none'})=>{const paths={play:<path d="m8 5 11 7-11 7Z"/>,pause:<><path d="M9 5v14M15 5v14"/></>,heart:<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.9-8.8a5.5 5.5 0 0 0-.1-7.8Z"/>,search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,radio:<><circle cx="12" cy="12" r="3"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 19.1a10 10 0 0 1 0-14.2M19.1 4.9a10 10 0 0 1 0 14.2"/></>};return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>{paths[name]}</svg>}

function readFavs(){try{return new Set(JSON.parse(localStorage.getItem('wr-favs')||'[]'))}catch{return new Set()}}

function App(){
 const audio=useRef(null);const [current,setCurrent]=useState(stations[0]);const [playing,setPlaying]=useState(false);const [query,setQuery]=useState('');const [onlyFavs,setOnlyFavs]=useState(false);const [favs,setFavs]=useState(readFavs);const [status,setStatus]=useState('Bereit zum Abspielen');
 const shown=useMemo(()=>stations.filter(s=>(!onlyFavs||favs.has(s.id))&&(s.name+' '+s.genre).toLowerCase().includes(query.toLowerCase())),[query,onlyFavs,favs]);
 async function choose(s){setCurrent(s);setStatus('Verbindung wird hergestellt …');try{if(Capacitor.isNativePlatform()){await NativeRadio.play({url:s.url,title:s.name});setPlaying(true);setStatus('Live auf Sendung')}else{const el=audio.current;if(el.src!==s.url)el.src=s.url;await el.play()}}catch{setPlaying(false);setStatus('Sender momentan nicht erreichbar')}}
 async function toggle(){if(playing){if(Capacitor.isNativePlatform())await NativeRadio.pause();else audio.current.pause();setPlaying(false);setStatus('Wiedergabe pausiert')}else await choose(current)}
 function favorite(id,e){e.stopPropagation();const next=new Set(favs);next.has(id)?next.delete(id):next.add(id);setFavs(next);try{localStorage.setItem('wr-favs',JSON.stringify([...next]))}catch{}}
 return <><header><div className="brand"><span className="brandmark"><Icon name="radio" size={19}/></span>Wellenreiter</div><span className="live"><i/>LIVE RADIO</span></header><main><div className="eyebrow">EINFACH EINSCHALTEN</div><h1>Radio,<br/><em>das bleibt.</em></h1><p className="intro">Deine Sender aus Flensburg und der Welt.</p><div className="tabs"><button className={!onlyFavs?'on':''} onClick={()=>setOnlyFavs(false)}>Alle Sender</button><button className={onlyFavs?'on':''} onClick={()=>setOnlyFavs(true)}>Favoriten</button></div><label className="search"><Icon name="search" size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sender suchen …"/></label><section className="grid">{shown.map(s=><article key={s.id} className={current.id===s.id&&playing?'active':''} onClick={()=>choose(s)}><div className="cardtop"><small>{s.tag}</small><button onClick={e=>favorite(s.id,e)} aria-label="Favorit"><Icon name="heart" size={19} fill={favs.has(s.id)?'currentColor':'none'}/></button></div><div className="dial">{s.freq}</div><strong>{s.name}</strong><span>{s.genre}</span></article>)}</section></main><footer><div className="station"><b>{current.mark}</b><div><strong>{current.name}</strong><span>{status}</span></div></div><button className="play" onClick={toggle} aria-label={playing?'Pause':'Abspielen'}><Icon name={playing?'pause':'play'} size={28}/></button></footer><audio ref={audio} onPlay={()=>{setPlaying(true);setStatus('Live auf Sendung')}} onPause={()=>{setPlaying(false);setStatus('Wiedergabe pausiert')}} onError={()=>setStatus('Sender momentan nicht erreichbar')}/></>
}
createRoot(document.getElementById('root')).render(<App/>);
