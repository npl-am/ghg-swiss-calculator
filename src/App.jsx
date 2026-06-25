import React, { useState, useMemo } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { CANTONS, BENCHMARKS } from './data.js'
import { calculateFootprint, dominantHeatingType } from './calculations.js'
import Methodology from './Methodology.jsx'

const GITHUB_URL = 'https://github.com/npl-am/ghg-swiss-calculator'

const CAT = {
  energy:   { label: 'Home energy',      color: '#1F6F8B' },
  mobility: { label: 'Mobility',         color: '#2D7A4F' },
  food:     { label: 'Food',             color: '#7D4500' },
  goods:    { label: 'Goods & services', color: '#8B3A3A' },
}

const HOUSEHOLD_TYPES = [
  { value: 1,   label: 'Single person' },
  { value: 2,   label: 'Couple, no children' },
  { value: 3.5, label: 'Couple with children' },
  { value: 3,   label: 'Family, grown children' },
]
const DIET_OPTIONS = [
  { value: 'omnivore',   label: 'Omnivore' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan',      label: 'Vegan' },
]

export default function App() {
  return (
    <div style={s.shell}>
      <TopBar />
      <div style={s.body}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </div>
    </div>
  )
}

function SwissFlag({ size = 28 }) {
  const s = size, c = s / 2, arm = s * 0.625, thick = s * 0.1875
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-label="Swiss flag" role="img" style={{ flexShrink: 0 }}>
      <rect width={s} height={s} fill="#D52B1E" />
      <rect x={(s - thick) / 2} y={(s - arm) / 2} width={thick} height={arm} fill="#fff" />
      <rect x={(s - arm) / 2} y={(s - thick) / 2} width={arm} height={thick} fill="#fff" />
    </svg>
  )
}

function TopBar() {
  return (
    <header style={s.topBar}>
      <div style={s.topBarInner}>
        <Link to="/" style={s.topBarBrand}>
          <SwissFlag size={30} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Household GHG Calculator</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 400, lineHeight: 1.2 }}>Wil, St. Gallen · Switzerland</div>
          </div>
        </Link>
        <span style={s.topBarSub}>Consumption-based GHG accounting — BAFU · mobitool · ESU-services</span>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={s.topBarGh}>
          GitHub
        </a>
      </div>
    </header>
  )
}

function Sidebar() {
  const loc = useLocation()
  return (
    <nav style={s.sidebar}>
      <ul style={s.navList}>
        <SidebarLink to="/" label="Calculator" active={loc.pathname === '/'} />
        <SidebarLink to="/methodology" label="Methodology" active={loc.pathname === '/methodology'} />
      </ul>
      <div style={s.sidebarBlurb}>
        <p style={{ fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>
          GHG footprint calculator for a household in Wil, Switzerland.
        </p>
        <p>
          Estimates annual greenhouse gas emissions across four categories:
          energy, mobility, food, and goods & services.
        </p>
        <p style={{ marginTop: 10 }}>
          Emission factors sourced from{' '}
          <a href="https://www.bafu.admin.ch" target="_blank" rel="noopener noreferrer">BAFU</a>,{' '}
          <a href="https://www.mobitool.ch" target="_blank" rel="noopener noreferrer">mobitool v3.0</a>, and{' '}
          <a href="https://esu-services.ch" target="_blank" rel="noopener noreferrer">ESU-services</a>.
          Canton heating mix from BFS GWS 2023.
        </p>
        <p style={{ marginTop: 10, color: '#999' }}>For illustrative purposes only.</p>
      </div>
    </nav>
  )
}

function SidebarLink({ to, label, active }) {
  return (
    <li style={s.navItem}>
      <Link to={to} style={{ ...s.navLink, ...(active ? s.navLinkActive : {}) }}>
        {label}
      </Link>
    </li>
  )
}

function Calculator() {
  const [cantonCode, setCantonCode] = useState('SG')
  const [householdSize, setHouseholdSize] = useState(2)
  const [heatingType, setHeatingType] = useState(dominantHeatingType('SG'))
  const [dietType, setDietType] = useState('omnivore')
  const [carKm, setCarKm] = useState(9000)
  const [carFuel, setCarFuel] = useState('petrol')
  const [publicTransportKm, setPublicTransportKm] = useState(2000)
  const [flightsPerYear, setFlightsPerYear] = useState(1)
  const [monthlySpendCHF, setMonthlySpendCHF] = useState(1500)

  function handleCantonChange(code) {
    setCantonCode(code)
    setHeatingType(dominantHeatingType(code))
  }

  const result = useMemo(
    () => calculateFootprint({ cantonCode, householdSize, heatingType, dietType, carKm, carFuel, publicTransportKm, flightsPerYear, monthlySpendCHF }),
    [cantonCode, householdSize, heatingType, dietType, carKm, carFuel, publicTransportKm, flightsPerYear, monthlySpendCHF]
  )

  const cats = [
    { key: 'energy',   value: result.energy },
    { key: 'mobility', value: result.mobility },
    { key: 'food',     value: result.food },
    { key: 'goods',    value: result.goods },
  ]
  const catTotal = cats.reduce((s, c) => s + c.value, 0)

  return (
    <main style={s.main}>
      <h1 style={s.pageTitle}>Calculator</h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 20, marginTop: -16, lineHeight: 1.65 }}>
        Estimate the annual greenhouse gas footprint of a household in Wil, St. Gallen.
        Adjust the inputs below to match your household — results update in real time.
      </p>

      <div style={s.panel}>
        <h2 style={s.panelTitle}>Household profile</h2>

        <div style={s.formGrid}>
          <Field label="Canton">
            <select value={cantonCode} onChange={(e) => handleCantonChange(e.target.value)} style={s.select}>
              {Object.entries(CANTONS).map(([code, c]) => (
                <option key={code} value={code}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Household type">
            <select value={householdSize} onChange={(e) => setHouseholdSize(parseFloat(e.target.value))} style={s.select}>
              {HOUSEHOLD_TYPES.map((h) => (
                <option key={h.label} value={h.value}>{h.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Heating fuel">
            <select value={heatingType} onChange={(e) => setHeatingType(e.target.value)} style={s.select}>
              <option value="oil">Heating oil</option>
              <option value="gas">Natural gas</option>
              <option value="wood">Wood / pellets</option>
              <option value="heatpump">Heat pump</option>
            </select>
          </Field>
          <Field label="Diet">
            <select value={dietType} onChange={(e) => setDietType(e.target.value)} style={s.select}>
              {DIET_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </Field>
        </div>
        <p style={s.fieldNote}>
          Default heating fuel reflects the most common in {CANTONS[cantonCode].name} (BFS GWS 2023).
        </p>

        <hr style={s.hr} />

        <h2 style={s.panelTitle}>Mobility & lifestyle</h2>

        <SliderRow label="Car distance" value={carKm} min={0} max={25000} step={500}
          format={(v) => `${fmt(v)} km / year`} onChange={setCarKm} />
        <Field label="Car fuel type" style={{ marginBottom: 20 }}>
          <select value={carFuel} onChange={(e) => setCarFuel(e.target.value)} style={s.selectNarrow}>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </select>
        </Field>
        <SliderRow label="Public transport" value={publicTransportKm} min={0} max={10000} step={250}
          format={(v) => `${fmt(v)} km / year`} onChange={setPublicTransportKm} />
        <SliderRow label="Flights per year" value={flightsPerYear} min={0} max={6} step={1}
          format={(v) => v === 1 ? '1 flight' : `${v} flights`} onChange={setFlightsPerYear} />
        <SliderRow label="Monthly spend" value={monthlySpendCHF} min={500} max={4000} step={100}
          format={(v) => `CHF ${fmt(v)}`} onChange={setMonthlySpendCHF} />
      </div>

      <div style={s.panel}>
        <div style={s.resultBanner}>
          <div>
            <span style={s.resultBig}>{result.total.toFixed(1)}</span>
            <span style={s.resultUnit}> t CO₂e / year</span>
            <div style={s.resultSub}>household total</div>
          </div>
          <div style={s.resultDivider} />
          <div>
            <span style={{ ...s.resultBig, fontSize: 28 }}>{result.perCapita.toFixed(1)}</span>
            <span style={{ ...s.resultUnit, fontSize: 13 }}> t CO₂e</span>
            <div style={s.resultSub}>per person</div>
          </div>
        </div>

        <hr style={s.hr} />

        <h2 style={s.panelTitle}>Breakdown by category</h2>

        <div style={{ display: 'flex', height: 18, gap: 2, marginBottom: 16 }}>
          {cats.map((c) => {
            const pct = catTotal > 0 ? (c.value / catTotal) * 100 : 0
            return <div key={c.key} title={`${CAT[c.key].label}: ${c.value.toFixed(1)} t`}
              style={{ width: `${pct}%`, background: CAT[c.key].color, transition: 'width 0.25s' }} />
          })}
        </div>

        {cats.map((c) => {
          const meta = CAT[c.key]
          const pct = catTotal > 0 ? (c.value / catTotal * 100) : 0
          const maxVal = Math.max(...cats.map(x => x.value), 0.1)
          return (
            <div key={c.key} style={s.catRow}>
              <span style={{ ...s.catSwatch, background: meta.color }} />
              <span style={s.catLabel}>{meta.label}</span>
              <div style={s.catTrack}>
                <div style={{ height: '100%', width: `${(c.value / maxVal) * 100}%`, background: meta.color, transition: 'width 0.25s' }} />
              </div>
              <span style={s.catPct}>{pct.toFixed(0)}%</span>
              <span style={s.catVal}>{c.value.toFixed(1)} t</span>
            </div>
          )
        })}

        <hr style={s.hr} />

        <h2 style={s.panelTitle}>Benchmark comparison <span style={s.panelTitleSub}>(per capita, t CO₂e / year)</span></h2>

        <BenchRow label="This household" value={result.perCapita} max={14} color="#D52B1E" bold />
        {BENCHMARKS.map((b) => (
          <BenchRow key={b.label} label={b.label} value={b.value} max={14} color="#C8C5BC" sublabel={b.source} />
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, borderTop: '1px solid #E8E5DD', paddingTop: 4 }}>
          {[0,2,4,6,8,10,12,14].map((v) => <span key={v} style={{ fontSize: 11, color: '#AAA' }}>{v}</span>)}
        </div>
      </div>
    </main>
  )
}

function BenchRow({ label, value, max, color, bold, sublabel }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 13, fontWeight: bold ? 700 : 400, color: bold ? '#1A1A1A' : '#666' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: bold ? 700 : 400, color: bold ? '#D52B1E' : '#999', fontVariantNumeric: 'tabular-nums' }}>{value.toFixed(1)} t</span>
      </div>
      <div style={{ height: 7, background: '#E8E5DD', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min((value / max) * 100, 100)}%`, background: color, transition: 'width 0.25s' }} />
      </div>
      {sublabel && <div style={{ fontSize: 11, color: '#AAA', marginTop: 2 }}>{sublabel}</div>}
    </div>
  )
}

function Field({ label, children, style: extra }) {
  return (
    <div style={extra}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function SliderRow({ label, value, min, max, step, format, onChange }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <label style={s.fieldLabel}>{label}</label>
        <span style={{ fontSize: 13, color: '#333', fontVariantNumeric: 'tabular-nums' }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
  )
}

function fmt(n) { return new Intl.NumberFormat('en-CH').format(n) }

const s = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  topBar: { background: '#D52B1E', color: '#fff', flexShrink: 0 },
  topBarInner: {
    maxWidth: 1160, margin: '0 auto', padding: '0 32px',
    display: 'flex', alignItems: 'center', gap: 16, height: 52,
  },
  topBarBrand: {
    display: 'flex', alignItems: 'center', gap: 8,
    color: '#fff', textDecoration: 'none',
    fontSize: 15, fontWeight: 700,
  },
  topBarSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', flex: 1, paddingLeft: 8 },
  topBarGh: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' },
  body: { display: 'flex', flex: 1, maxWidth: 1160, margin: '0 auto', width: '100%', padding: '40px 32px', gap: 56, alignItems: 'flex-start' },
  sidebar: { width: 220, flexShrink: 0, position: 'sticky', top: 28 },
  navList: { listStyle: 'none', borderBottom: '1px solid #D8D5D2', paddingBottom: 16, marginBottom: 20 },
  navItem: { margin: '4px 0' },
  navLink: { fontSize: 15, color: '#333', display: 'block', padding: '4px 0' },
  navLinkActive: { color: '#D52B1E', fontWeight: 700 },
  sidebarBlurb: { fontSize: 13, color: '#666', lineHeight: 1.75 },
  main: { flex: 1, minWidth: 0 },
  pageTitle: { fontSize: 30, fontWeight: 400, color: '#1A1A1A', marginBottom: 24, borderBottom: '2px solid #D52B1E', paddingBottom: 14 },
  panel: { background: '#fff', border: '1px solid #D8D5D2', padding: '28px 32px', marginBottom: 24 },
  panelTitle: { fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 18 },
  panelTitleSub: { fontSize: 12, fontWeight: 400, color: '#999' },
  hr: { border: 'none', borderTop: '1px solid #EEECEA', margin: '26px 0' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px', marginBottom: 14 },
  fieldLabel: { display: 'block', fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 },
  select: { width: '100%', height: 34, border: '1px solid #CCCAC8', padding: '0 8px', fontSize: 14, background: '#fff', color: '#1A1A1A', borderRadius: 0 },
  selectNarrow: { width: '50%', height: 34, border: '1px solid #CCCAC8', padding: '0 8px', fontSize: 14, background: '#fff', color: '#1A1A1A', borderRadius: 0 },
  fieldNote: { fontSize: 12, color: '#999', marginTop: 6 },
  resultBanner: { display: 'flex', alignItems: 'center', gap: 36, paddingBottom: 4 },
  resultBig: { fontSize: 44, color: '#D52B1E', fontWeight: 700, lineHeight: 1 },
  resultUnit: { fontSize: 17, color: '#666' },
  resultSub: { fontSize: 11, color: '#AAA', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 6 },
  resultDivider: { width: 1, height: 54, background: '#EEECEA', flexShrink: 0 },
  catRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  catSwatch: { width: 11, height: 11, flexShrink: 0 },
  catLabel: { fontSize: 13, color: '#555', width: 120, flexShrink: 0 },
  catTrack: { flex: 1, height: 9, background: '#EEECEA', overflow: 'hidden' },
  catPct: { fontSize: 12, color: '#AAA', width: 34, textAlign: 'right', flexShrink: 0 },
  catVal: { fontSize: 13, fontVariantNumeric: 'tabular-nums', width: 46, textAlign: 'right', flexShrink: 0 },
}
