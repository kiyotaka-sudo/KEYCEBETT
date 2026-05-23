import React from 'react'
import { motion } from 'framer-motion'
import { useMyBets } from '@/hooks/useBets'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatXAF } from '@/config/constants'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const MyBetsPage: React.FC = () => {
  const { data: betsPage, isLoading } = useMyBets()
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-title font-bold">Mes Paris</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : !betsPage?.content || betsPage.content.length === 0 ? (
        <EmptyState title="Aucun pari" description="Vous n'avez pas encore placé de paris." icon="🎫" />
      ) : (
        <div className="space-y-4">
          {betsPage.content.map((bet) => {
            const isExpanded = expandedId === bet.id
            return (
              <div key={bet.id} className="kb-card overflow-hidden">
                {/* Header du pari */}
                <div 
                  className="p-4 cursor-pointer hover:bg-surface-2/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : bet.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold">{bet.betType === 'SIMPLE' ? 'Pari Simple' : `Pari Combiné (${bet.selections.length})`}</span>
                        <Badge variant={
                          bet.status === 'WON' ? 'success' : 
                          bet.status === 'LOST' ? 'danger' : 
                          bet.status === 'PENDING' ? 'warning' : 'info'
                        }>{bet.status}</Badge>
                      </div>
                      <p className="text-xs text-text-muted">{format(new Date(bet.placedAt), 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-2/50">
                    <div>
                      <p className="text-xs text-text-muted">Mise totale</p>
                      <p className="font-mono font-bold">{formatXAF(bet.totalStake)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted text-right">Cotes Totales</p>
                      <p className="font-mono font-bold text-right">{bet.totalOdds.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted text-right">Gain potentiel</p>
                      <p className={`font-mono font-bold text-right ${bet.status === 'WON' ? 'text-accent' : ''}`}>
                        {formatXAF(bet.potentialWin)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Détails des sélections */}
                {isExpanded && (
                  <div className="bg-surface-2/30 p-4 border-t border-surface-2 border-dashed space-y-3">
                    {bet.selections.map(selection => (
                      <div key={selection.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{selection.homeTeam} vs {selection.awayTeam}</p>
                          <p className="text-xs text-text-muted mt-0.5">
                            <span className="text-primary font-semibold">{selection.selection}</span> ({selection.marketType})
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-mono">{selection.oddValueAtBetTime.toFixed(2)}</span>
                          <Badge variant={
                            selection.status === 'WON' ? 'success' : 
                            selection.status === 'LOST' ? 'danger' : 
                            selection.status === 'PENDING' ? 'warning' : 'info'
                          }>{selection.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
