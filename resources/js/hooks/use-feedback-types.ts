import { useState, useEffect } from 'react'

interface FeedbackType {
    value: string
    label: string
}

export function useFeedbackTypes() {
    const [feedbackTypes, setFeedbackTypes] = useState<FeedbackType[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFeedbackTypes = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch(route('feedbacks.types'))

                if (!response.ok) {
                    throw new Error('Falha ao buscar tipos de feedback')
                }

                const types = await response.json()
                setFeedbackTypes(types)
            } catch (err) {
                console.error('Erro ao buscar tipos de feedback:', err)
                setError(err instanceof Error ? err.message : 'Erro desconhecido')

                // Fallback para tipos estáticos em caso de erro
                setFeedbackTypes([
                    { value: 'bug', label: 'Bug' },
                    { value: 'feature_request', label: 'Solicitação de Funcionalidade' },
                    { value: 'suggestion', label: 'Sugestão' },
                    { value: 'praise', label: 'Elogio' },
                    { value: 'general', label: 'Geral' },
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchFeedbackTypes()
    }, [])

    return { feedbackTypes, loading, error }
}
