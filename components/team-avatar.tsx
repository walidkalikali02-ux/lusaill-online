type Props = { seed: number; name: string; role: string; decorative?: boolean };
const palettes = [["#e3ede5", "#236357"], ["#f6e4d8", "#b65d40"], ["#e7e5f1", "#625185"], ["#f3ebce", "#8c7129"], ["#deebf2", "#356b88"]];
export function TeamAvatar({ seed, name, role, decorative = false }: Props) {
  const [background, shirt] = palettes[seed % palettes.length];
  const skin = ["#efc09d", "#c98d67", "#a96b4b", "#e2a77e"][seed % 4];
  const hair = ["#342c2a", "#51372b", "#262f36"][seed % 3];
  const longHair = seed % 2 === 1;
  return <svg viewBox="0 0 200 200" width="200" height="200" role={decorative ? undefined : "img"} aria-hidden={decorative ? true : undefined} aria-label={decorative ? undefined : `رسم كرتوني للشخصية التمثيلية ${name}`}>
    <rect width="200" height="200" rx="100" fill={background}/>
    <path d="M14 149C48 118 145 119 190 150" fill="none" stroke="white" strokeWidth="2" opacity=".45"/>
    <circle cx="164" cy="48" r="12" fill="white" opacity=".45"/><path d="M33 54v12m-6-6h12" stroke="white" strokeWidth="3"/>
    {longHair ? <path d="M55 111V77c0-55 91-55 91 0v53l-16 26H70Z" fill={hair}/> : null}
    <path d="M36 202v-22c0-34 27-51 64-51s64 17 64 51v22" fill={shirt}/>
    <path d="m80 134 20 34 20-34-7-11H87Z" fill="#faf8ee"/>
    <path d="M86 112v25q14 13 28 0v-25" fill={skin}/>
    <path d="M86 117q15 10 28 0v10q-14 9-28-2" fill="#8f5036" opacity=".2"/>
    <ellipse cx="63" cy="90" rx="7" ry="12" fill={skin}/><ellipse cx="137" cy="90" rx="7" ry="12" fill={skin}/>
    <path d="M64 72q0-39 36-39t36 39v25c0 22-16 39-36 39s-36-17-36-39Z" fill={skin}/>
    <path d={longHair ? "M61 79V64c0-44 80-45 80 3v23c-12-7-19-24-24-34-9 17-30 25-56 23Z" : "M62 79V65c0-41 77-45 77 3v17l-10-16c-20 7-36-1-45-7-3 8-10 13-22 17Z"} fill={hair}/>
    <path d="m77 84 13-1m20 0 13 1" stroke={hair} strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="84" cy="93" rx="2.5" ry="3" fill="#302b29"/><ellipse cx="116" cy="93" rx="2.5" ry="3" fill="#302b29"/>
    <path d="m100 94-3 13h6m-13 9q10 8 20-1" fill="none" stroke="#894e3c" strokeWidth="2.3" strokeLinecap="round"/>
    {seed % 3 !== 0 ? <g fill="none" stroke="#343d41" strokeWidth="2.5"><rect x="70" y="86" width="26" height="17" rx="6"/><rect x="104" y="86" width="26" height="17" rx="6"/><path d="M96 92h8m-40-2h6m60 0h6"/></g> : null}
    {role === "engineer" && seed % 2 === 0 ? <g><path d="M60 66c0-49 80-49 80 0Z" fill="#e8b94f"/><rect x="54" y="61" width="92" height="10" rx="5" fill="#d49a2e"/><path d="M96 29v29m10-27v27" stroke="#f7db85" strokeWidth="5"/></g> : null}
    <path d="M57 180h19m62-19v24m-6-18h12" stroke="white" strokeWidth="2" opacity=".45"/>
  </svg>;
}
