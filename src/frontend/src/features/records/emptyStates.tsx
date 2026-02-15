import { Card, CardContent } from '@/components/ui/card';
import { User, FileText } from 'lucide-react';

export function EmptyRecordsState() {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Records Yet</h3>
        <p className="text-muted-foreground">
          Create your first personal record to get started
        </p>
      </CardContent>
    </Card>
  );
}

export function NoRecordSelectedState() {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Record Selected</h3>
        <p className="text-muted-foreground">
          Select a record from the list to view details
        </p>
      </CardContent>
    </Card>
  );
}
