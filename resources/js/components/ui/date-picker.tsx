import * as React from "react";
import { format, parseISO } from "date-fns";

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  min?: string;
  max?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder, min, max }) => {
  return (
    <input
      type="date"
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      value={value || ""}
      onChange={e => onChange(e.target.value || null)}
      placeholder={placeholder}
      min={min}
      max={max}
    />
  );
};

interface DateTimePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  min?: string;
  max?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, placeholder, min, max }) => {
  return (
    <input
      type="datetime-local"
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      value={value || ""}
      onChange={e => onChange(e.target.value || null)}
      placeholder={placeholder}
      min={min}
      max={max}
    />
  );
};
