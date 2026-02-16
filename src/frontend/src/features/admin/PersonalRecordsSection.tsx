import { useState } from 'react';
import { useListAllPersonalRecordsAdmin, useGetPersonalRecordByUserAdmin } from './personalRecordsQueries';
import { RecordDetail } from '../records/RecordDetail';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import type { Principal } from '@icp-sdk/core/principal';
import { useIsAdmin } from './useIsAdmin';

export function PersonalRecordsSection() {
  const [selectedUser, setSelectedUser] = useState<Principal | null>(null);
  const { data: isAdmin } = useIsAdmin();
  const { data: personalRecords = [], isLoading } = useListAllPersonalRecordsAdmin(isAdmin === true);
  const { data: selectedRecord } = useGetPersonalRecordByUserAdmin(selectedUser, isAdmin === true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (personalRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No personal records found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Users with Personal Records</h3>
        <div className="space-y-2">
          {personalRecords.map(([principal, data]) => {
            const isSelected = selectedUser?.toString() === principal.toString();
            const imageUrl = data.image?.getDirectURL();
            const initials = data.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <Card
                key={principal.toString()}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  isSelected ? 'border-primary bg-accent' : ''
                }`}
                onClick={() => setSelectedUser(principal)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {imageUrl && <AvatarImage src={imageUrl} alt={data.name} />}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{data.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {principal.toString().slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        {selectedRecord ? (
          <RecordDetail record={selectedRecord} readOnly />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Select a user to view their personal record
          </div>
        )}
      </div>
    </div>
  );
}
