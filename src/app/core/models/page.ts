export interface Page<I> {
  totalPages: number
  number: number
  size: number
  totalElements: number
  content: I[]
}
