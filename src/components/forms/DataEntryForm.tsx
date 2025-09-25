import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const fileTypes = [
  { id: 'csv', label: 'CSV Files', description: 'Comma-separated values' },
  { id: 'excel', label: 'Excel Files (.xlsx, .xls)', description: 'Microsoft Excel spreadsheets' },
  { id: 'tsv', label: 'TSV Files', description: 'Tab-separated values' },
  { id: 'json', label: 'JSON Files', description: 'JavaScript Object Notation' },
  { id: 'xml', label: 'XML Files', description: 'Extensible Markup Language' },
  { id: 'sas', label: 'SAS Files', description: 'Statistical Analysis System files' },
  { id: 'spss', label: 'SPSS Files', description: 'Statistical Package for Social Sciences' },
];

interface DataEntryFormProps {
  selectedFileTypes: string[];
  onFileTypesChange: (types: string[]) => void;
  additionalRequirements: string;
  onAdditionalRequirementsChange: (requirements: string) => void;
}

export const DataEntryForm: React.FC<DataEntryFormProps> = ({
  selectedFileTypes,
  onFileTypesChange,
  additionalRequirements,
  onAdditionalRequirementsChange,
}) => {
  const handleFileTypeChange = (fileTypeId: string, checked: boolean) => {
    if (checked) {
      onFileTypesChange([...selectedFileTypes, fileTypeId]);
    } else {
      onFileTypesChange(selectedFileTypes.filter(id => id !== fileTypeId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold text-foreground mb-4 block">
          Select File Types to Accept
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fileTypes.map((fileType) => (
            <div key={fileType.id} className="flex items-start space-x-3">
              <Checkbox
                id={fileType.id}
                checked={selectedFileTypes.includes(fileType.id)}
                onCheckedChange={(checked) => 
                  handleFileTypeChange(fileType.id, checked as boolean)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor={fileType.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {fileType.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {fileType.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="additional-requirements" className="text-base font-semibold text-foreground mb-2 block">
          Additional Data Requirements
        </Label>
        <Textarea
          id="additional-requirements"
          placeholder="Specify any additional data requirements, format specifications, or constraints..."
          value={additionalRequirements}
          onChange={(e) => onAdditionalRequirementsChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Optional: Describe any specific data format requirements, quality standards, or constraints.
        </p>
      </div>
    </div>
  );
};