import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, User, Phone, Calendar, GraduationCap, Ruler, Weight, Heart, MapPin } from 'lucide-react';
import type { Data } from '../../backend';

interface RecordDetailProps {
  record: Data;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  readOnly?: boolean;
}

export function RecordDetail({ record, onEdit, onDelete, isDeleting, readOnly = false }: RecordDetailProps) {
  const imageUrl = record.image?.getDirectURL();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={record.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-border"
              />
            )}
            <div>
              <CardTitle className="text-2xl">{record.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Personal Information</p>
            </div>
          </div>
          {!readOnly && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete} disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {imageUrl && (
          <>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Photo</h3>
              <img
                src={imageUrl}
                alt={record.name}
                className="w-full max-w-md rounded-lg border border-border object-cover"
              />
            </div>
            <Separator />
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Name</span>
            </div>
            <p className="text-base">{record.name}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">Mobile Number</span>
            </div>
            <p className="text-base">{record.mobileNumber}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Date of Birth</span>
            </div>
            <p className="text-base">{record.dateOfBirth}</p>
          </div>

          {record.city && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">City</span>
              </div>
              <p className="text-base">{record.city}</p>
            </div>
          )}

          {record.height && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ruler className="h-4 w-4" />
                <span className="text-sm font-medium">Height</span>
              </div>
              <p className="text-base">{record.height.toString()} cm</p>
            </div>
          )}

          {record.weight && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Weight className="h-4 w-4" />
                <span className="text-sm font-medium">Weight</span>
              </div>
              <p className="text-base">{record.weight.toString()} kg</p>
            </div>
          )}

          {record.education && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm font-medium">Education</span>
              </div>
              <p className="text-base">{record.education}</p>
            </div>
          )}

          {record.hobby && (
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">Hobby</span>
              </div>
              <p className="text-base">{record.hobby}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
