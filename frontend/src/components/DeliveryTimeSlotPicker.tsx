import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Clock } from 'lucide-react';

interface DeliveryTimeSlotPickerProps {
  selectedSlot: { start: string; end: string } | null;
  onSelectSlot: (slot: { start: string; end: string }) => void;
}

const timeSlots = [
  { start: '12:00', end: '14:00', label: 'Astăzi 12:00 - 14:00' },
  { start: '14:00', end: '16:00', label: 'Astăzi 14:00 - 16:00' },
  { start: '16:00', end: '18:00', label: 'Astăzi 16:00 - 18:00' },
  { start: '18:00', end: '20:00', label: 'Astăzi 18:00 - 20:00' },
];

export default function DeliveryTimeSlotPicker({ selectedSlot, onSelectSlot }: DeliveryTimeSlotPickerProps) {
  const selectedValue = selectedSlot ? `${selectedSlot.start}-${selectedSlot.end}` : '';

  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={(value) => {
        const [start, end] = value.split('-');
        onSelectSlot({ start, end });
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {timeSlots.map((slot) => {
          const value = `${slot.start}-${slot.end}`;
          const isSelected = selectedValue === value;
          
          return (
            <div
              key={value}
              className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value} className="flex items-center gap-2 flex-1 cursor-pointer font-normal">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={isSelected ? 'font-semibold' : ''}>{slot.label}</span>
              </Label>
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
}
