import React, { useState } from 'react'
import { EF, FOOD_KG_PER_PERSON_YEAR, CANTONS } from './data.js'

const FACTORS = [
  { category: 'Energy', name: 'Electricity — Swiss mix', value: EF.electricity, unit: 'kg CO₂e / kWh', quality: 'verified', note: 'Consumption-based, import-adjusted. ~40% higher than production-only grid mix.', source: 'ScienceDirect (2024)', url: 'https://www.sciencedirect.com' },
  { category: 'Energy', name: 'Heating — Natural gas', value: EF.heating.gas, unit: 'kg CO₂e / kWh', quality: 'placeholder', note: 'Pending verification against BAFU primary source.', source: 'BAFU CO₂ statistics', url: 'https://www.bafu.admin.ch/bafu/en/home/topics/climate/state/data/co2-statistics.html' },
  { category: 'Energy', name: 'Heating — Heating oil', value: EF.heating.oil, unit: 'kg CO₂e / kWh', quality: 'placeholder', note: 'Pending verification against BAFU primary source.', source: 'BAFU CO₂ statistics', url: 'https://www.bafu.admin.ch/bafu/en/home/topics/climate/state/data/co2-statistics.html' },
  { category: 'Energy', name: 'Heating — Wood / pellets', value: EF.heating.wood, unit: 'kg CO₂e / kWh', quality: 'verified', note: 'Biogenic combustion. Low net CO₂e per IPCC default.', source: 'IPCC 2006 Guidelines', url: 'https://www.ipcc-nggip.iges.or.jp/public/2006gl/' },
  { category: 'Energy', name: 'Heat pump COP', value: EF.heating.heatpump_cop, unit: '(ratio)', quality: 'indicative', note: 'Typical Swiss air-source heat pump.', source: 'Swiss industry average', url: null },
  { category: 'Mobility', name: 'Car — Petrol', value: EF.car.petrol, unit: 'kg CO₂e / pkm', quality: 'verified', note: 'Average Swiss car, 1.12 occupancy. Includes upstream fuel.', source: 'mobitool v3.0', url: 'https://www.mobitool.ch' },
  { category: 'Mobility', name: 'Car — Diesel', value: EF.car.diesel, unit: 'kg CO₂e / pkm', quality: 'verified', note: 'Average Swiss car, 1.12 occupancy.', source: 'mobitool v3.0', url: 'https://www.mobitool.ch' },
  { category: 'Mobility', name: 'Car — Electric', value: EF.car.electric, unit: 'kg CO₂e / pkm', quality: 'verified', note: 'Swiss consumption electricity mix. Includes vehicle production.', source: 'mobitool v3.0', url: 'https://www.mobitool.ch' },
  { category: 'Mobility', name: 'Public transport', value: EF.publicTransport, unit: 'kg CO₂e / pkm', quality: 'verified', note: 'Swiss average across rail and bus.', source: 'mobitool v3.0', url: 'https://www.mobitool.ch' },
  { category: 'Mobility', name: 'Flight — blended average', value: EF.flightPerTripKg, unit: 'kg CO₂e / trip', quality: 'indicative', note: 'Includes RFI 2.0 multiplier. Blended short/long-haul proxy.', source: 'Swiss Climate AG / DEFRA', url: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting' },
  { category: 'Food', name: 'Diet — Omnivore', value: EF.diet.omnivore, unit: 'kg CO₂e / kg food', quality: 'indicative', note: 'Indicative. Verify exact figure against primary source.', source: 'ESU-services', url: 'https://esu-services.ch' },
  { category: 'Food', name: 'Diet — Vegetarian', value: EF.diet.vegetarian, unit: 'kg CO₂e / kg food', quality: 'indicative', note: 'Indicative.', source: 'ESU-services', url: 'https://esu-services.ch' },
  { category: 'Food', name: 'Diet — Vegan', value: EF.diet.vegan, unit: 'kg CO₂e / kg food', quality: 'indicative', note: 'Indicative.', source: 'ESU-services', url: 'https://esu-services.ch' },
  { category: 'Food', name: 'Food consumption baseline', value: FOOD_KG_PER_PERSON_YEAR, unit: 'kg / person / year', quality: 'verified', note: 'Swiss national average. Scaled by household size.', source: 'menuCH dietary survey', url: 'https://www.blv.admin.ch/blv/en/home/lebensmittel-und-ernaehrung/ernaehrung/menuch.html' },
  { category: 'Goods & services', name: 'Spend-based emission factor', value: EF.goodsSpend, unit: 'kg CO₂e / CHF', quality: 'indicative', note: 'Weakest estimation tier. Derived from household expenditure survey.', source: 'FSO household budget survey', url: 'https://www.bfs.admin.ch/bfs/en/home/statistics/economic-social-situation-population/surveys/hbs.html' },
]

const Q = {
  verified:    { label: 'Verified',     color: '#2D7A4F' },
  indicative:  { label: 'Indicative',   color: '#7D4500' },
  placeholder: { label: 'Placeholder',  color: '#BD2C00' },
}

const CATEGORIES = [...new Set(FACTORS.map((f) => f.category))]
const HK = ['oil', 'gas', 'wood', 'heatpump']
const HL = { oil: 'Oil', gas: 'Gas', wood: 'Wood', heatpump: 'Heat pump' }

export default function Methodology() {
  const [tab, setTab] = useState('factors')

  return (
    <main style={s.main}>
      <h1 style={s.pageTitle}>Methodology & data sources</h1>

      <div style={s.tabs}>
        {[['factors', 'Emission factors'], ['cantons', 'Canton heating mix'], ['limits', 'Limitations']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ ...s.tab, ...(tab === id ? s.tabActive : {}) }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'factors' && (
        <div style={s.panel}>
          <p style={s.intro}>
            All emission factors used in the calculator with quality ratings and source citations.
            Figures marked <QTag q="placeholder" /> are provisional and must be verified before use in formal reporting.
            Legend: <QTag q="verified" /> <QTag q="indicative" /> <QTag q="placeholder" />
          </p>
          {CATEGORIES.map((cat) => (
            <div key={cat} style={{ marginTop: 28 }}>
              <h2 style={s.catHead}>{cat}</h2>
              <table style={s.table}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #D8D5CE' }}>
                    <TH w="22%">Factor</TH>
                    <TH w="7%" right>Value</TH>
                    <TH w="15%">Unit</TH>
                    <TH w="10%">Quality</TH>
                    <TH>Notes</TH>
                    <TH w="17%">Source</TH>
                  </tr>
                </thead>
                <tbody>
                  {FACTORS.filter((f) => f.category === cat).map((f) => (
                    <tr key={f.name} style={{ borderBottom: '1px solid #EEEBE4' }}>
                      <td style={s.td}><strong>{f.name}</strong></td>
                      <td style={{ ...s.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{f.value}</td>
                      <td style={{ ...s.td, color: '#888', fontSize: 12 }}>{f.unit}</td>
                      <td style={s.td}><QTag q={f.quality} /></td>
                      <td style={{ ...s.td, color: '#555', fontSize: 12, lineHeight: 1.6 }}>{f.note}</td>
                      <td style={s.td}>
                        {f.url
                          ? <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>{f.source}</a>
                          : <span style={{ fontSize: 12, color: '#888' }}>{f.source}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {tab === 'cantons' && (
        <div style={s.panel}>
          <p style={s.intro}>
            Share of households using each heating fuel by canton, used to set the calculator default.
            Users can override this. Where no canton-specific data was available, the national average
            (oil 38%, gas 25%, wood 19%, heat pump 18%) is applied. Source: BFS GWS 2023.
          </p>
          <table style={{ ...s.table, marginTop: 20 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #D8D5CE' }}>
                <TH w="32%">Canton</TH>
                {HK.map((k) => <TH key={k} right>{HL[k]}</TH>)}
              </tr>
            </thead>
            <tbody>
              {Object.entries(CANTONS).map(([code, canton]) => {
                const dominant = Object.entries(canton.heatingMix).sort((a, b) => b[1] - a[1])[0][0]
                return (
                  <tr key={code} style={{ borderBottom: '1px solid #EEEBE4' }}>
                    <td style={s.td}><strong>{canton.name}</strong> <span style={{ color: '#AAA', fontSize: 11 }}>{code}</span></td>
                    {HK.map((k) => (
                      <td key={k} style={{ ...s.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: k === dominant ? 700 : 400, color: k === dominant ? '#BD2C00' : '#333' }}>
                        {(canton.heatingMix[k] * 100).toFixed(0)}%
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: '#AAA', marginTop: 10 }}>Bold red = dominant fuel (sets calculator default).</p>
        </div>
      )}

      {tab === 'limits' && (
        <div style={s.panel}>
          <p style={s.intro}>Known limitations and boundary conditions of this model.</p>
          <dl style={{ marginTop: 20 }}>
            {[
              ['Consumption-based accounting', 'Upstream emissions of imported goods and energy are included. Production-side-only figures (e.g. Swiss electricity grid mix ~0.030 kg CO₂e/kWh) are intentionally not used.'],
              ['Single heating fuel per household', 'Heating is modelled using one fuel. The canton mix sets the calculator default only — users can change it.'],
              ['Blended flight factor', 'Flights use a single proxy of 700 kg CO₂e/trip (blended short/long-haul). The Excel model distinguishes both; note this if comparing outputs.'],
              ['Spend-based goods factor', 'Derived from FSO household expenditure data. Does not distinguish product categories. The weakest estimation tier.'],
              ['No canton-level electricity variation', 'Only household-size scaling is applied. Baseline: 2,500 kWh/year for a 2-person household (SwissEnergy / BFE, Nipkow 2021).'],
              ['Placeholder heating factors', 'Gas and oil emission factors are provisional. Verify against the current BAFU CO₂ statistics release before formal use.'],
            ].map(([term, def]) => (
              <div key={term} style={{ borderBottom: '1px solid #EEEBE4', padding: '14px 0' }}>
                <dt style={{ fontSize: 14, fontWeight: 700, color: '#222', marginBottom: 4 }}>{term}</dt>
                <dd style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginLeft: 0 }}>{def}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </main>
  )
}

function QTag({ q }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: 10, fontWeight: 700,
      padding: '1px 5px', border: `1px solid ${Q[q].color}`,
      color: Q[q].color, textTransform: 'uppercase', letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      {Q[q].label}
    </span>
  )
}

function TH({ children, w, right }) {
  return (
    <th style={{ textAlign: right ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: 8, paddingRight: right ? 0 : 12, width: w }}>
      {children}
    </th>
  )
}

const s = {
  main: { flex: 1, minWidth: 0 },
  pageTitle: { fontSize: 28, fontWeight: 400, color: '#1A1A1A', marginBottom: 24, borderBottom: '2px solid #D52B1E', paddingBottom: 14 },
  tabs: { display: 'flex', borderBottom: '1px solid #C8C5BC', marginBottom: 20, gap: 0 },
  tab: { fontSize: 14, padding: '9px 22px', background: '#EEECEA', border: '1px solid #CCCAC8', borderBottom: 'none', color: '#555', cursor: 'pointer', marginRight: 4, position: 'relative', top: 1 },
  tabActive: { background: '#fff', color: '#D52B1E', fontWeight: 700, borderColor: '#CCCAC8', borderBottom: '1px solid #fff' },
  panel: { background: '#fff', border: '1px solid #D8D5D2', padding: '28px 32px' },
  intro: { fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 4 },
  catHead: { fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 10, paddingTop: 4, borderTop: '1px solid #E8E5DD' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  td: { padding: '9px 12px 9px 0', verticalAlign: 'top' },
}
