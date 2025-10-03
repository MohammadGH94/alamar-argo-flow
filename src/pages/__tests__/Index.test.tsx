import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const supabaseMocks = vi.hoisted(() => {
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
  const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });
  const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq });
  const mockInvoke = vi.fn().mockResolvedValue({ data: {}, error: null });
  const mockSignOut = vi.fn().mockResolvedValue(undefined);
  return { mockSelect, mockEq, mockSingle, mockUpdate, mockInvoke, mockSignOut };
});

const authMocks = vi.hoisted(() => ({
  mockUseAuth: () => ({
    user: { id: 'test-user', email: 'user@example.com' },
    loading: false
  })
}));

const toastMocks = vi.hoisted(() => ({
  mockToast: vi.fn()
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: supabaseMocks.mockSelect,
      update: supabaseMocks.mockUpdate
    }),
    functions: {
      invoke: supabaseMocks.mockInvoke
    },
    auth: {
      signOut: supabaseMocks.mockSignOut
    }
  }
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: authMocks.mockUseAuth
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMocks.mockToast })
}));

vi.mock('@/components/UserInfoForm', () => ({
  UserInfoForm: ({ onSubmit }: { onSubmit: (values: { name: string; email: string }) => void }) => (
    <button onClick={() => onSubmit({ name: 'Tester', email: 'tester@example.com' })}>
      Mock User Info Form
    </button>
  )
}));

vi.mock('@/components/forms/DataEntryForm', () => ({
  DataEntryForm: () => <div data-testid="form-DataEntryForm" />
}));
vi.mock('@/components/forms/PowerAnalysisForm', () => ({
  PowerAnalysisForm: () => <div data-testid="form-PowerAnalysisForm" />
}));
vi.mock('@/components/forms/QCForm', () => ({
  QCForm: () => <div data-testid="form-QCForm" />
}));
vi.mock('@/components/forms/LODHandlingForm', () => ({
  LODHandlingForm: () => <div data-testid="form-LODHandlingForm" />
}));
vi.mock('@/components/forms/OutlierDetectionForm', () => ({
  OutlierDetectionForm: () => <div data-testid="form-OutlierDetectionForm" />
}));
vi.mock('@/components/forms/NormalizationForm', () => ({
  NormalizationForm: () => <div data-testid="form-NormalizationForm" />
}));
vi.mock('@/components/forms/BatchEffectForm', () => ({
  BatchEffectForm: () => <div data-testid="form-BatchEffectForm" />
}));
vi.mock('@/components/forms/ExploratoryAnalysisForm', () => ({
  ExploratoryAnalysisForm: () => <div data-testid="form-ExploratoryAnalysisForm" />
}));
vi.mock('@/components/forms/GroupComparisonForm', () => ({
  GroupComparisonForm: () => <div data-testid="form-GroupComparisonForm" />
}));
vi.mock('@/components/forms/DataTransformationForm', () => ({
  DataTransformationForm: () => <div data-testid="form-DataTransformationForm" />
}));
vi.mock('@/components/forms/StatisticalModelingForm', () => ({
  StatisticalModelingForm: () => <div data-testid="form-StatisticalModelingForm" />
}));
vi.mock('@/components/forms/ComparatorsForm', () => ({
  ComparatorsForm: () => <div data-testid="form-ComparatorsForm" />
}));
vi.mock('@/components/forms/MultipleTestingCorrectionForm', () => ({
  MultipleTestingCorrectionForm: () => <div data-testid="form-MultipleTestingCorrectionForm" />
}));
vi.mock('@/components/forms/SensitivityAnalysisForm', () => ({
  SensitivityAnalysisForm: () => <div data-testid="form-SensitivityAnalysisForm" />
}));
vi.mock('@/components/forms/VisualizationForm', () => ({
  VisualizationForm: () => <div data-testid="form-VisualizationForm" />
}));
vi.mock('@/components/forms/ExportForm', () => ({
  ExportForm: () => <div data-testid="form-ExportForm" />
}));

import Index from '../Index';
import { beforeEach } from 'vitest';
import '@testing-library/jest-dom';

const { mockInvoke, mockSelect, mockSingle } = supabaseMocks;
const { mockToast } = toastMocks;

const buildPipelineState = () => ({
  userInfo: {
    name: 'Existing User',
    email: 'existing@example.com'
  },
  dataEntry: {
    selectedFileTypes: [],
    additionalRequirements: ''
  },
  powerAnalysis: {
    selectedMethod: '',
    selectedEffectSizes: [],
    powerLevel: '0.8',
    alphaLevel: '0.05',
    customEffectSize: '',
    customMethods: ''
  },
  qc: {
    selectedQCSteps: [],
    qualityThreshold: '',
    customQCSteps: ''
  },
  lodHandling: {
    selectedMethod: '',
    lodThreshold: '',
    customMethod: ''
  },
  outlierDetection: {
    selectedDetectionMethods: [],
    selectedHandlingStrategies: [],
    zScoreThreshold: '3',
    iqrMultiplier: '1.5',
    customDetectionMethods: ''
  },
  normalization: {
    selectedMethod: '',
    selectedBridgingOptions: [],
    customMethod: ''
  },
  batchEffect: {
    selectedDetectionMethods: [],
    selectedCorrectionMethod: '',
    selectedBatchVariables: [],
    preservedVariables: '',
    customCorrectionMethod: ''
  },
  exploratoryAnalysis: {
    selectedMethods: [],
    customMethods: ''
  },
  groupComparison: {
    numberOfGroups: '2',
    timePoints: '1',
    dataType: 'cross-sectional',
    selectedModels: [],
    useMachineLearning: false
  },
  dataTransformation: {
    selectedTransformations: [],
    customTransformations: ''
  },
  statisticalModeling: {
    selectedDiagnostics: [],
    customDiagnostics: ''
  },
  comparators: {
    selectedContrasts: [],
    selectedExtractionValues: [],
    customContrasts: '',
    customExtractionValues: ''
  },
  multipleTestingCorrection: {
    selectedMethod: '',
    selectedAdditionalMethods: [],
    customMethods: ''
  },
  sensitivityAnalysis: {
    selectedMethods: [],
    selectedParameterTypes: [],
    selectedRobustnessChecks: [],
    parameterRanges: '',
    stabilityThreshold: '10',
    customMethods: ''
  },
  visualization: {
    selectedGraphs: [],
    selectedTables: [],
    customVisualizations: '',
    customTables: ''
  },
  export: {
    selectedFormats: [],
    selectedReportSections: [],
    customExportOptions: '',
    customReportSections: ''
  }
});

describe('Index pipeline navigation', () => {
  beforeEach(() => {
    mockInvoke.mockClear();
    mockToast.mockClear();
    mockSelect.mockClear();
    mockSingle.mockClear();
  });

  it('saves before moving forward with the Next button and allows moving back', async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const userInfoButton = await screen.findByRole('button', { name: /mock user info form/i });
    await userEvent.click(userInfoButton);

    const dataEntryHeadings = await screen.findAllByRole('heading', {
      level: 3,
      name: /Data Entry/
    });
    expect(dataEntryHeadings[0]).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => expect(mockInvoke).toHaveBeenCalledTimes(1));
    const powerHeadings = await screen.findAllByRole('heading', {
      level: 3,
      name: /Power Analysis/
    });
    expect(powerHeadings[0]).toBeInTheDocument();

    const previousButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(previousButton);

    const backToData = await screen.findAllByRole('heading', {
      level: 3,
      name: /Data Entry/
    });
    expect(backToData[0]).toBeInTheDocument();
    expect(mockInvoke).toHaveBeenCalledTimes(1);
  });

  it('allows jumping to a later step from the progress tracker', async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const userInfoButton = await screen.findByRole('button', { name: /mock user info form/i });
    await userEvent.click(userInfoButton);

    const [progressButton] = await screen.findAllByRole('button', { name: /visualization/i });
    await userEvent.click(progressButton);

    await waitFor(() => expect(mockInvoke).toHaveBeenCalled());
    const visualizationHeadings = await screen.findAllByRole('heading', {
      level: 3,
      name: /Visualization/
    });
    expect(visualizationHeadings[0]).toBeInTheDocument();
  });

  it('clears the edit context when restarting a pipeline so a new save creates a fresh record', async () => {
    const pipelineData = buildPipelineState();
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'existing-pipeline',
        pipeline_data: pipelineData,
        status: 'draft'
      },
      error: null
    });

    render(
      <MemoryRouter initialEntries={[ '/?edit=existing-pipeline' ]}>
        <Index />
      </MemoryRouter>
    );

    const userInfoButton = await screen.findByRole('button', { name: /mock user info form/i });
    await userEvent.click(userInfoButton);

    const [exportStepButton] = await screen.findAllByRole('button', { name: /Export/i });
    await userEvent.click(exportStepButton);
    await waitFor(() => expect(mockInvoke).toHaveBeenCalled());

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    const restartButton = await screen.findByRole('button', { name: /configure new pipeline/i });
    mockSelect.mockClear();
    mockSingle.mockClear();

    await userEvent.click(restartButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /mock user info form/i })).toBeInTheDocument();
    });

    expect(mockSelect).not.toHaveBeenCalled();
    expect(mockSingle).not.toHaveBeenCalled();
  });
});
