import { useEffect, useRef } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import "../styles/pages/business-step-background.css";

type WorkflowStep = {
  icon: LucideIcon;
  title: string;
  description: string;
  image?: string;
  backgroundReveal?: boolean;
};
type WorkflowSectionProps = {
  title: string;
  description: string;
  steps: WorkflowStep[];
};

export default function WorkflowSection({
  title,
  description,
  steps,
}: WorkflowSectionProps) {
  const workflowSectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const workflowSection = workflowSectionRef.current;

    if (!workflowSection) return;

    const cards =
      workflowSection.querySelectorAll<HTMLElement>(".business-step");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    cards.forEach((card) => observer.observe(card));

    const sizeObserver = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        const card = target as HTMLElement;
        if (!card.matches(":hover, :focus-within")) {
          card.style.setProperty("--step-rest-height", `${card.offsetHeight}px`);
        }
      });
    });
    cards.forEach((card) => {
      card.style.setProperty("--step-rest-height", `${card.offsetHeight}px`);
      sizeObserver.observe(card);
    });

    return () => {
      observer.disconnect();
      sizeObserver.disconnect();
    };
  }, []);

  return (
    <section ref={workflowSectionRef} className="business-how-it-works">
      <div className="business-section-heading">
        <span className="eyebrow">HOW IT WORKS</span>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      <div className="business-steps">
        {steps.map((step, index) => {
          const StepIcon = step.icon;

          return (
            <div
              className={`business-step${step.backgroundReveal ? " business-step--background" : step.image ? " business-step--preview" : ""}`}
              key={index}
              tabIndex={step.backgroundReveal || step.image ? 0 : undefined}
            >
              {step.backgroundReveal && (
                <span className="business-step-shadow" aria-hidden="true" />
              )}
              {step.image && (
                <img
                  className="business-step-preview"
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                />
              )}
              <div className="business-step-icon">
                <StepIcon size={25} strokeWidth={2} />
              </div>

              {step.backgroundReveal && (
                <span className="business-step-label">
                  {language === "TH" ? "ขั้นตอนที่" : "Step"} {index + 1}
                </span>
              )}
              <h3>{step.title}</h3>

              <p>{step.description}</p>

              {index !== steps.length - 1 && (
                <div className="business-step-arrow">
                  <ArrowRight size={22} strokeWidth={1.8} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
