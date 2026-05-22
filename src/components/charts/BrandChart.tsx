import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { fetchAllProducts } from '../../lib/api'
import { queryKeys } from '../../lib/queryKeys'
import { Skeleton } from '../../components/ui/UI'
import styles from './BrandChart.module.css'

const COLORS = [
  '#6366f1', '#818cf8', '#a5b4fc', '#4f46e5',
  '#7c3aed', '#8b5cf6', '#a78bfa', '#5b21b6',
]

export function BrandChart() {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: queryKeys.allProducts(),
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 10,
  })

  const brandCounts = allProducts.reduce<Record<string, number>>((acc, p) => {
    if (p.brand) acc[p.brand] = (acc[p.brand] ?? 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([brand, count]) => ({ brand, count }))

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title}>Products by Brand</p>
        <p className={styles.sub}>Top {chartData.length} brands</p>
      </div>

      {isLoading ? (
        <div className={styles.skeletonWrap}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={i % 2 === 0 ? 80 : 50} />
          ))}
        </div>
      ) : (
        <div
          role="img"
          aria-label="Bar chart showing product count per brand"
          className={styles.chart}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 60 }}>
              <XAxis
                dataKey="brand"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: '#18181f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#f1f5f9',
                }}
                cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                formatter={(value: number) => [value, 'Products']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
