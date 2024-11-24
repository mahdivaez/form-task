"use client"

import { useState } from "react"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { Input } from "@/components/ui/input"

interface PersianDatePickerProps {
  value: string
  onChange: (date: string) => void
  error?: string
}

export function PersianDatePicker({ value, onChange, error }: PersianDatePickerProps) {
  const [inputValue, setInputValue] = useState(value)

  return (
    <div className="relative">
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        value={value}
        onChange={(date) => {
          if (date?.isValid) {
            const formattedDate = date.format("YYYY/MM/DD")
            onChange(formattedDate)
            setInputValue(formattedDate)
          }
        }}
        render={<Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`w-full rounded-full ${error ? 'border-red-500' : ''}`}
          placeholder="انتخاب تاریخ تولد"
        />}
      />
    </div>
  )
}
