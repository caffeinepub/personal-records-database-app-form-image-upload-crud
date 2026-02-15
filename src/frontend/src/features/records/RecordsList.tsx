import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Phone, MapPin } from 'lucide-react';
import type { Data } from '../../backend';

interface RecordsListProps {
  records: Data[];
  selectedRecord?: Data;
  onSelect: (record: Data) => void;
  isLoading?: boolean;
}

export function RecordsList({ records, selectedRecord, onSelect, isLoading }: RecordsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold mb-2">No Records Yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first record to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const isSelected = selectedRecord?.name === record.name && 
                          selectedRecord?.mobileNumber === record.mobileNumber;
        const imageUrl = record.image?.getDirectURL();
        const initials = record.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <Card
            key={record.mobileNumber}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(record)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {imageUrl && <AvatarImage src={imageUrl} alt={record.name} />}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{record.name}</h3>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span className="truncate">{record.mobileNumber}</span>
                    </div>
                    {record.city && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{record.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
