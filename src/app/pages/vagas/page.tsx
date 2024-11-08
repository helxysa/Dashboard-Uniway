'use client'

import { useState, useEffect } from 'react'
import { FiBriefcase, FiDollarSign, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiLoader } from 'react-icons/fi'


interface Vaga {
    id: string
    titulo: string
    empresa: string
    descricao: string
    requisitos: string[]
    salario: string
    localizacao: string
    link: string
    tipo_contrato: string
    curso: string
    createdAt: {
        _seconds: number
        _nanoseconds: number
    }
    updatedAt: {
        _seconds: number
        _nanoseconds: number
    }
}

const vagaInicial = {
    titulo: '',
    empresa: '',
    descricao: '',
    requisitos: [''],
    salario: '',
    localizacao: '',
    tipo_contrato: '',
    curso: '',
    link: ''
}

const tiposContrato = [
    { value: 'CLT', label: 'CLT' },
    { value: 'PJ', label: 'PJ' },
    { value: 'Estágio', label: 'Estágio' },
    { value: 'Temporário', label: 'Temporário' },
    { value: 'Freelancer', label: 'Freelancer' }
]

const cursos = [
    'Relações Internacionais',
    'Ciência da Computação',
    'Engenharia Elétrica'
]

export default function Vagas() {
    const [vagas, setVagas] = useState<Vaga[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [novaVaga, setNovaVaga] = useState(vagaInicial)
    const [modoEdicao, setModoEdicao] = useState(false)
    const [vagaId, setVagaId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filtroTipoContrato, setFiltroTipoContrato] = useState('')
    const [filtroCurso, setFiltroCurso] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [vagaParaExcluir, setVagaParaExcluir] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        fetchVagas()
    }, [])

    const fetchVagas = async () => {
        try {
            const response = await fetch('https://api-uniway-firebase.vercel.app/api/vagas')
            if (!response.ok) throw new Error('Erro ao carregar vagas')
            const data = await response.json()
            setVagas(data.vagas)
            setIsLoading(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar vagas')
            setIsLoading(false)
        }
    }

    const handleEditarVaga = (vaga: Vaga) => {
        setNovaVaga({
            titulo: vaga.titulo,
            empresa: vaga.empresa,
            descricao: vaga.descricao,
            requisitos: [...vaga.requisitos],
            salario: vaga.salario,
            localizacao: vaga.localizacao,
            tipo_contrato: vaga.tipo_contrato,
            curso: vaga.curso,
            link: vaga.link || ''
        })
        setVagaId(vaga.id)
        setModoEdicao(true)
        setShowForm(true)
    }

    const handleAddRequisito = () => {
        setNovaVaga(prev => ({
            ...prev,
            requisitos: [...prev.requisitos, '']
        }))
    }

    const handleRemoveRequisito = (index: number) => {
        setNovaVaga(prev => ({
            ...prev,
            requisitos: prev.requisitos.filter((_, i) => i !== index)
        }))
    }

    const handleRequisitoChange = (index: number, value: string) => {
        const newRequisitos = [...novaVaga.requisitos]
        newRequisitos[index] = value
        setNovaVaga(prev => ({
            ...prev,
            requisitos: newRequisitos
        }))
    }

    const resetForm = () => {
        setNovaVaga(vagaInicial)
        setModoEdicao(false)
        setVagaId(null)
        setShowForm(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const url = 'https://api-uniway-firebase.vercel.app/api/vagas' + (modoEdicao ? `/${vagaId}` : '')
            const method = modoEdicao ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novaVaga)
            })

            if (!response.ok) throw new Error(`Erro ao ${modoEdicao ? 'atualizar' : 'criar'} vaga`)
            
            resetForm()
            fetchVagas()
        } catch (err) {
            alert(`Erro ao ${modoEdicao ? 'atualizar' : 'criar'} vaga`)
        } finally {
            setIsSaving(false)
        }
    }

    const vagasFiltradas = vagas.filter(vaga => {
        const matchSearch = vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vaga.empresa.toLowerCase().includes(searchTerm.toLowerCase())
        const matchTipoContrato = !filtroTipoContrato || vaga.tipo_contrato === filtroTipoContrato
        const matchCurso = !filtroCurso || vaga.curso === filtroCurso

        return matchSearch && matchTipoContrato && matchCurso
    })

    const handleInputChange = (field: string, value: string | string[]) => {
        setNovaVaga((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleExcluirVaga = async (id: string) => {
        setIsDeleting(true)
        try {
            const response = await fetch(`https://api-uniway-firebase.vercel.app/api/vagas/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Erro ao excluir vaga')
            
            await fetchVagas()
            setShowDeleteModal(false)
            setVagaParaExcluir(null)
        } catch (err) {
            alert('Erro ao excluir vaga')
        } finally {
            setIsDeleting(false)
        }
    }

    const DeleteModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h2>
                <p className="text-gray-600 mb-6">
                    Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
                        disabled={isDeleting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => vagaParaExcluir && handleExcluirVaga(vagaParaExcluir)}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <FiLoader className="animate-spin" />
                                Excluindo...
                            </>
                        ) : (
                            'Excluir'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )

    if (isLoading) {
        return (
            <div className="ml-72 p-8 bg-gray-50 min-h-screen">
                <div className="animate-pulse space-y-6">
                    <div className="h-12 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (showForm) {
        return (
            <div className="ml-72 p-8 pb-16 bg-gray-100 min-h-screen">
                <div className="bg-white rounded-xl shadow-lg p-5 max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                        <button
                            onClick={resetForm}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {modoEdicao ? 'Editar Vaga' : 'Nova Vaga'}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Título da vaga *"
                                value={novaVaga.titulo}
                                onChange={e => setNovaVaga(prev => ({ ...prev, titulo: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Nome da empresa *"
                                value={novaVaga.empresa}
                                onChange={e => setNovaVaga(prev => ({ ...prev, empresa: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 placeholder-gray-500"
                                required
                            />
                        </div>

                        <textarea
                            placeholder="Descrição da vaga *"
                            value={novaVaga.descricao}
                            onChange={e => setNovaVaga(prev => ({ ...prev, descricao: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 placeholder-gray-500"
                            rows={3}
                            required
                        />

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Requisitos</span>
                                <button
                                    type="button"
                                    onClick={() => setNovaVaga(prev => ({
                                        ...prev,
                                        requisitos: [...prev.requisitos, '']
                                    }))}
                                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                >
                                    <FiPlus size={16} /> Adicionar Requisito
                                </button>
                            </div>
                            {novaVaga.requisitos.map((req, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Digite um requisito *"
                                        value={req}
                                        onChange={e => {
                                            const newRequisitos = [...novaVaga.requisitos]
                                            newRequisitos[index] = e.target.value
                                            setNovaVaga(prev => ({
                                                ...prev,
                                                requisitos: newRequisitos
                                            }))
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 placeholder-gray-500"
                                        required
                                    />
                                    {novaVaga.requisitos.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setNovaVaga(prev => ({
                                                ...prev,
                                                requisitos: prev.requisitos.filter((_, i) => i !== index)
                                            }))}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Salário *"
                                value={novaVaga.salario}
                                onChange={e => setNovaVaga(prev => ({ ...prev, salario: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Localização *"
                                value={novaVaga.localizacao}
                                onChange={e => setNovaVaga(prev => ({ ...prev, localizacao: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 placeholder-gray-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="url"
                                placeholder="Link da vaga *"
                                value={novaVaga.link}
                                onChange={e => setNovaVaga(prev => ({ ...prev, link: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 placeholder-gray-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                value={novaVaga.tipo_contrato}
                                onChange={e => setNovaVaga(prev => ({ ...prev, tipo_contrato: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900"
                                required
                            >
                                <option value="">Tipo de Contrato *</option>
                                {tiposContrato.map(tipo => (
                                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                ))}
                            </select>

                            <select
                                value={novaVaga.curso}
                                onChange={e => setNovaVaga(prev => ({ ...prev, curso: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900"
                                required
                            >
                                <option value="">Selecione o Curso *</option>
                                {cursos.map(curso => (
                                    <option key={curso} value={curso}>{curso}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-medium shadow-md flex items-center gap-2"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <FiLoader className="animate-spin" />
                                        {modoEdicao ? 'Salvando...' : 'Criando...'}
                                    </>
                                ) : (
                                    modoEdicao ? 'Salvar Alterações' : 'Criar Vaga'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="ml-72 p-8 pb-16 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">Vagas</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md"
                    >
                        <FiPlus /> Nova Vaga
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Pesquisar vagas..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                    </div>
                    <div>
                        <select
                            value={filtroTipoContrato}
                            onChange={e => setFiltroTipoContrato(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                            <option value="" className="text-gray-900">Todos os tipos de contrato</option>
                            {tiposContrato.map(tipo => (
                                <option key={tipo.value} value={tipo.value} className="text-gray-900">{tipo.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={filtroCurso}
                            onChange={e => setFiltroCurso(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                            <option value="" className="text-gray-900">Todos os cursos</option>
                            {cursos.map(curso => (
                                <option key={curso} value={curso} className="text-gray-900">{curso}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                    {vagasFiltradas.length} {vagasFiltradas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
                </div>
            </div>

            <div className="space-y-6">
                {vagasFiltradas.map((vaga) => (
                    <div 
                        key={vaga.id} 
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{vaga.titulo}</h2>
                                <p className="text-purple-600 font-medium text-lg">{vaga.empresa}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleEditarVaga(vaga)}
                                    className="text-purple-600 hover:text-purple-800 transition-colors p-2 rounded-lg hover:bg-purple-50 flex items-center gap-2"
                                    title="Editar vaga"
                                >
                                    <FiEdit2 size={20} />
                                    <span className="text-sm font-medium">Editar</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setVagaParaExcluir(vaga.id)
                                        setShowDeleteModal(true)
                                    }}
                                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
                                    title="Excluir vaga"
                                >
                                    <FiTrash2 size={20} />
                                    <span className="text-sm font-medium">Excluir</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 my-4">
                            <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full">
                                {vaga.tipo_contrato}
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full">
                                {vaga.curso}
                            </span>
                        </div>

                        <p className="text-gray-700 mt-4 text-base leading-relaxed">{vaga.descricao}</p>

                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3">Requisitos:</h3>
                            <ul className="space-y-2">
                                {vaga.requisitos.map((req, index) => (
                                    <li key={index} className="flex items-center gap-2 text-gray-700">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <FiDollarSign className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Salário</p>
                                    <p className="font-semibold text-gray-900">{vaga.salario}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FiMapPin className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Localização</p>
                                    <p className="font-semibold text-gray-900">{vaga.localizacao}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showDeleteModal && <DeleteModal />}
        </div>
    )
}