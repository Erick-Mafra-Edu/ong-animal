import React from 'react'
import { OngAnimalForm } from '@/components/ong-animal-form'

export default function CadastrarAnimalPage() {
  return (
    <div className="pb-28 md:pb-6">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">
        Cadastrar animal{' '}
        <span aria-hidden="true">🐾</span>
      </h1>
      <p className="mt-1 mb-8 text-sm text-slate-500">
        Adicione um novo animal ao catálogo de adoção.
      </p>

      <OngAnimalForm />
    </div>
  )
}
