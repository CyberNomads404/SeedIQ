"use client"

import * as React from "react"
import { useState } from "react"
import { MessageSquare, Paperclip, X } from "lucide-react"
import { router } from "@inertiajs/react"
import { useFeedbackTypes } from "@/hooks/use-feedback-types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FeedbackModalProps {
    children: React.ReactNode
    defaultType?: string
    showTypeSelect?: boolean
    triggerClassName?: string
}

export function FeedbackModal({
    children,
    defaultType = 'general',
    showTypeSelect = true,
    triggerClassName = ""
}: FeedbackModalProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: defaultType,
        message: '',
        attachment: null as File | null
    })

    // Usar o hook personalizado para buscar tipos
    const { feedbackTypes, loading: loadingTypes } = useFeedbackTypes()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const data = new FormData()
        data.append('type', formData.type)
        data.append('message', formData.message)
        data.append('page', window.location.pathname)
        data.append('device', navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop')
        data.append('user_agent', navigator.userAgent)

        if (formData.attachment) {
            data.append('attachment', formData.attachment)
        }

        router.post(route('feedbacks.store'), data, {
            onSuccess: () => {
                setOpen(false)
                setFormData({ type: defaultType, message: '', attachment: null })
            },
            onFinish: () => setIsLoading(false)
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData(prev => ({ ...prev, attachment: file }))
        }
    }

    const removeAttachment = () => {
        setFormData(prev => ({ ...prev, attachment: null }))
        // Reset file input
        const fileInput = document.getElementById('attachment') as HTMLInputElement
        if (fileInput) fileInput.value = ''
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className={triggerClassName}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Enviar Feedback
                    </DialogTitle>
                    <DialogDescription>
                        Sua opinião é importante para nós. Relate bugs, sugira melhorias ou envie elogios.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {showTypeSelect && (
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Feedback</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                                disabled={loadingTypes}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingTypes ? "Carregando..." : "Selecione o tipo"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {feedbackTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="message">Mensagem *</Label>
                        <Textarea
                            id="message"
                            placeholder="Descreva seu feedback..."
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            required
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="attachment">Anexo (opcional)</Label>
                        {formData.attachment ? (
                            <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    <span className="text-sm truncate">{formData.attachment.name}</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeAttachment}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Input
                                id="attachment"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,.pdf,.doc,.docx"
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.message.trim()}>
                            {isLoading ? 'Enviando...' : 'Enviar Feedback'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
