import { useReportWizard } from "@/hooks/use-report-wizard";
import {
  StepCategory,
  StepConsent,
  StepDescription,
  StepEvidence,
  StepLocation,
} from "./wizard-steps";
import { WizardShell, WizardSuccess } from "./wizard-shell";

/** Flujo ciudadano de reporte: seis pasos simples y accesibles. */
const ReportPage = () => {
  const wizard = useReportWizard();
  const currentStep = wizard.steps[wizard.step - 1];

  const handleNext = async () => {
    if (wizard.step === 5) {
      const report = await wizard.submit();
      if (report) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    wizard.next();
  };

  const canContinue = (() => {
    switch (wizard.step) {
      case 1:
        return Boolean(wizard.draft.category);
      case 2:
        return wizard.draft.title.trim().length >= 6 && wizard.draft.description.trim().length >= 20;
      case 3:
        return wizard.draft.barrio.length > 1 && wizard.draft.address.trim().length >= 3;
      case 4:
        return wizard.draft.photos.length > 0;
      default:
        return true;
    }
  })();

  if (wizard.step === 6 && wizard.created) {
    return (
      <WizardShell
        step={6}
        totalSteps={6}
        stepTitle="Confirmación"
        stepHelper="Tu reporte quedó registrado en la plataforma."
        canContinue
        submitting={false}
        onNext={() => undefined}
        onBack={() => undefined}
        isLastInputStep={false}
      >
        <WizardSuccess
          caseNumber={wizard.created.caseNumber}
          reportId={wizard.created.id}
          barrio={wizard.created.barrio}
          onReset={wizard.reset}
        />
      </WizardShell>
    );
  }

  return (
    <WizardShell
      step={wizard.step}
      totalSteps={6}
      stepTitle={currentStep?.title ?? "Reportar un problema"}
      stepHelper={currentStep?.helper ?? ""}
      canContinue={canContinue}
      submitting={wizard.submitting}
      onNext={handleNext}
      onBack={wizard.back}
      isLastInputStep={wizard.step === 5}
    >
      {wizard.step === 1 ? (
        <StepCategory draft={wizard.draft} update={wizard.update} errors={wizard.errors} />
      ) : null}
      {wizard.step === 2 ? (
        <StepDescription draft={wizard.draft} update={wizard.update} errors={wizard.errors} />
      ) : null}
      {wizard.step === 3 ? (
        <StepLocation draft={wizard.draft} update={wizard.update} errors={wizard.errors} />
      ) : null}
      {wizard.step === 4 ? (
        <StepEvidence draft={wizard.draft} update={wizard.update} errors={wizard.errors} />
      ) : null}
      {wizard.step === 5 ? (
        <StepConsent draft={wizard.draft} update={wizard.update} errors={wizard.errors} />
      ) : null}
    </WizardShell>
  );
};

export default ReportPage;
