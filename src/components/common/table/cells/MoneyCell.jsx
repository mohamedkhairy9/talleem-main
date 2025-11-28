import React from 'react'

export default function MoneyCell({ info , currency = '$' }) {
  return (
    <div className="text-sm font-medium text-green-600">
        {currency} {info.getValue()?.toLocaleString()}
    </div>
  )
}
