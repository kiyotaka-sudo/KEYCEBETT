import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartDataPoint } from '@/types/dashboard.types'

interface RevenueChartProps {
  data: ChartDataPoint[]
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#F5A623" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#F5A623', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <CartesianGrid stroke="#2E3148" strokeDasharray="5 5" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#8B8FA8" 
            tick={{ fill: '#8B8FA8', fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#8B8FA8" 
            tick={{ fill: '#8B8FA8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#242738', borderColor: '#2E3148', borderRadius: '8px' }}
            itemStyle={{ color: '#F5A623' }}
            formatter={(value: number) => [`${value} XAF`, 'Revenus']}
            labelStyle={{ color: '#8B8FA8', marginBottom: '4px' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
