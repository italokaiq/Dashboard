export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(value) {
  try {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return 'R$ 0,00';
  }
}

export function formatDate(date) {
  try {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
}