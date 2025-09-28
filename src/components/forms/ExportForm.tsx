import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Table, BarChart3 } from 'lucide-react';

interface ExportFormProps {
  selectedFormats: string[];
  onFormatsChange: (formats: string[]) => void;
  selectedReportSections: string[];
  onReportSectionsChange: (sections: string[]) => void;
  customExportOptions: string;
  onCustomExportOptionsChange: (options: string) => void;
  customReportSections: string;
  onCustomReportSectionsChange: (sections: string) => void;
}

export const ExportForm: React.FC<ExportFormProps> = ({
  selectedFormats,
  onFormatsChange,
  selectedReportSections,
  onReportSectionsChange,
  customExportOptions,
  onCustomExportOptionsChange,
  customReportSections,
  onCustomReportSectionsChange,
}) => {
  const exportFormats = [
    'Excel (.xlsx)',
    'CSV files',
    'PDF report',
    'HTML report',
    'R workspace (.RData)',
    'MATLAB file (.mat)',
    'JSON format',
    'XML format',
    'PowerPoint presentation',
    'Word document',
    'PNG/JPEG images',
    'SVG graphics',
  ];

  const reportSections = [
    'Executive summary',
    'Data overview',
    'Quality control results',
    'Statistical analysis summary',
    'Visualization gallery',
    'Detailed results tables',
    'Raw data export',
    'Methodology section',
    'Model diagnostics',
    'Supplementary materials',
    'References and citations',
    'Appendices',
  ];

  const handleFormatChange = (format: string, checked: boolean) => {
    if (checked) {
      onFormatsChange([...selectedFormats, format]);
    } else {
      onFormatsChange(selectedFormats.filter(f => f !== format));
    }
  };

  const handleReportSectionChange = (section: string, checked: boolean) => {
    if (checked) {
      onReportSectionsChange([...selectedReportSections, section]);
    } else {
      onReportSectionsChange(selectedReportSections.filter(s => s !== section));
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Formats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Formats
          </CardTitle>
          <CardDescription>
            Select the file formats for exporting your analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exportFormats.map((format) => (
              <div key={format} className="flex items-center space-x-2">
                <Checkbox
                  id={`format-${format}`}
                  checked={selectedFormats.includes(format)}
                  onCheckedChange={(checked) => handleFormatChange(format, checked as boolean)}
                />
                <Label
                  htmlFor={`format-${format}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {format}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Report Sections
          </CardTitle>
          <CardDescription>
            Choose what sections to include in your analysis report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportSections.map((section) => (
              <div key={section} className="flex items-center space-x-2">
                <Checkbox
                  id={`section-${section}`}
                  checked={selectedReportSections.includes(section)}
                  onCheckedChange={(checked) => handleReportSectionChange(section, checked as boolean)}
                />
                <Label
                  htmlFor={`section-${section}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {section}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5 text-primary" />
            Custom Export Options
          </CardTitle>
          <CardDescription>
            Specify any additional export formats or requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter custom export formats, file naming conventions, compression requirements, or other export specifications..."
            value={customExportOptions}
            onChange={(e) => onCustomExportOptionsChange(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Custom Report Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Custom Report Sections
          </CardTitle>
          <CardDescription>
            Add any additional sections or content for your analysis report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe additional report sections, custom analyses, specific tables or figures, regulatory requirements, or other content to include..."
            value={customReportSections}
            onChange={(e) => onCustomReportSectionsChange(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  );
};