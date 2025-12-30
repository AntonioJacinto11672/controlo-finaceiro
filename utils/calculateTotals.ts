export default function calculateTotals(data: EspecificActivityTypeDTO[]) {
  return data.reduce(
    (acc, item) => {
      if (item.type === 'Receitas') {
        acc.receitas += item.value
      }

      if (item.type === 'Despesas') {
        acc.despesas += item.value
      }

      acc.total += item.value

      return acc
    },
    {
      receitas: 0,
      despesas: 0,
      total: 0,
      diferenca: 0,
    }
  )
}
