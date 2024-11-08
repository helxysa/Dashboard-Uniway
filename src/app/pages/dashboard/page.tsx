'use client'

import { useState, useEffect } from 'react'
import { FiUsers, FiBriefcase, FiDollarSign, FiBook } from 'react-icons/fi'

interface User {
    id: string
    name: string
    email: string
    course: string
    saved: string[]
    createdAt: {
        _seconds: number
        _nanoseconds: number
    }
}

interface Job {
    id: string
    titulo: string
    empresa: string
    salario: string
    tipo_contrato: string
    localizacao: string
    curso: string
    createdAt: {
        _seconds: number
        _nanoseconds: number
    }
}

interface DashboardData {
    totalUsers: number
    totalJobs: number
    averageSalary: number
    courseDistribution: { name: string; value: number }[]
    jobsByMonth: { month: string; jobs: number }[]
    contractTypes: { name: string; value: number }[]
    topLocations: { name: string; value: number }[]
    recentUsers: number
    recentJobs: number
}

const COLORS = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500']

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [usersRes, jobsRes] = await Promise.all([
                    fetch('https://api-uniway-firebase.vercel.app/api/users'),
                    fetch('https://api-uniway-firebase.vercel.app/api/vagas')
                ])

                const [usersData, jobsData] = await Promise.all([
                    usersRes.json(),
                    jobsRes.json()
                ])

                const courseCount: { [key: string]: number } = {}
                const contractCount: { [key: string]: number } = {}
                const locationCount: { [key: string]: number } = {}
                const jobsByMonth: { [key: string]: number } = {}

                usersData.users.forEach((user: User) => {
                    courseCount[user.course] = (courseCount[user.course] || 0) + 1
                })

                let totalSalary = 0
                let validSalaryCount = 0

                jobsData.vagas.forEach((job: Job) => {
                    contractCount[job.tipo_contrato] = (contractCount[job.tipo_contrato] || 0) + 1
                    locationCount[job.localizacao] = (locationCount[job.localizacao] || 0) + 1
                    const month = new Date(job.createdAt._seconds * 1000).toLocaleString('pt-BR', { month: 'short' })
                    jobsByMonth[month] = (jobsByMonth[month] || 0) + 1
                    
                    const salary = parseInt(job.salario.replace(/[R$\s.]/g, ''))
                    if (!isNaN(salary) && salary > 0) {
                        totalSalary += salary
                        validSalaryCount++
                    }
                })

                const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
                const recentUsers = usersData.users.filter((user: User) => 
                    user.createdAt._seconds * 1000 > oneWeekAgo
                ).length
                const recentJobs = jobsData.vagas.filter((job: Job) => 
                    job.createdAt._seconds * 1000 > oneWeekAgo
                ).length

                setData({
                    totalUsers: usersData.users.length,
                    totalJobs: jobsData.vagas.length,
                    averageSalary: validSalaryCount > 0 ? totalSalary / validSalaryCount : 0,
                    courseDistribution: Object.entries(courseCount).map(([name, value]) => ({ name, value })),
                    jobsByMonth: Object.entries(jobsByMonth).map(([month, jobs]) => ({ month, jobs })),
                    contractTypes: Object.entries(contractCount).map(([name, value]) => ({ name, value })),
                    topLocations: Object.entries(locationCount)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([name, value]) => ({ name, value })),
                    recentUsers,
                    recentJobs
                })
            } catch (error) {
                console.error('Erro ao carregar dados:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading || !data) {
        return (
            <div className="ml-72 p-8 bg-gray-50 min-h-screen">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const getMaxValue = (arr: any[], key: string) => Math.max(...arr.map(item => item[key]))

    return (
        <div className="ml-72 p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-[3px] border-gray-300 hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <FiUsers className="text-blue-600 text-xl" />
                        </div>
                    </div>
                    <h2 className="text-gray-500 text-sm">Total de Usuários</h2>
                    <p className="text-2xl font-bold text-gray-800">{data.totalUsers}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-[3px] border-gray-300 hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <FiBriefcase className="text-purple-600 text-xl" />
                        </div>
                    </div>
                    <h2 className="text-gray-500 text-sm">Total de Vagas</h2>
                    <p className="text-2xl font-bold text-gray-800">{data.totalJobs}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-[3px] border-gray-300 hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <FiDollarSign className="text-green-600 text-xl" />
                        </div>
                    </div>
                    <h2 className="text-gray-500 text-sm">Média Salarial</h2>
                    <p className="text-2xl font-bold text-gray-800">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(data.averageSalary)}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-[3px] border-gray-300 hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <FiBook className="text-yellow-600 text-xl" />
                        </div>
                    </div>
                    <h2 className="text-gray-500 text-sm">Total de Cursos</h2>
                    <p className="text-2xl font-bold text-gray-800">{data.courseDistribution.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border-[3px] border-gray-300 hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Vagas por Mês</h2>
                    
                    <div className="space-y-4">
                        {data.jobsByMonth.map((item, index) => {
                            const maxValue = Math.max(...data.jobsByMonth.map(item => item.jobs))
                            const percentage = (item.jobs / maxValue) * 100
                            return (
                                <div key={index} className="space-y-1 flex flex-col items-center w-full">
                                    <div className="flex justify-between text-sm w-full">
                                        <span className="text-gray-600 w-20">{item.month}</span>
                                        <span className="text-gray-500">{item.jobs} vagas</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-500 h-full rounded-full transition-all duration-500 hover:bg-purple-600"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded"></div>
                            <span className="text-sm text-gray-600">
                                Total de Vagas: {data.jobsByMonth.reduce((acc, curr) => acc + curr.jobs, 0)} vagas
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border-[3px] border-gray-300 hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribuição por Curso</h2>
                    <div className="space-y-4">
                        {data.courseDistribution.map((item, index) => {
                            const total = data.courseDistribution.reduce((acc, curr) => acc + curr.value, 0)
                            const percentage = (item.value / total) * 100
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.name}</span>
                                        <span className="text-gray-500">{percentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${COLORS[index % COLORS.length]} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border-[3px] border-gray-300 hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Tipos de Contrato</h2>
                    <div className="space-y-4">
                        {data.contractTypes.map((item, index) => {
                            const maxValue = getMaxValue(data.contractTypes, 'value')
                            const percentage = (item.value / maxValue) * 100
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.name}</span>
                                        <span className="text-gray-500">{item.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200 hover:border-gray-300 transition-all duration-300">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Localizações</h2>
                    <div className="space-y-4">
                        {data.topLocations.map((item, index) => {
                            const maxValue = getMaxValue(data.topLocations, 'value')
                            const percentage = (item.value / maxValue) * 100
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.name}</span>
                                        <span className="text-gray-500">{item.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}