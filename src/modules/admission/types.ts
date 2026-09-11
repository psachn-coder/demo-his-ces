export interface Admission {
  id: string
  patientId: string
  admittedAt: string
  status: 'Activo' | 'Alta' | 'Cancelado'
}
