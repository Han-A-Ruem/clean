
import { Check } from "lucide-react";
import { BookingStep } from "@/types/booking";

interface BookingProgressProps {
  currentStep: BookingStep;
  selectedService: string | null;
}

const BookingProgress = ({ currentStep, selectedService }: BookingProgressProps) => {
  const getProgress = (): number => {
    const steps: BookingStep[] = ["service"];
    
    if (selectedService === "kitchen" || selectedService === "bathroom" || selectedService === "fridge") {
      steps.push(selectedService);
    }
    
    steps.push(
      "info",
      "reminder",
      "disposal",
      "cancellation",
      "payment_details",
      "payment"
    );

    const currentIndex = steps.indexOf(currentStep);
    return Math.max(0, currentIndex + 1);
  };

  const totalSteps = selectedService === "kitchen" || selectedService === "bathroom" || selectedService === "fridge" ? 8 : 7;
  const currentProgress = getProgress();

  return (
    <div className="bottom-0 left-0 right-0 bg-transparent">
      <div className="container mx-auto p-4 flex items-center justify-center">
        <div className="bg-black/60 text-white rounded-full py-2 px-4 inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#7EC69C] flex items-center justify-center">
            {currentProgress === totalSteps ? (
              <Check className="w-5 h-5" />
            ) : (
              <span className="font-medium">{currentProgress}</span>
            )}
          </div>
          <span className="font-medium">{currentProgress}/{totalSteps} 남았어요!</span>
        </div>
      </div>
    </div>
  );
};

export default BookingProgress;
