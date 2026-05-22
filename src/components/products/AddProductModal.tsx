import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Plus, AlertCircle } from 'lucide-react'
import { addProduct } from '../../lib/api'
import type { NewProductForm } from '../../types'
import { Spinner } from '../../components/ui/UI'
import styles from './AddProductModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const emptyForm: NewProductForm = {
  title: '',
  description: '',
  price: 0,
  brand: '',
  category: '',
  stock: 0,
}

type FormErrors = Partial<Record<keyof NewProductForm, string>>

function validate(form: NewProductForm): FormErrors {
  const errors: FormErrors = {}
  if (!form.title.trim()) errors.title = 'Title is required'
  else if (form.title.trim().length < 3) errors.title = 'Title must be at least 3 characters'
  if (!form.description.trim()) errors.description = 'Description is required'
  if (!form.brand.trim()) errors.brand = 'Brand is required'
  if (!form.category.trim()) errors.category = 'Category is required'
  if (form.price <= 0) errors.price = 'Price must be greater than 0'
  if (form.stock < 0) errors.stock = 'Stock cannot be negative'
  return errors
}

export function AddProductModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<NewProductForm>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof NewProductForm, boolean>>>({})
  const firstInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onClose()
      setForm(emptyForm)
      setErrors({})
      setTouched({})
    },
  })

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const set = <K extends keyof NewProductForm>(key: K, value: NewProductForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (touched[key]) {
      const newErrors = validate({ ...form, [key]: value })
      setErrors((prev) => ({ ...prev, [key]: newErrors[key] }))
    }
  }

  const blur = (key: keyof NewProductForm) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    const newErrors = validate(form)
    setErrors((prev) => ({ ...prev, [key]: newErrors[key] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]))
    setTouched(allTouched as typeof touched)
    const newErrors = validate(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    mutation.mutate(form)
  }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            <Plus size={16} aria-hidden="true" />
            Add Product
          </h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <Field
            id="p-title"
            label="Product title *"
            error={touched.title ? errors.title : undefined}
          >
            <input
              ref={firstInputRef}
              id="p-title"
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              onBlur={() => blur('title')}
              className={styles.input}
              placeholder="e.g. Wireless Headphones Pro"
              aria-describedby={errors.title ? 'p-title-err' : undefined}
            />
          </Field>

          <Field
            id="p-desc"
            label="Description *"
            error={touched.description ? errors.description : undefined}
          >
            <textarea
              id="p-desc"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              onBlur={() => blur('description')}
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Product description…"
              rows={3}
            />
          </Field>

          <div className={styles.row2}>
            <Field
              id="p-brand"
              label="Brand *"
              error={touched.brand ? errors.brand : undefined}
            >
              <input
                id="p-brand"
                type="text"
                value={form.brand}
                onChange={(e) => set('brand', e.target.value)}
                onBlur={() => blur('brand')}
                className={styles.input}
                placeholder="e.g. Sony"
              />
            </Field>

            <Field
              id="p-category"
              label="Category *"
              error={touched.category ? errors.category : undefined}
            >
              <input
                id="p-category"
                type="text"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                onBlur={() => blur('category')}
                className={styles.input}
                placeholder="e.g. electronics"
              />
            </Field>
          </div>

          <div className={styles.row2}>
            <Field
              id="p-price"
              label="Price ($) *"
              error={touched.price ? errors.price : undefined}
            >
              <input
                id="p-price"
                type="number"
                value={form.price || ''}
                onChange={(e) => set('price', Number(e.target.value))}
                onBlur={() => blur('price')}
                className={styles.input}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </Field>

            <Field
              id="p-stock"
              label="Stock"
              error={touched.stock ? errors.stock : undefined}
            >
              <input
                id="p-stock"
                type="number"
                value={form.stock || ''}
                onChange={(e) => set('stock', Number(e.target.value))}
                onBlur={() => blur('stock')}
                className={styles.input}
                placeholder="0"
                min="0"
              />
            </Field>
          </div>

          {mutation.isError && (
            <div className={styles.mutationError} role="alert">
              <AlertCircle size={14} aria-hidden="true" />
              {(mutation.error as Error).message}
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Spinner size={14} label="Saving…" />
                  Saving…
                </>
              ) : (
                <>
                  <Plus size={14} aria-hidden="true" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className={styles.fieldError} role="alert">
          <AlertCircle size={11} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
